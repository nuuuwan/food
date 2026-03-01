import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import {
  toNullableNumber,
  getDailyValuePercent,
  getServingSizeGrams,
  formatNumber,
  formatIngredientListText,
} from "./nutritionUtils";
import { VITAMIN_DV_FIELDS, MINERAL_DV_FIELDS } from "./nutritionConstants";
import {
  resolveSingaporeNutriGrade,
  SINGAPORE_GRADE_SCALE,
} from "./singaporeNutriGrade";
import { resolveNovaClass, NOVA_BADGE_COLORS } from "./novaClass";
import { buildWarningBadges } from "./trafficLight";

const CALORIE_SEGMENT_DEFS = [
  {
    key: "protein",
    label: "Protein",
    kcalPerG: 4,
    dailyValue: 50,
    color: "#2e7d32",
  },
  { key: "fat", label: "Fat", kcalPerG: 9, dailyValue: 78, color: "#ef6c00" },
  {
    key: "carbs",
    label: "Carbs",
    kcalPerG: 4,
    dailyValue: 275,
    color: "#c62828",
  },
];

export const useFoodPageData = (displayFood) => {
  const theme = useTheme();

  return useMemo(() => {
    const { nutrients, ingredients, servingSize } = displayFood || {};

    // --- Macro nutrients ---
    const protein = toNullableNumber(nutrients?.protein) || 0;
    const fat = toNullableNumber(nutrients?.fat) || 0;
    const carbs = toNullableNumber(nutrients?.carbs) || 0;

    const calorieSegments = CALORIE_SEGMENT_DEFS.map((def) => {
      const grams = toNullableNumber(nutrients?.[def.key]) || 0;
      return {
        key: def.key,
        label: def.label,
        grams,
        gramsUnit: "g",
        dailyValue: def.dailyValue,
        dailyValueUnit: "g",
        calories: grams * def.kcalPerG,
        color: def.color,
      };
    });

    const totalMacroCalories = calorieSegments.reduce(
      (s, c) => s + c.calories,
      0,
    );
    const totalCalories =
      toNullableNumber(nutrients?.calories) || totalMacroCalories;

    // --- Per-100g values ---
    const sodiumMg = toNullableNumber(nutrients?.sodium);
    const fatGrams = toNullableNumber(nutrients?.fat);
    const sugarGrams = toNullableNumber(nutrients?.sugar);
    const saltGrams = sodiumMg == null ? null : (sodiumMg / 1000) * 2.5;

    const servingSizeGrams = getServingSizeGrams(servingSize);
    const nutrientMassLowerBound = [protein, fat, carbs].reduce(
      (total, v) => total + (Number.isFinite(v) ? v : 0),
      0,
    );
    const effectiveServingSizeGrams =
      servingSizeGrams && servingSizeGrams > 0
        ? Math.max(servingSizeGrams, nutrientMassLowerBound)
        : nutrientMassLowerBound > 0
          ? nutrientMassLowerBound
          : null;

    const toPer100g = (v) => {
      if (v == null) return null;
      if (!effectiveServingSizeGrams || effectiveServingSizeGrams <= 0)
        return v;
      return (v / effectiveServingSizeGrams) * 100;
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

    // --- Warning badges ---
    const warningBadges = buildWarningBadges(
      sugarPer100g,
      saltPer100g,
      fatPer100g,
      theme,
    );

    // --- Visible DV fields (vitamins & minerals) ---
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

    const sortedVisibleVitaminFields = getVisibleDVFields(
      VITAMIN_DV_FIELDS,
    ).sort((a, b) => getFieldDVPercent(b) - getFieldDVPercent(a));
    const sortedVisibleMineralFields = getVisibleDVFields(
      MINERAL_DV_FIELDS,
    ).sort((a, b) => getFieldDVPercent(b) - getFieldDVPercent(a));

    const ingredientListText = formatIngredientListText(ingredients);

    return {
      calorieSegments,
      totalCalories,
      totalMacroCalories,
      effectiveServingSizeGrams,
      singaporeNutriGrade,
      singaporeNutriGradeReason,
      SINGAPORE_GRADE_SCALE,
      novaClass,
      novaClassReason,
      novaSpecificItemText,
      novaClassNumber,
      novaBadgeColor,
      warningBadges,
      sortedVisibleVitaminFields,
      sortedVisibleMineralFields,
      ingredientListText,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayFood, theme]);
};
