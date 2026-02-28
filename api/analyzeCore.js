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
  const nutrients = analysis?.nutrients || {};
  const ingredients = Array.isArray(analysis?.ingredients)
    ? analysis.ingredients.map((item) =>
        typeof item === "string"
          ? { name: item, quantity: "unknown" }
          : {
              name: item?.name || "Unknown ingredient",
              quantity: item?.quantity || "unknown",
            },
      )
    : [];

  return {
    id,
    timestamp,
    productName: analysis?.productName || "Unidentified Food Item",
    servingSize: analysis?.servingSize || "Unknown",
    nutrients: { ...defaultNutrients, ...nutrients },
    ingredients,
    warnings: Array.isArray(analysis?.warnings) ? analysis.warnings : [],
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
