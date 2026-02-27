const {
  buildAnalysisFromImage,
  handleOptions,
  saveFood,
  withCors,
} = require("./_mockStore");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  withCors(res);

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  await sleep(600);

  const imageData = req.body?.imageData || "";
  const analysis = buildAnalysisFromImage(imageData);
  saveFood(analysis);

  res.status(200).json(analysis);
};
