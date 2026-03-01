import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import CalorieBreakdownSection from "./CalorieBreakdownSection";
import DailyValueNutrientsSection from "./DailyValueNutrientsSection";
import VitaminsDVSection from "./VitaminsDVSection";
import MineralsDVSection from "./MineralsDVSection";
import ClassificationExplanations from "./ClassificationExplanations";

const fadeSx = (isProcessing, ready) => ({
  opacity: isProcessing && !ready ? 0.1 : 1,
  transition: "opacity 260ms ease",
});

const FoodNutrientCard = ({
  nutrients,
  calorieSegments,
  totalCalories,
  totalMacroCalories,
  sortedVisibleVitaminFields,
  sortedVisibleMineralFields,
  singaporeNutriGrade,
  singaporeNutriGradeReason,
  novaClass,
  novaClassReason,
  novaSpecificItemText,
  warningBadges,
  isProcessing,
  statusMessage,
}) => (
  <Box sx={{ mb: 3, ...fadeSx(isProcessing, Boolean(nutrients)) }}>
    {isProcessing && !nutrients && (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <CircularProgress size={18} thickness={5} />
        <Typography variant="body2" color="text.secondary">
          {statusMessage || "Analyzing image..."}
        </Typography>
      </Box>
    )}
    <CalorieBreakdownSection
      calorieSegments={calorieSegments}
      totalCalories={totalCalories}
      totalMacroCalories={totalMacroCalories}
    />

    <DailyValueNutrientsSection nutrients={nutrients} />

    <VitaminsDVSection
      nutrients={nutrients}
      sortedVisibleVitaminFields={sortedVisibleVitaminFields}
    />

    <MineralsDVSection
      nutrients={nutrients}
      sortedVisibleMineralFields={sortedVisibleMineralFields}
    />

    <ClassificationExplanations
      warningBadges={warningBadges}
      singaporeNutriGrade={singaporeNutriGrade}
      singaporeNutriGradeReason={singaporeNutriGradeReason}
      novaClass={novaClass}
      novaClassReason={novaClassReason}
      novaSpecificItemText={novaSpecificItemText}
    />

    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ display: "block", mt: 2 }}
    >
      Results are estimated from label text extracted from the uploaded image
      and model-based nutrient inference. Prompt and analysis logic
      (requestGeminiAnalysis, Google Gemini gemini-2.0-flash by Google):{" "}
      <a
        href="https://github.com/nuuuwan/food/blob/main/api/analyze.js"
        target="_blank"
        rel="noreferrer"
      >
        api/analyze.js
      </a>
      .
    </Typography>
  </Box>
);

export default FoodNutrientCard;
