export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return null;
  }
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  return `${Math.round(bytes / 1024)} KB`;
};

export const buildCompressionDetail = (scanMeta = {}) => {
  const original = formatBytes(scanMeta.originalBytes);
  const compressed = formatBytes(scanMeta.compressedBytes);
  return {
    original,
    compressed,
    detail:
      original && compressed
        ? `Optimized ${original} → ${compressed}`
        : "Optimizing for upload",
  };
};

export const stageToStatus = (compressedSizeLabel) => ({
  "cache-check": {
    title: "Checking cache",
    detail: "Looking for previous analysis",
  },
  uploading: {
    title: "Uploading",
    detail: compressedSizeLabel
      ? `Uploading ${compressedSizeLabel}`
      : "Uploading image",
  },
  computing: {
    title: "Analyzing",
    detail: "Extracting nutrition and ingredients",
  },
});

export const buildAnalysisPreview = (analysis) => ({
  productName: analysis?.productName || "Food item",
  calories: analysis?.nutrients?.calories ?? null,
  servingSize: analysis?.servingSize || null,
});

export const buildFinalStatus = (meta) => {
  if (meta?.cacheHit && meta?.cacheSource === "localStorage") {
    return { title: "Cached local", detail: "Analysis skipped" };
  }
  if (meta?.cacheHit && meta?.cacheSource === "backend") {
    return { title: "Cached remote", detail: "Reusing previous result" };
  }
  return { title: "Done", detail: "" };
};
