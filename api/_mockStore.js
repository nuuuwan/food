const now = Date.now();

const initialFoods = [
  {
    id: "food-001",
    timestamp: now - 86400000,
    productName: "Organic Peanut Butter",
    servingSize: "32g (2 tbsp)",
    nutrients: {
      calories: 190,
      protein: 8,
      carbs: 7,
      fat: 16,
      fiber: 2,
      sodium: 65,
      sugar: 2,
    },
    ingredients: [
      { name: "Organic Dry Roasted Peanuts", quantity: "30g" },
      { name: "Sea Salt", quantity: "2g" },
    ],
    warnings: ["Contains Peanuts", "May contain tree nuts"],
    photos: [
      {
        id: "food-001-photo-1",
        timestamp: now - 86400000,
        imageUri: "/food/peanut-butter.jpg",
      },
      {
        id: "food-001-photo-2",
        timestamp: now - 86401000,
        imageUri: "/food/peanut-butter.jpg",
      },
    ],
  },
  {
    id: "food-002",
    timestamp: now - 172800000,
    productName: "Whole Grain Bread",
    servingSize: "50g (1 slice)",
    nutrients: {
      calories: 120,
      protein: 5,
      carbs: 22,
      fat: 2,
      fiber: 3,
      sodium: 180,
      sugar: 3,
    },
    ingredients: [
      { name: "Whole Wheat Flour", quantity: "40g" },
      { name: "Water", quantity: "8g" },
      { name: "Yeast", quantity: "2g" },
    ],
    warnings: ["Contains Gluten"],
    photos: [
      {
        id: "food-002-photo-1",
        timestamp: now - 172800000,
        imageUri: "/food/peanut-butter.jpg",
      },
    ],
  },
  {
    id: "food-003",
    timestamp: now - 259200000,
    productName: "Greek Yogurt",
    servingSize: "170g (1 container)",
    nutrients: {
      calories: 100,
      protein: 17,
      carbs: 6,
      fat: 0,
      fiber: 0,
      sodium: 60,
      sugar: 4,
    },
    ingredients: [
      { name: "Cultured Grade A Milk", quantity: "165g" },
      { name: "Live Active Cultures", quantity: "5g" },
    ],
    warnings: ["Contains Milk"],
    photos: [
      {
        id: "food-003-photo-1",
        timestamp: now - 259200000,
        imageUri: "/food/peanut-butter.jpg",
      },
    ],
  },
];

if (!globalThis.__foodMockStore) {
  globalThis.__foodMockStore = {
    foods: [...initialFoods],
  };
}

const store = globalThis.__foodMockStore;

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

const buildAnalysisFromImage = (imageData) => {
  const timestamp = Date.now();
  const id = `food-${timestamp}`;

  return {
    id,
    timestamp,
    productName: "Analyzed Food Product",
    servingSize: "100g",
    nutrients: {
      calories: 200,
      protein: 10,
      carbs: 15,
      fat: 8,
      saturatedFat: 2,
      cholesterol: 10,
      fiber: 3,
      sodium: 100,
      potassium: 150,
      calcium: 80,
      iron: 1.2,
      magnesium: 20,
      zinc: 0.8,
      vitaminD: 0,
      vitaminB12: 0,
      folate: 20,
      vitaminC: 0,
      sugar: 5,
      addedSugar: 3,
      caffeine: 0,
      alcohol: 0,
    },
    ingredients: [
      { name: "Primary Ingredient", quantity: "80g" },
      { name: "Secondary Ingredient", quantity: "20g" },
    ],
    warnings: [],
    photos: [
      {
        id: `${id}-photo-1`,
        timestamp,
        imageUri: imageData || "/food/peanut-butter.jpg",
      },
    ],
  };
};

module.exports = {
  withCors,
  handleOptions,
  getFoods,
  getFoodById,
  saveFood,
  buildAnalysisFromImage,
};
