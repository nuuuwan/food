import { toNullableNumber } from "./nutritionUtils";

export const NOVA_BADGE_COLORS = {
  1: "#38b000",
  2: "#8abf2f",
  3: "#f0a128",
  4: "#c71c22",
};

export const getNovaLabelByCode = (code) =>
  ({
    "NOVA 1": "Unprocessed or minimally processed",
    "NOVA 2": "Processed culinary ingredient",
    "NOVA 3": "Processed food",
    "NOVA 4": "Ultra-processed food",
  })[code] || "Unknown";

export const inferNormalizedNovaCode = (rawValue) => {
  const normalized = String(rawValue || "")
    .trim()
    .toUpperCase();
  const match = normalized.match(/([1-4])/);
  return match ? `NOVA ${match[1]}` : "-";
};

const ADDITIVE_KEYWORDS = [
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

export const inferNOVAClass = (ingredients, nutrients) => {
  const normalizedIngredients = (ingredients || [])
    .map((ingredient) => String(ingredient?.name || "").toLowerCase())
    .filter(Boolean);
  const ingredientCount = normalizedIngredients.length;

  if (ingredientCount === 0) {
    return { code: "-", label: "Unknown" };
  }

  const hasAdditiveSignals = normalizedIngredients.some((name) =>
    ADDITIVE_KEYWORDS.some((keyword) => name.includes(keyword)),
  );

  const hasAddedSugar = (toNullableNumber(nutrients?.addedSugar) || 0) > 0;
  const hasManyIngredients = ingredientCount >= 5;

  if (hasAdditiveSignals || (hasManyIngredients && hasAddedSugar)) {
    return { code: "NOVA 4", label: "Ultra-processed food" };
  }

  if (hasManyIngredients || hasAddedSugar) {
    return { code: "NOVA 3", label: "Processed food" };
  }

  if (ingredientCount >= 2) {
    return { code: "NOVA 2", label: "Processed culinary ingredient" };
  }

  return { code: "NOVA 1", label: "Unprocessed or minimally processed" };
};

export const resolveNovaClass = (displayFood, ingredients, nutrients) => {
  const modelCode = inferNormalizedNovaCode(
    displayFood?.classifications?.novaClassCode ||
      displayFood?.classifications?.novaClass,
  );
  const modelLabel = String(
    displayFood?.classifications?.novaClassLabel || "",
  ).trim();
  const modelReason = String(
    displayFood?.classifications?.novaClassReason || "",
  ).trim();
  const modelTriggerItems = Array.isArray(
    displayFood?.classifications?.novaTriggerItems,
  )
    ? displayFood.classifications.novaTriggerItems.filter(Boolean)
    : [];

  const inferred = inferNOVAClass(ingredients, nutrients);
  const novaClass =
    modelCode !== "-"
      ? { code: modelCode, label: modelLabel || getNovaLabelByCode(modelCode) }
      : inferred;

  return { novaClass, modelReason, modelTriggerItems };
};
