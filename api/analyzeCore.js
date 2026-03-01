const crypto = require("crypto");
const { normalizeGeminiAnalysis } = require("./_normalizeFood");

class NonFoodImageError extends Error {
  constructor(message) {
    super(message);
    this.name = "NonFoodImageError";
  }
}

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

module.exports = {
  NonFoodImageError,
  parseDataUrl,
  hashImageInput,
  extractJsonObject,
  normalizeGeminiAnalysis,
};
