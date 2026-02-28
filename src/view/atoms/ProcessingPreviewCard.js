import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const ProcessingPreviewCard = ({ imageUri }) => {
  if (!imageUri) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 420,
        p: 1,
        mb: 2,
        bgcolor: "action.hover",
      }}
    >
      <Box
        component="img"
        src={imageUri}
        alt="Processing preview"
        sx={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 1 }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 0.75 }}
      >
        Optimized preview used for upload and analysis
      </Typography>
    </Paper>
  );
};

export default ProcessingPreviewCard;
