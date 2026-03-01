const crypto = require("crypto");
const { buildFoodIdentifier } = require("./_mockStore");
const {
  defaultNutrients,
  DEFAULT_CLASSIFICATIONS,
  NOVA_LABEL_BY_CODE,
} = require("./_foodDefaults");
const {
  toNonNegativeNumber,
  normalizeNutriGrade,
  normalizeNovaCode,
  normalizeShortReason,
  inferNutriGradeFromNutrients,
  inferNutriGradeReasonFromNutrients,
} = require("./_nutriGradeUtils");
const {
  getNovaTriggerItems,
  inferNovaCodeFromIngredients,
  inferNovaReasonFromIngredients,
  ensureSpecificNovaReason,
} = require("./_novaUtils");

const alignIngredientsAndNutrients = ({ nutrients, ingredients, warnings }) => {
  const normalizedNutrients = { ...defaultNutrients };
  Object.keys(defaultNutrients).forEach((key) => {
    normalizedNutrients[key] = toNonNegativeNumber(nutrients?.[key]);
  });

  if (normalizedNutrients.sugar > normalizedNutrients.carbs) {
    normalizedNutrients.carbs = normalizedNutrients.sugar;
  }
  if (normalizedNutrients.fiber > normalizedNutrients.carbs) {
    normalizedNutrients.fiber = normalizedNutrients.carbs;
  }
  if (normalizedNutrients.addedSugar > normalizedNutrients.sugar) {
    normalizedNutrients.addedSugar = normalizedNutrients.sugar;
  }
  if (normalizedNutrients.saturatedFat > normalizedNutrients.fat) {
    normalizedNutrients.saturatedFat = normalizedNutrients.fat;
  }

  const macroCalories =
    normalizedNutrients.protein * 4 +
    normalizedNutrients.carbs * 4 +
    normalizedNutrients.fat * 9;
  if (normalizedNutrients.calories < macroCalories) {
    normalizedNutrients.calories = macroCalories;
  }

  const normalizedIngredients =
    Array.isArray(ingredients) && ingredients.length > 0
      ? ingredients
      : [
          {
            name: "Unknown ingredients (label unreadable)",
            quantity: "unknown",
          },
        ];

  const ingredientText = normalizedIngredients
    .map((ingredient) => String(ingredient?.name || "").toLowerCase())
    .join(" ");
  const consistencyWarnings = [];

  if (
    normalizedNutrients.sugar >= 8 &&
    !/(sugar|syrup|fructose|glucose|honey|maltose)/.test(ingredientText)
  ) {
    consistencyWarnings.push(
      "Sugar appears high versus listed ingredients; verify OCR extraction.",
    );
  }
  if (
    normalizedNutrients.sodium >= 400 &&
    !/(salt|sodium|msg|monosodium)/.test(ingredientText)
  ) {
    consistencyWarnings.push(
      "Sodium appears high versus listed ingredients; verify OCR extraction.",
    );
  }
  if (/(sugar|syrup|fructose|glucose|honey|maltose)/.test(ingredientText)) {
    if (normalizedNutrients.sugar === 0) {
      consistencyWarnings.push(
        "Ingredients suggest sugar presence but sugar nutrient is 0; verify OCR extraction.",
      );
    }
  }

  const mergedWarnings = Array.from(
    new Set([
      ...(Array.isArray(warnings) ? warnings : []),
      ...consistencyWarnings,
    ]),
  );

  return {
    nutrients: normalizedNutrients,
    ingredients: normalizedIngredients,
    warnings: mergedWarnings,
  };
};

const normalizeClassifications = (analysis, nutrients, ingredients) => {
  const provided = analysis?.classifications || {};
  const normalizedNutriGrade = normalizeNutriGrade(
    provided?.singaporeNutriGrade || analysis?.nutriGrade,
  );
  const normalizedNovaCode = normalizeNovaCode(
    provided?.novaClassCode || provided?.novaClass || analysis?.novaClass,
  );

  const singaporeNutriGrade =
    normalizedNutriGrade === "-"
      ? inferNutriGradeFromNutrients(nutrients)
      : normalizedNutriGrade;
  const novaClassCode =
    normalizedNovaCode === "-"
      ? inferNovaCodeFromIngredients(ingredients, nutrients)
      : normalizedNovaCode;

  const singaporeNutriGradeReason =
    normalizeShortReason(
      provided?.singaporeNutriGradeReason || analysis?.nutriGradeReason,
    ) || inferNutriGradeReasonFromNutrients(nutrients);
  const rawNovaClassReason =
    normalizeShortReason(
      provided?.novaClassReason || analysis?.novaClassReason,
    ) || inferNovaReasonFromIngredients(ingredients, nutrients, novaClassCode);
  const providedTriggerItems = Array.isArray(provided?.novaTriggerItems)
    ? provided.novaTriggerItems
        .map((item) => String(item || "").trim())
        .filter(Boolean)
        .slice(0, 4)
    : [];
  const inferredTriggerItems = getNovaTriggerItems(ingredients);
  const novaTriggerItems =
    providedTriggerItems.length > 0
      ? providedTriggerItems
      : inferredTriggerItems;
  const novaClassReason = ensureSpecificNovaReason(
    rawNovaClassReason,
    novaClassCode,
    ingredients,
  );

  return {
    ...DEFAULT_CLASSIFICATIONS,
    singaporeNutriGrade,
    singaporeNutriGradeReason,
    novaClassCode,
    novaClassLabel: NOVA_LABEL_BY_CODE[novaClassCode] || "Unknown",
    novaClassReason,
    novaTriggerItems,
  };
};

const normalizeGeminiAnalysis = (analysis, imageData, imageHash) => {
  const timestamp = Date.now();
  const id = buildFoodIdentifier(
    analysis?.productName || "unidentified-food-item",
    imageHash,
  );
  const rawNutrients = analysis?.nutrients || {};
  const rawIngredients = Array.isArray(analysis?.ingredients)
    ? analysis.ingredients.map((item) =>
        typeof item === "string"
          ? { name: item, quantity: "unknown" }
          : {
              name: item?.name || "Unknown ingredient",
              quantity: item?.quantity || "unknown",
            },
      )
    : [];
  const aligned = alignIngredientsAndNutrients({
    nutrients: rawNutrients,
    ingredients: rawIngredients,
    warnings: analysis?.warnings,
  });
  const classifications = normalizeClassifications(
    analysis,
    aligned.nutrients,
    aligned.ingredients,
  );

  return {
    id,
    timestamp,
    productName: analysis?.productName || "Unidentified Food Item",
    servingSize: analysis?.servingSize || "Unknown",
    nutrients: aligned.nutrients,
    ingredients: aligned.ingredients,
    warnings: aligned.warnings,
    classifications,
    photos: [
      {
        id: `${id}-photo-1`,
        timestamp,
        imageUri: imageData || "/food/peanut-butter.jpg",
      },
    ],
  };
};

module.exports = {
  alignIngredientsAndNutrients,
  normalizeClassifications,
  normalizeGeminiAnalysis,
};
