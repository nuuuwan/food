import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import CalorieBreakdownSection from "./CalorieBreakdownSection";
import DailyValueNutrientsSection from "./DailyValueNutrientsSection";
import VitaminsDVSection from "./VitaminsDVSection";
import MineralsDVSection from "./MineralsDVSection";
import ClassificationExplanations from "./ClassificationExplanations";

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
}) => (
  <Card sx={{ mb: 3 }}>
    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
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
    </CardContent>
  </Card>
);

export default FoodNutrientCard;
