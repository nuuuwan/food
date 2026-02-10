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
  CardMedia,
  CardActionArea,
  Grid,
} from "@mui/material";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { foodHistory } = useData();

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
          <Button variant="contained" onClick={() => navigate("/camera")}>
            Scan Your First Label
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {foodHistory.map((food) => (
            <Grid item xs={12} sm={6} md={4} key={food.id}>
              <Card elevation={2}>
                <CardActionArea onClick={() => navigate(`/food/${food.id}`)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={food.imageUri}
                    alt={food.productName}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom noWrap>
                      {food.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(food.timestamp)}
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
