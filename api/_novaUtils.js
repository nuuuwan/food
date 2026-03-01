const {
  toNonNegativeNumber,
  normalizeShortReason,
} = require("./_nutriGradeUtils");

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

module.exports = {
  NOVA_SIGNAL_KEYWORDS,
  NOVA_EXTRA_TRIGGER_KEYWORDS,
  getIngredientNames,
  getNovaSignalIngredients,
  getNovaTriggerItems,
  inferNovaCodeFromIngredients,
  containsNamedIngredient,
  inferNovaReasonFromIngredients,
  ensureSpecificNovaReason,
};
