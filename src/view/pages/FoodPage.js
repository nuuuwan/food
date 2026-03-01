import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Box, Container, Typography } from "@mui/material";
import { useData } from "../../nonview/core/DataContext";
import {
  toNullableNumber,
  getDailyValuePercent,
  getServingSizeGrams,
  formatNumber,
  formatIngredientListText,
} from "../../nonview/core/nutritionUtils";
import {
  VITAMIN_DV_FIELDS,
  MINERAL_DV_FIELDS,
} from "../../nonview/core/nutritionConstants";
import {
  resolveSingaporeNutriGrade,
  SINGAPORE_GRADE_SCALE,
} from "../../nonview/core/singaporeNutriGrade";
import {
  resolveNovaClass,
  NOVA_BADGE_COLORS,
} from "../../nonview/core/novaClass";
import { buildWarningBadges } from "../../nonview/core/trafficLight";
import PhotoCollage from "../moles/PhotoCollage";
import FoodNutrientCard from "../moles/FoodNutrientCard";

const FoodPage = () => {
  const theme = useTheme();
  const { foodId } = useParams();
  const { currentFood, foodHistory, loadFoodById } = useData();

  const routeFoodFromHistory = useMemo(
    () => foodHistory.find((item) => item.id === foodId) || null,
    [foodHistory, foodId],
  );

  useEffect(() => {
    if (!foodId) return;
    if (!currentFood || currentFood.id !== foodId) {
      loadFoodById(foodId);
    }
  }, [foodId, currentFood, loadFoodById]);

  const displayFood =
    currentFood && currentFood.id === foodId
      ? currentFood
      : routeFoodFromHistory;

  if (!displayFood) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const {
    productName,
    nutrients,
    ingredients,
    servingSize,
    timestamp,
    photos,
  } = displayFood;

  // --- Macro nutrients ---
  const protein = toNullableNumber(nutrients?.protein) || 0;
  const fat = toNullableNumber(nutrients?.fat) || 0;
  const carbs = toNullableNumber(nutrients?.carbs) || 0;
  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;
  const carbsCalories = carbs * 4;
  const totalMacroCalories = proteinCalories + fatCalories + carbsCalories;
  const totalCalories =
    toNullableNumber(nutrients?.calories) || totalMacroCalories;

  // --- Per-100g values ---
  const sodiumMg = toNullableNumber(nutrients?.sodium);
  const fatGrams = toNullableNumber(nutrients?.fat);
  const sugarGrams = toNullableNumber(nutrients?.sugar);
  const saltGrams =
    sodiumMg === null || sodiumMg === undefined
      ? null
      : (sodiumMg / 1000) * 2.5;
  const servingSizeGrams = getServingSizeGrams(servingSize);
  const nutrientMassLowerBound = [protein, fat, carbs].reduce(
    (total, value) => total + (Number.isFinite(value) ? value : 0),
    0,
  );
  const effectiveServingSizeGrams =
    servingSizeGrams && servingSizeGrams > 0
      ? Math.max(servingSizeGrams, nutrientMassLowerBound)
      : nutrientMassLowerBound > 0
        ? nutrientMassLowerBound
        : null;

  const toPer100g = (valueInGrams) => {
    if (valueInGrams === null || valueInGrams === undefined) return null;
    if (!effectiveServingSizeGrams || effectiveServingSizeGrams <= 0)
      return valueInGrams;
    return (valueInGrams / effectiveServingSizeGrams) * 100;
  };

  const sugarPer100g = toPer100g(sugarGrams);
  const saltPer100g = toPer100g(saltGrams);
  const fatPer100g = toPer100g(fatGrams);
  const saturatedFatPer100g = toPer100g(
    toNullableNumber(nutrients?.saturatedFat) || 0,
  );

  // --- Classifications ---
  const {
    grade: singaporeNutriGrade,
    modelReason: singaporeNutriGradeModelReason,
  } = resolveSingaporeNutriGrade(
    displayFood,
    sugarPer100g,
    saturatedFatPer100g,
  );
  const singaporeNutriGradeReason =
    singaporeNutriGradeModelReason ||
    `Estimated from sugar ${formatNumber(sugarPer100g, 1)}g and saturated fat ${formatNumber(saturatedFatPer100g, 1)}g per 100g.`;

  const {
    novaClass,
    modelReason: novaModelReason,
    modelTriggerItems,
  } = resolveNovaClass(displayFood, ingredients, nutrients);
  const novaClassReason =
    novaModelReason ||
    `Estimated from ingredient profile (${(ingredients || []).length} listed) and added sugar ${formatNumber(toNullableNumber(nutrients?.addedSugar) || 0, 1)}g.`;
  const novaSpecificItemText =
    modelTriggerItems.length > 0 ? modelTriggerItems.join(", ") : "";
  const novaClassNumber = (novaClass.code.match(/(\d+)/) || [])[1] || "-";
  const novaBadgeColor =
    NOVA_BADGE_COLORS[novaClassNumber] || theme.palette.grey[500];

  // --- Warning badges (traffic light) ---
  const warningBadges = buildWarningBadges(
    sugarPer100g,
    saltPer100g,
    fatPer100g,
    theme,
  );

  // --- Calorie segments ---
  const calorieSegments = [
    {
      key: "protein",
      label: "Protein",
      grams: protein,
      gramsUnit: "g",
      dailyValue: 50,
      dailyValueUnit: "g",
      calories: proteinCalories,
      color: "#2e7d32",
    },
    {
      key: "fat",
      label: "Fat",
      grams: fat,
      gramsUnit: "g",
      dailyValue: 78,
      dailyValueUnit: "g",
      calories: fatCalories,
      color: "#ef6c00",
    },
    {
      key: "carbs",
      label: "Carbs",
      grams: carbs,
      gramsUnit: "g",
      dailyValue: 275,
      dailyValueUnit: "g",
      calories: carbsCalories,
      color: "#c62828",
    },
  ];

  // --- Visible daily value fields (vitamins & minerals) ---
  const getVisibleDVFields = (fields) =>
    fields.filter((item) => {
      const rawValue = toNullableNumber(nutrients?.[item.key]);
      const percent = getDailyValuePercent(
        rawValue,
        item.sourceUnit,
        item.dailyValue,
        item.dailyValueUnit,
      );
      return percent === null || percent >= 0.5;
    });

  const getFieldDVPercent = (field) => {
    const rawValue = toNullableNumber(nutrients?.[field.key]);
    const percent = getDailyValuePercent(
      rawValue,
      field.sourceUnit,
      field.dailyValue,
      field.dailyValueUnit,
    );
    return percent === null ? -1 : percent;
  };

  const sortedVisibleVitaminFields = getVisibleDVFields(VITAMIN_DV_FIELDS).sort(
    (a, b) => getFieldDVPercent(b) - getFieldDVPercent(a),
  );

  const sortedVisibleMineralFields = getVisibleDVFields(MINERAL_DV_FIELDS).sort(
    (a, b) => getFieldDVPercent(b) - getFieldDVPercent(a),
  );

  const ingredientListText = formatIngredientListText(ingredients);

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          ml: "calc(50% - 50vw)",
          mr: "calc(50% - 50vw)",
          mt: 0,
          mb: 3,
        }}
      >
        <PhotoCollage
          photos={photos}
          productName={productName}
          timestamp={timestamp}
          warningBadges={warningBadges}
          singaporeNutriGrade={singaporeNutriGrade}
          singaporeGradeScale={SINGAPORE_GRADE_SCALE}
          novaBadgeColor={novaBadgeColor}
          novaClassNumber={novaClassNumber}
        />
      </Box>

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2.5, fontStyle: "italic" }}
        >
          {ingredientListText || "-"}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Serving Size: {servingSize || "-"}
          {effectiveServingSizeGrams !== null
            ? ` • ${formatNumber(effectiveServingSizeGrams, 1)} g`
            : ""}
        </Typography>

        <FoodNutrientCard
          nutrients={nutrients}
          calorieSegments={calorieSegments}
          totalCalories={totalCalories}
          totalMacroCalories={totalMacroCalories}
          sortedVisibleVitaminFields={sortedVisibleVitaminFields}
          sortedVisibleMineralFields={sortedVisibleMineralFields}
          singaporeNutriGrade={singaporeNutriGrade}
          singaporeNutriGradeReason={singaporeNutriGradeReason}
          novaClass={novaClass}
          novaClassReason={novaClassReason}
          novaSpecificItemText={novaSpecificItemText}
          warningBadges={warningBadges}
        />
      </Container>
    </>
  );
};

export default FoodPage;
