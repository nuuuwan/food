const crypto = require("crypto");
const { buildFoodIdentifier } = require("./_mockStore");

class NonFoodImageError extends Error {
  constructor(message) {
    super(message);
    this.name = "NonFoodImageError";
  }
}

const defaultNutrients = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  saturatedFat: 0,
  cholesterol: 0,
  fiber: 0,
  sodium: 0,
  potassium: 0,
  calcium: 0,
  iron: 0,
  magnesium: 0,
  zinc: 0,
  vitaminD: 0,
  vitaminB12: 0,
  folate: 0,
  vitaminC: 0,
  sugar: 0,
  addedSugar: 0,
  caffeine: 0,
  alcohol: 0,
};

const DEFAULT_CLASSIFICATIONS = {
  singaporeNutriGrade: "-",
  novaClassCode: "-",
  novaClassLabel: "Unknown",
};

const NOVA_LABEL_BY_CODE = {
  "NOVA 1": "Unprocessed or minimally processed",
  "NOVA 2": "Processed culinary ingredient",
  "NOVA 3": "Processed food",
  "NOVA 4": "Ultra-processed food",
};

const toNonNegativeNumber = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.max(0, parsed);
};

const normalizeNutriGrade = (value) => {
  const normalized = String(value || "")
    .trim()
    .toUpperCase();
  return ["A", "B", "C", "D"].includes(normalized) ? normalized : "-";
};

const normalizeNovaCode = (value) => {
  const normalized = String(value || "")
    .trim()
    .toUpperCase();
  const match = normalized.match(/([1-4])/);
  return match ? `NOVA ${match[1]}` : "-";
};

const inferNutriGradeFromNutrients = (nutrients) => {
  const sugar = toNonNegativeNumber(nutrients?.sugar);
  const saturatedFat = toNonNegativeNumber(nutrients?.saturatedFat);

  const sugarGrade =
    sugar <= 1 ? "A" : sugar <= 5 ? "B" : sugar <= 10 ? "C" : "D";
  const satFatGrade =
    saturatedFat <= 0.7
      ? "A"
      : saturatedFat <= 1.2
        ? "B"
        : saturatedFat <= 2.8
          ? "C"
          : "D";

  const rank = { A: 1, B: 2, C: 3, D: 4 };
  return rank[sugarGrade] >= rank[satFatGrade] ? sugarGrade : satFatGrade;
};

const inferNovaCodeFromIngredients = (ingredients, nutrients) => {
  const normalizedIngredients = (ingredients || [])
    .map((ingredient) => String(ingredient?.name || "").toLowerCase())
    .filter(Boolean);
  const ingredientCount = normalizedIngredients.length;

  if (ingredientCount === 0) {
    return "-";
  }

  const additiveKeywords = [
    "flavour",
    "flavor",
    "emulsifier",
    "stabilizer",
    "stabiliser",
    "preservative",
    "sweetener",
    "colour",
    "color",
    "maltodextrin",
    "hydrogenated",
    "modified starch",
    "high fructose",
  ];
  const hasAdditiveSignals = normalizedIngredients.some((name) =>
    additiveKeywords.some((keyword) => name.includes(keyword)),
  );
  const hasAddedSugar = toNonNegativeNumber(nutrients?.addedSugar) > 0;
  const hasManyIngredients = ingredientCount >= 5;

  if (hasAdditiveSignals || (hasManyIngredients && hasAddedSugar)) {
    return "NOVA 4";
  }
  if (hasManyIngredients || hasAddedSugar) {
    return "NOVA 3";
  }
  if (ingredientCount >= 2) {
    return "NOVA 2";
  }
  return "NOVA 1";
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

  return {
    ...DEFAULT_CLASSIFICATIONS,
    singaporeNutriGrade,
    novaClassCode,
    novaClassLabel: NOVA_LABEL_BY_CODE[novaClassCode] || "Unknown",
  };
};

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

const parseDataUrl = (imageData) => {
  if (!imageData || typeof imageData !== "string") {
    return null;
  }
  const match = imageData.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
  return match ? { mimeType: match[1], data: match[2] } : null;
};

const hashImageInput = (imageData, parsedImage) => {
  if (!imageData) {
    return "";
  }
  const hasher = crypto.createHash("sha256");
  hasher.update(
    parsedImage?.data
      ? Buffer.from(parsedImage.data, "base64")
      : String(imageData),
  );
  return hasher.digest("hex");
};

const extractJsonObject = (text) => {
  const jsonBlock = typeof text === "string" ? text.match(/\{[\s\S]*\}/) : null;
  if (!jsonBlock) {
    return null;
  }
  try {
    return JSON.parse(jsonBlock[0]);
  } catch {
    return null;
  }
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
  NonFoodImageError,
  parseDataUrl,
  hashImageInput,
  extractJsonObject,
  normalizeGeminiAnalysis,
};
