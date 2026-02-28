const createSeedFoods = (now) => [
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

module.exports = { createSeedFoods };
