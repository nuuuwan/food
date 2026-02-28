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
  singaporeNutriGradeReason: "",
  novaClassCode: "-",
  novaClassLabel: "Unknown",
  novaClassReason: "",
  novaTriggerItems: [],
};

const NOVA_LABEL_BY_CODE = {
  "NOVA 1": "Unprocessed or minimally processed",
  "NOVA 2": "Processed culinary ingredient",
  "NOVA 3": "Processed food",
  "NOVA 4": "Ultra-processed food",
};

const NOVA_SIGNAL_KEYWORDS = [
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
  "syrup",
  "fructose",
  "glucose",
  "dextrose",
  "artificial",
];

const NOVA_EXTRA_TRIGGER_KEYWORDS = [
  "sugar",
  "invert",
  "corn syrup",
  "hfcs",
  "maltose",
  "glucose syrup",
];

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

const normalizeShortReason = (value, maxLength = 160) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

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

const inferNutriGradeReasonFromNutrients = (nutrients) => {
  const sugar = toNonNegativeNumber(nutrients?.sugar).toFixed(1);
  const saturatedFat = toNonNegativeNumber(nutrients?.saturatedFat).toFixed(1);
  return `Based on sugar ${sugar}g and saturated fat ${saturatedFat}g per 100g estimate.`;
};

const inferNovaCodeFromIngredients = (ingredients, nutrients) => {
  const normalizedIngredients = (ingredients || [])
    .map((ingredient) => String(ingredient?.name || "").toLowerCase())
    .filter(Boolean);
  const ingredientCount = normalizedIngredients.length;

  if (ingredientCount === 0) {
    return "-";
  }

  const hasAdditiveSignals = normalizedIngredients.some((name) =>
    NOVA_SIGNAL_KEYWORDS.some((keyword) => name.includes(keyword)),
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

const getIngredientNames = (ingredients) =>
  (ingredients || [])
    .map((ingredient) => String(ingredient?.name || "").trim())
    .filter(Boolean);

const getNovaSignalIngredients = (ingredients) => {
  const names = getIngredientNames(ingredients);
  return names.filter((name) =>
    NOVA_SIGNAL_KEYWORDS.some((keyword) =>
      name.toLowerCase().includes(keyword),
    ),
  );
};

const getNovaTriggerItems = (ingredients) => {
  const names = getIngredientNames(ingredients);
  const triggers = names.filter((name) => {
    const lower = name.toLowerCase();
    return (
      NOVA_SIGNAL_KEYWORDS.some((keyword) => lower.includes(keyword)) ||
      NOVA_EXTRA_TRIGGER_KEYWORDS.some((keyword) => lower.includes(keyword))
    );
  });

  if (triggers.length > 0) {
    return Array.from(new Set(triggers)).slice(0, 4);
  }

  return names.slice(0, 2);
};

const containsNamedIngredient = (reason, ingredients) => {
  const reasonText = String(reason || "").toLowerCase();
  if (!reasonText) {
    return false;
  }
  return getIngredientNames(ingredients).some((name) =>
    reasonText.includes(name.toLowerCase()),
  );
};

const inferNovaReasonFromIngredients = (
  ingredients,
  nutrients,
  novaClassCode,
) => {
  const ingredientNames = getIngredientNames(ingredients);
  const ingredientCount = ingredientNames.length;
  const signalIngredients = getNovaSignalIngredients(ingredients);
  const topSignals = signalIngredients.slice(0, 3);
  const topIngredients = ingredientNames.slice(0, 3);
  const addedSugar = toNonNegativeNumber(nutrients?.addedSugar).toFixed(1);
  const base = `${ingredientCount} listed ingredient${ingredientCount === 1 ? "" : "s"}`;

  if (novaClassCode === "NOVA 4") {
    if (topSignals.length > 0) {
      return `Classified NOVA 4 due to ultra-processed ingredients: ${topSignals.join(", ")}.`;
    }
    if (topIngredients.length > 0) {
      return `Classified NOVA 4; likely ultra-processed based on ingredients including ${topIngredients.join(", ")}.`;
    }
    return `${base} with additive/processing signals and added sugar (${addedSugar}g).`;
  }
  if (novaClassCode === "NOVA 3") {
    if (topIngredients.length > 0) {
      return `Classified NOVA 3 from processed profile with ingredients like ${topIngredients.join(", ")}.`;
    }
    return `${base} with processing indicators or added sugar (${addedSugar}g).`;
  }
  if (novaClassCode === "NOVA 2") {
    if (topIngredients.length > 0) {
      return `Classified NOVA 2 from simple processed ingredients such as ${topIngredients.join(", ")}.`;
    }
    return `${base} suggests processed culinary ingredient profile.`;
  }
  if (novaClassCode === "NOVA 1") {
    if (topIngredients.length > 0) {
      return `Classified NOVA 1; ingredients appear minimally processed (${topIngredients.join(", ")}).`;
    }
    return `${base} suggests minimal processing profile.`;
  }
  return "Insufficient evidence for a confident NOVA explanation.";
};

const ensureSpecificNovaReason = (reason, novaClassCode, ingredients) => {
  const normalizedReason = normalizeShortReason(reason);
  if (novaClassCode !== "NOVA 4") {
    return normalizedReason;
  }

  if (containsNamedIngredient(normalizedReason, ingredients)) {
    return normalizedReason;
  }

  const triggerItems = getNovaTriggerItems(ingredients);
  if (triggerItems.length > 0) {
    return normalizeShortReason(
      `${normalizedReason || "Classified NOVA 4."} Specific ultra-processed ingredient(s): ${triggerItems.join(", ")}.`,
    );
  }

  const topIngredients = getIngredientNames(ingredients).slice(0, 2);
  if (topIngredients.length > 0) {
    return normalizeShortReason(
      `${normalizedReason || "Classified NOVA 4."} Noted ingredient(s): ${topIngredients.join(", ")}.`,
    );
  }

  return normalizedReason;
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
