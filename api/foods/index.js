const {
  buildFoodIdentifier,
  getFoods,
  handleOptions,
  saveFood,
  withCors,
} = require("../_mockStore");

module.exports = function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  withCors(res);

  if (req.method === "GET") {
    res.status(200).json(getFoods());
    return;
  }

  if (req.method === "POST") {
    const payload = req.body || {};
    const normalizedFood = {
      ...payload,
      id:
        payload.id ||
        buildFoodIdentifier(
          payload.productName || "food",
          payload.imageHash || "",
        ),
      timestamp: payload.timestamp || Date.now(),
      nutrients: payload.nutrients || payload.nutritionInfo || {},
      ingredients: payload.ingredients || [],
      warnings: payload.warnings || [],
      photos: payload.photos || [],
    };

    const saved = saveFood(normalizedFood);
    res.status(201).json(saved);
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};
