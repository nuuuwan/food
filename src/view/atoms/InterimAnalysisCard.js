import React from "react";
import { Paper, Typography } from "@mui/material";

const InterimAnalysisCard = ({ preview }) => {
  if (!preview) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 420,
        p: 1.25,
        mb: 2,
        bgcolor: "action.hover",
        textAlign: "left",
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Interim analysis
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {preview.productName}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 0.5 }}
      >
        Calories: {preview.calories ?? "-"} kcal
        {preview.servingSize ? ` • Serving: ${preview.servingSize}` : ""}
      </Typography>
    </Paper>
  );
};

export default InterimAnalysisCard;
