export const MAX_UPLOAD_BYTES = 500 * 1024;

export const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });

const loadImageFromDataUrl = (dataUrl) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = dataUrl;
  });

export const estimateDataUrlBytes = (dataUrl) => {
  const base64 = dataUrl.split(",")[1] || "";
  return Math.floor((base64.length * 3) / 4);
};

export const compressImageDataUrl = async (originalDataUrl) => {
  const image = await loadImageFromDataUrl(originalDataUrl);
  const maxDimension = 960;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not initialize image compressor");
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight);
  const qualitySteps = [0.8, 0.7, 0.6, 0.5, 0.4, 0.3];
  let bestCandidate = originalDataUrl;

  for (const quality of qualitySteps) {
    const candidate = canvas.toDataURL("image/jpeg", quality);
    bestCandidate = candidate;
    if (estimateDataUrlBytes(candidate) <= MAX_UPLOAD_BYTES) {
      return candidate;
    }
  }

  return bestCandidate;
};
