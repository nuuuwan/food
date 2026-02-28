const { createSeedFoods } = require("./_seedFoods");
const { buildAnalysisFromImage } = require("./_analysisFactory");
const now = Date.now();
const initialFoods = createSeedFoods(now);

if (!globalThis.__foodMockStore) {
  globalThis.__foodMockStore = {
    foods: [...initialFoods],
  };
}

const store = globalThis.__foodMockStore;

const toKebabCase = (value) =>
  String(value || "food")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "food";

const buildFoodIdentifier = (productName, imageHash) => {
  const namePart = toKebabCase(productName || "food");
  const hashPart = String(imageHash || "")
    .toLowerCase()
    .replace(/[^a-f0-9]/g, "")
    .slice(0, 12);

  if (!hashPart) {
    return `${namePart}-${Date.now()}`;
  }

  return `${namePart}-${hashPart}`;
};

const withCors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

const handleOptions = (req, res) => {
  if (req.method === "OPTIONS") {
    withCors(res);
    res.status(200).end();
    return true;
  }
  return false;
};

const getFoods = () => store.foods;

const getFoodById = (id) => store.foods.find((food) => food.id === id);

const saveFood = (food) => {
  const existingIndex = store.foods.findIndex((item) => item.id === food.id);

  if (existingIndex >= 0) {
    store.foods[existingIndex] = food;
  } else {
    store.foods.unshift(food);
  }

  return food;
};

module.exports = {
  withCors,
  handleOptions,
  getFoods,
  getFoodById,
  saveFood,
  buildAnalysisFromImage,
  buildFoodIdentifier,
};
