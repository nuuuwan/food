const { getFoodById, handleOptions, withCors } = require("../_mockStore");

module.exports = function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  withCors(res);

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { id } = req.query;
  const food = getFoodById(id);

  if (!food) {
    res.status(404).json({ error: "Food not found" });
    return;
  }

  res.status(200).json(food);
};
