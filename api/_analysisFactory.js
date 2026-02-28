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

module.exports = { buildAnalysisFromImage };
