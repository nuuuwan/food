import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const CameraPreviewCard = ({ previewImage }) => (
  <Paper
    elevation={3}
    sx={{
      height: 400,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f5f5",
      mb: 3,
      position: "relative",
      overflow: "hidden",
    }}
  >
    {previewImage ? (
      <img
        src={previewImage}
        alt="Selected food"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    ) : (
      <Box sx={{ textAlign: "center" }}>
        <CameraAltIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Upload Food Image
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select an image to analyze
        </Typography>
      </Box>
    )}
    <Box
      sx={{
        position: "absolute",
        width: "80%",
        height: "60%",
        border: "3px solid",
        borderColor: "primary.main",
        borderRadius: 2,
        opacity: 0.5,
      }}
    />
  </Paper>
);

export default CameraPreviewCard;
