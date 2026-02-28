const toBytesFromImageData = (imageData) => {
  if (!imageData) {
    return new Uint8Array();
  }

  const match = String(imageData).match(/^data:.*;base64,(.+)$/);
  if (!match) {
    return new TextEncoder().encode(String(imageData));
  }

  const binary = atob(match[1]);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

export const hashImageData = async (imageData) => {
  if (!imageData || typeof window === "undefined" || !window.crypto?.subtle) {
    return "";
  }

  const digest = await window.crypto.subtle.digest(
    "SHA-256",
    toBytesFromImageData(imageData),
  );
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
};

const getLocalValue = (key) => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setLocalValue = (key, value) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn("Failed to write local cache:", error);
  }
};

export const getLocalImage = (prefix, imageHash) =>
  imageHash ? getLocalValue(`${prefix}${imageHash}`) || "" : "";

export const storeImageLocally = (prefix, imageHash, imageData) => {
  if (imageHash && imageData) {
    setLocalValue(`${prefix}${imageHash}`, imageData);
  }
};

export const getLocalAnalysis = (prefix, imageHash) => {
  const raw = imageHash ? getLocalValue(`${prefix}${imageHash}`) : null;
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const storeAnalysisLocally = (prefix, imageHash, analysisData) => {
  if (imageHash && analysisData) {
    setLocalValue(`${prefix}${imageHash}`, JSON.stringify(analysisData));
  }
};

export const hydrateImageFromLocalStorage = (foodData, localImage) => {
  if (!foodData || !localImage) {
    return foodData;
  }

  const photos = Array.isArray(foodData.photos) ? [...foodData.photos] : [];
  const fallback = {
    id: `${foodData.id || "food"}-photo-local`,
    timestamp: foodData.timestamp || Date.now(),
    imageUri: localImage,
  };
  photos[0] = photos[0] ? { ...photos[0], imageUri: localImage } : fallback;
  return { ...foodData, photos };
};
