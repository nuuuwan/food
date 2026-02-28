const {
  NonFoodImageError,
  extractJsonObject,
  hashImageInput,
  normalizeGeminiAnalysis,
} = require("./analyzeCore");

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const GEMINI_API_VERSIONS = ["v1beta", "v1"];
const GEMINI_FALLBACK_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
];
const PROMPT =
  "Determine whether the image contains a food item or food packaging/label. Return only JSON with keys: isFood (boolean), nonFoodReason (string), productName (string), servingSize (string), nutrients (object with calories, protein, carbs, fat, saturatedFat, cholesterol, fiber, sodium, potassium, calcium, iron, magnesium, zinc, vitaminD, vitaminB12, folate, vitaminC, sugar, addedSugar, caffeine, alcohol as numbers), ingredients (array of {name, quantity}), classifications (object with singaporeNutriGrade as one of A/B/C/D, singaporeNutriGradeReason as a short text <= 160 chars, novaClassCode as one of NOVA 1/NOVA 2/NOVA 3/NOVA 4, novaClassReason as a short text <= 160 chars, novaTriggerItems as an array of specific ingredient names), warnings (array of strings). NOVA reason must cite specific ingredient names from the ingredient list; if novaClassCode is NOVA 4, explicitly name the ultra-processed ingredient(s) that triggered it and include them in novaTriggerItems. Ensure ingredient list and nutrient values are internally consistent: sugar <= carbs, saturatedFat <= fat, addedSugar <= sugar, and calories >= (protein*4 + carbs*4 + fat*9). If uncertain, still return best conservative estimate and include a warning. If isFood is false, fill nonFoodReason and leave other fields empty/default. If isFood is true, fill analysis fields with conservative estimates and set unknown numeric values to 0.";

const buildParts = (imageData, parsedImage) => {
  const parts = [{ text: PROMPT }];
  if (parsedImage) {
    parts.push({
      inlineData: { mimeType: parsedImage.mimeType, data: parsedImage.data },
    });
  } else if (imageData) {
    parts.push({ text: `Image reference: ${imageData}` });
  }
  return parts;
};

const requestGeminiAnalysis = async (imageData, parsedImage) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const modelCandidates = [GEMINI_MODEL, ...GEMINI_FALLBACK_MODELS].filter(
    (value, index, array) => value && array.indexOf(value) === index,
  );
  const parts = buildParts(imageData, parsedImage);
  let lastError;

  for (const apiVersion of GEMINI_API_VERSIONS) {
    for (const model of modelCandidates) {
      const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      });

      if (!response.ok) {
        lastError = `Gemini API error (${response.status}) with ${model} on ${apiVersion}: ${await response.text()}`;
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
      if (parsed?.isFood === false) {
        throw new NonFoodImageError(
          parsed?.nonFoodReason || "Image does not appear to contain food",
        );
      }
      return normalizeGeminiAnalysis(
        parsed,
        imageData,
        hashImageInput(imageData, parsedImage),
      );
    }
  }

  throw new Error(lastError || "Gemini analysis failed");
};

module.exports = { requestGeminiAnalysis };
