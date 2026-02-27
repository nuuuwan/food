import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/core/DataContext";
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  CardActionArea,
  Grid,
} from "@mui/material";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { foodHistory } = useData();

  const openUploader = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("food:open-uploader"));
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateStr} at ${timeStr}`;
  };

  const renderCardImage = (food) => {
    const photos = food.photos || [];

    if (photos.length === 0) {
      return (
        <Box
          sx={{
            height: 200,
            bgcolor: "grey.200",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No image
          </Typography>
        </Box>
      );
    }

    if (photos.length === 1) {
      return (
        <Box sx={{ height: 200, overflow: "hidden" }}>
          <img
            src={photos[0].imageUri}
            alt={food.productName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      );
    }

    // Multiple photos - show mini collage
    return (
      <Box sx={{ height: 200, position: "relative" }}>
        <Grid container spacing={0.25} sx={{ height: "100%" }}>
          {photos.slice(0, 4).map((photo, index) => (
            <Grid item xs={6} key={photo.id} sx={{ height: "50%" }}>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <img
                  src={photo.imageUri}
                  alt={`${food.productName} - ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
        {photos.length > 4 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "rgba(0,0,0,0.7)",
              color: "white",
              px: 1,
              py: 0.5,
              fontSize: "0.75rem",
            }}
          >
            +{photos.length - 4}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        History
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {foodHistory.length} scanned item{foodHistory.length !== 1 ? "s" : ""}
      </Typography>

      {foodHistory.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No scans yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start scanning food labels to build your history
          </Typography>
          <Button variant="contained" onClick={openUploader}>
            Scan Your First Label
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {foodHistory.map((food) => (
            <Grid item xs={12} sm={6} md={4} key={food.id}>
              <Card elevation={2}>
                <CardActionArea onClick={() => navigate(`/item/${food.id}`)}>
                  {renderCardImage(food)}
                  <CardContent>
                    <Typography variant="h6" gutterBottom noWrap>
                      {food.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(food.timestamp)}
                      {food.photos && food.photos.length > 1 && (
                        <span> • {food.photos.length} photos</span>
                      )}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default HistoryPage;
