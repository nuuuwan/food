import React from "react";
import { Box, Typography } from "@mui/material";

const ClassificationExplanations = ({
  warningBadges,
  singaporeNutriGrade,
  singaporeNutriGradeReason,
  novaClass,
  novaClassReason,
  novaSpecificItemText,
}) => (
  <Box
    sx={{
      mt: 3,
      p: { xs: 1.75, sm: 2.25 },
      borderRadius: 2,
      backgroundColor: "background.default",
    }}
  >
    <Typography variant="subtitle1" sx={{ mb: 0.8, fontWeight: 600 }}>
      Classification Explanations
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.35 }}>
      🇱🇰 Sri Lanka Traffic Light: Based on estimated sugar, salt, and fat per
      100g.
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.35 }}>
      🇸🇬 Singapore Nutri-Grade: {singaporeNutriGrade} —{" "}
      {singaporeNutriGradeReason}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      🇧🇷 NOVA (Brazil): {novaClass.code} — {novaClassReason}
    </Typography>
    {novaClass.code === "NOVA 4" && novaSpecificItemText && (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 0.35, fontWeight: 700 }}
      >
        Ultra-processed trigger item(s): {novaSpecificItemText}
      </Typography>
    )}
  </Box>
);

export default ClassificationExplanations;
