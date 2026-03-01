export const toNullableNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const formatNumber = (value, maximumFractionDigits = 1) => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "-";
  }

  const maxDigits = Math.max(0, Number(maximumFractionDigits) || 0);
  const minDigits = Math.min(maxDigits, value % 1 === 0 ? 0 : 1);

  return value.toLocaleString("en-US", {
    maximumFractionDigits: maxDigits,
    minimumFractionDigits: minDigits,
  });
};

export const convertUnit = (value, fromUnit, toUnit) => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return null;
  }

  if (fromUnit === toUnit) {
    return value;
  }

  if (fromUnit === "mg" && toUnit === "g") {
    return value / 1000;
  }

  if (fromUnit === "mcg" && toUnit === "mg") {
    return value / 1000;
  }

  if (fromUnit === "mg" && toUnit === "mcg") {
    return value * 1000;
  }

  return value;
};

export const getDailyValuePercent = (
  rawValue,
  sourceUnit,
  dailyValue,
  dailyValueUnit,
) => {
  if (rawValue === null || rawValue === undefined) {
    return null;
  }

  const normalizedValue = convertUnit(rawValue, sourceUnit, dailyValueUnit);
  if (
    normalizedValue === null ||
    !Number.isFinite(normalizedValue) ||
    !dailyValue ||
    !Number.isFinite(dailyValue)
  ) {
    return null;
  }

  return (normalizedValue / dailyValue) * 100;
};

export const getServingSizeGrams = (servingSizeValue) => {
  if (!servingSizeValue) {
    return null;
  }

  const match = String(servingSizeValue).match(
    /(\d+(?:\.\d+)?)\s*(g|gram|grams)\b/i,
  );
  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
};

export const formatDateTime = (ts) => {
  const date = new Date(ts);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${dateStr} at ${timeStr}`;
};

export const getImageSizeKB = (imageUri) => {
  if (!imageUri || typeof imageUri !== "string") {
    return null;
  }

  const match = imageUri.match(/^data:.*;base64,(.+)$/);
  if (!match) {
    return null;
  }

  const base64 = match[1];
  const bytes = Math.floor((base64.length * 3) / 4);
  return bytes / 1024;
};

export const isUnknownQuantity = (quantity) => {
  if (quantity === null || quantity === undefined) {
    return true;
  }

  const normalized = String(quantity).trim().toLowerCase();
  return normalized === "" || normalized === "unknown";
};

export const formatIngredientListText = (ingredients) =>
  (ingredients || [])
    .map((ingredient) => {
      const name = String(ingredient?.name || "").trim();
      if (!name) {
        return "";
      }

      const quantity = ingredient?.quantity;
      if (isUnknownQuantity(quantity)) {
        return name;
      }

      return `${name} (${String(quantity).trim()})`;
    })
    .filter(Boolean)
    .join(", ");
