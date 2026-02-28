const {
  buildAnalysisFromImage,
  buildFoodIdentifier,
  handleOptions,
  saveFood,
  withCors,
} = require("./_mockStore");
const {
  NonFoodImageError,
  hashImageInput,
  parseDataUrl,
} = require("./analyzeCore");
const { requestGeminiAnalysis } = require("./analyzeGemini");

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

  try {
    analysis = await requestGeminiAnalysis(imageData, parsedImage);
  } catch (error) {
    if (error instanceof NonFoodImageError) {
      res.status(422).json({
        error: `Not a food image: ${error.message}`,
      });
      return;
    }

    console.error("Gemini analysis failed, falling back to mock:", error);
    analysis = buildAnalysisFromImage(imageData);
    analysis.id = buildFoodIdentifier(analysis.productName, imageHash);
    analysis.photos = (analysis.photos || []).map((photo, index) => ({
      ...photo,
      id: `${analysis.id}-photo-${index + 1}`,
    }));
    const reason = error?.message || "Unknown error";
    analysis.warnings = [
      ...(analysis.warnings || []),
      `AI analysis unavailable; showing mock estimate (${reason})`,
    ];
  }

  saveFood(analysis);

  res.status(200).json({
    ...analysis,
    imageHash,
    cacheHit: false,
  });
};
