const {
  buildAnalysisFromImage,
  handleOptions,
  saveFood,
  withCors,
} = require("./_mockStore");
const crypto = require("crypto");
const { head, put } = require("@vercel/blob");

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const GEMINI_API_VERSIONS = ["v1beta", "v1"];
const GEMINI_FALLBACK_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
];

const defaultNutrients = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  sodium: 0,
  sugar: 0,
};

const blobPaths = {
  image: (hash, extension) => `food-images/${hash}.${extension}`,
  analysis: (hash) => `food-analyses/${hash}.json`,
};

const parseDataUrl = (imageData) => {
  if (!imageData || typeof imageData !== "string") {
    return null;
  }

  const match = imageData.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    data: match[2],
  };
};

const extensionForMimeType = (mimeType = "") => {
  const normalized = mimeType.toLowerCase();

  if (normalized === "image/jpeg") {
    return "jpg";
  }

  if (normalized === "image/png") {
    return "png";
  }

  if (normalized === "image/webp") {
    return "webp";
  }

  return "img";
};

const hashImageInput = (imageData, parsedImage) => {
  if (!imageData) {
    return "";
  }

  const hasher = crypto.createHash("sha256");

  if (parsedImage?.data) {
    hasher.update(Buffer.from(parsedImage.data, "base64"));
  } else {
    hasher.update(String(imageData));
  }

  return hasher.digest("hex");
};

const isBlobNotFoundError = (error) => {
  const message = error?.message || "";
  return /not found|404/i.test(message);
};

const getCachedAnalysisByHash = async (imageHash) => {
  if (!imageHash) {
    return null;
  }

  try {
    const metadata = await head(blobPaths.analysis(imageHash));
    const response = await fetch(metadata.url);

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    if (isBlobNotFoundError(error)) {
      return null;
    }

    console.error("Failed to load cached analysis from blob:", error);
    return null;
  }
};

const putBlobDeterministic = async (pathname, body, options) => {
  try {
    return await put(pathname, body, {
      ...options,
      addRandomSuffix: false,
    });
  } catch (error) {
    if (isBlobNotFoundError(error)) {
      throw error;
    }

    const message = error?.message || "";
    if (/already exists|409|conflict/i.test(message)) {
      return head(pathname);
    }

    throw error;
  }
};

const persistAnalysisByHash = async ({ imageHash, parsedImage, analysis }) => {
  if (!imageHash) {
    return analysis;
  }

  let imageUrl = analysis?.photos?.[0]?.imageUri || "";

  if (parsedImage?.data) {
    const extension = extensionForMimeType(parsedImage.mimeType);
    const imagePath = blobPaths.image(imageHash, extension);
    const imageBuffer = Buffer.from(parsedImage.data, "base64");

    const imageBlob = await putBlobDeterministic(imagePath, imageBuffer, {
      access: "public",
      contentType: parsedImage.mimeType,
    });

    imageUrl = imageBlob.url;
  }

  const persistedAnalysis = {
    ...analysis,
    imageHash,
    photos: Array.isArray(analysis.photos)
      ? analysis.photos.map((photo, index) =>
          index === 0
            ? { ...photo, imageUri: imageUrl || photo.imageUri }
            : photo,
        )
      : analysis.photos,
  };

  const analysisPath = blobPaths.analysis(imageHash);
  await putBlobDeterministic(analysisPath, JSON.stringify(persistedAnalysis), {
    access: "public",
    contentType: "application/json",
  });

  return persistedAnalysis;
};

const extractJsonObject = (text) => {
  if (!text || typeof text !== "string") {
    return null;
  }

  const jsonBlock = text.match(/\{[\s\S]*\}/);
  if (!jsonBlock) {
    return null;
  }

  try {
    return JSON.parse(jsonBlock[0]);
  } catch {
    return null;
  }
};

const normalizeGeminiAnalysis = (analysis, imageData) => {
  const timestamp = Date.now();
  const id = `food-${timestamp}`;
  const nutrients = analysis?.nutrients || {};

  return {
    id,
    timestamp,
    productName: analysis?.productName || "Unidentified Food Item",
    servingSize: analysis?.servingSize || "Unknown",
    nutrients: {
      ...defaultNutrients,
      ...nutrients,
    },
    ingredients: Array.isArray(analysis?.ingredients)
      ? analysis.ingredients.map((item) =>
          typeof item === "string"
            ? { name: item, quantity: "unknown" }
            : {
                name: item?.name || "Unknown ingredient",
                quantity: item?.quantity || "unknown",
              },
        )
      : [],
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

const requestGeminiAnalysis = async (imageData, parsedImage) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const modelCandidates = [GEMINI_MODEL, ...GEMINI_FALLBACK_MODELS].filter(
    (value, index, array) => value && array.indexOf(value) === index,
  );

  const prompt =
    "Identify what food or packaged product is likely shown in this image. Return only JSON with keys: productName (string), servingSize (string), nutrients (object with calories, protein, carbs, fat, fiber, sodium, sugar as numbers), ingredients (array of {name, quantity}), warnings (array of strings). Use conservative estimates and set unknown numeric values to 0.";

  const parts = [{ text: prompt }];
  if (parsedImage) {
    parts.push({
      inlineData: {
        mimeType: parsedImage.mimeType,
        data: parsedImage.data,
      },
    });
  } else if (imageData) {
    parts.push({ text: `Image reference: ${imageData}` });
  }

  let lastError;

  for (const apiVersion of GEMINI_API_VERSIONS) {
    for (const model of modelCandidates) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts,
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        lastError = `Gemini API error (${response.status}) with ${model} on ${apiVersion}: ${errorText}`;

        if (response.status === 404) {
          continue;
        }

        throw new Error(lastError);
      }

      const payload = await response.json();
      const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const parsed = extractJsonObject(rawText);

      if (!parsed) {
        lastError = `Gemini response from ${model} on ${apiVersion} did not contain valid JSON analysis`;
        continue;
      }

      return normalizeGeminiAnalysis(parsed, imageData);
    }
  }

  throw new Error(lastError || "Gemini analysis failed");
};

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  withCors(res);

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const imageData = req.body?.imageData || "";
  const parsedImage = parseDataUrl(imageData);
  const imageHash = hashImageInput(imageData, parsedImage);
  let analysis;
  let blobStored = false;
  let blobStoreError = null;

  const cachedAnalysis = await getCachedAnalysisByHash(imageHash);
  if (cachedAnalysis) {
    saveFood(cachedAnalysis);
    res.status(200).json({
      ...cachedAnalysis,
      cacheHit: true,
      blobStored: true,
      blobStoreError: null,
    });
    return;
  }

  try {
    analysis = await requestGeminiAnalysis(imageData, parsedImage);
  } catch (error) {
    console.error("Gemini analysis failed, falling back to mock:", error);
    analysis = buildAnalysisFromImage(imageData);
    const reason = error?.message || "Unknown error";
    analysis.warnings = [
      ...(analysis.warnings || []),
      `AI analysis unavailable; showing mock estimate (${reason})`,
    ];
  }

  try {
    analysis = await persistAnalysisByHash({
      imageHash,
      parsedImage,
      analysis,
    });
    blobStored = true;
  } catch (error) {
    console.error("Failed to persist analysis/image in Vercel Blob:", error);
    blobStoreError = error?.message || "Unknown blob persistence error";
  }

  saveFood(analysis);

  res.status(200).json({
    ...analysis,
    cacheHit: false,
    blobStored,
    blobStoreError,
  });
};
