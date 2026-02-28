import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const HistoryCardImage = ({ food }) => {
  const photos = food.photos || [];

  if (photos.length === 0) {
    return (
      <Box
        sx={{
          height: 200,
          bgcolor: "grey.200",
          display: "grid",
          placeItems: "center",
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

  return (
    <Box sx={{ height: 200, position: "relative" }}>
      <Grid container spacing={0.25} sx={{ height: "100%" }}>
        {photos.slice(0, 4).map((photo, index) => (
          <Grid item xs={6} key={photo.id} sx={{ height: "50%" }}>
            <img
              src={photo.imageUri}
              alt={`${food.productName} - ${index + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
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

export default HistoryCardImage;
