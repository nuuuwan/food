import { FoodAnalysis } from "./FoodAnalysis";

/**
 * Client for interacting with the Food API
 * Currently returns mock data, but will be updated to call real backend endpoints
 */
export class FoodAPIClient {
  constructor(baseURL = "") {
    this.baseURL = baseURL;
  }

  /**
   * Get a food analysis by ID
   * @param {string} foodId - The ID of the food to fetch
   * @returns {Promise<FoodAnalysis>}
   */
  async getFoodById(foodId) {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.baseURL}/api/foods/${foodId}`);
    // const data = await response.json();
    // return FoodAnalysis.fromJSON(data);

    // Mock data for now
    await this._simulateNetworkDelay();

    const mockData = {
      id: foodId,
      timestamp: Date.now(),
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
          id: `${foodId}-photo-1`,
          timestamp: Date.now(),
          imageUri: "/food/peanut-butter.jpg",
        },
        {
          id: `${foodId}-photo-2`,
          timestamp: Date.now() - 1000,
          imageUri: "/food/peanut-butter.jpg",
        },
        {
          id: `${foodId}-photo-3`,
          timestamp: Date.now() - 2000,
          imageUri: "/food/peanut-butter.jpg",
        },
      ],
    };

    return FoodAnalysis.fromJSON(mockData);
  }

  /**
   * Get food history (list of previously scanned foods)
   * @returns {Promise<Array<FoodAnalysis>>}
   */
  async getFoodHistory() {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.baseURL}/api/foods`);
    // const data = await response.json();
    // return data.map(item => FoodAnalysis.fromJSON(item));

    // Mock data for now
    await this._simulateNetworkDelay();

    const mockHistory = [
      {
        id: "food-001",
        timestamp: Date.now() - 86400000, // 1 day ago
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
            timestamp: Date.now() - 86400000,
            imageUri: "/food/peanut-butter.jpg",
          },
          {
            id: "food-001-photo-2",
            timestamp: Date.now() - 86401000,
            imageUri: "/food/peanut-butter.jpg",
          },
        ],
      },
      {
        id: "food-002",
        timestamp: Date.now() - 172800000, // 2 days ago
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
            timestamp: Date.now() - 172800000,
            imageUri: "/food/peanut-butter.jpg",
          },
          {
            id: "food-002-photo-2",
            timestamp: Date.now() - 172801000,
            imageUri: "/food/peanut-butter.jpg",
          },
          {
            id: "food-002-photo-3",
            timestamp: Date.now() - 172802000,
            imageUri: "/food/peanut-butter.jpg",
          },
          {
            id: "food-002-photo-4",
            timestamp: Date.now() - 172803000,
            imageUri: "/food/peanut-butter.jpg",
          },
        ],
      },
      {
        id: "food-003",
        timestamp: Date.now() - 259200000, // 3 days ago
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
            timestamp: Date.now() - 259200000,
            imageUri: "/food/peanut-butter.jpg",
          },
        ],
      },
    ];

    return mockHistory.map((item) => FoodAnalysis.fromJSON(item));
  }

  /**
   * Analyze a food photo and return the analysis
   * @param {string} imageData - Base64 encoded image or file
   * @returns {Promise<FoodAnalysis>}
   */
  async analyzeFoodPhoto(imageData) {
    // TODO: Replace with actual API call to AI service
    // const formData = new FormData();
    // formData.append('image', imageData);
    // const response = await fetch(`${this.baseURL}/api/analyze`, {
    //   method: 'POST',
    //   body: formData
    // });
    // const data = await response.json();
    // return FoodAnalysis.fromJSON(data);

    // Mock analysis for now
    await this._simulateNetworkDelay(2000); // Longer delay for "AI processing"

    const mockAnalysis = {
      id: `food-${Date.now()}`,
      timestamp: Date.now(),
      productName: "Analyzed Food Product",
      servingSize: "100g",
      nutrients: {
        calories: 200,
        protein: 10,
        carbs: 15,
        fat: 8,
        fiber: 3,
        sodium: 100,
        sugar: 5,
      },
      ingredients: [
        { name: "Primary Ingredient", quantity: "80g" },
        { name: "Secondary Ingredient", quantity: "20g" },
      ],
      warnings: [],
      photos: [
        {
          id: `food-${Date.now()}-photo-1`,
          timestamp: Date.now(),
          imageUri: imageData || "/food/peanut-butter.jpg",
        },
      ],
    };

    return FoodAnalysis.fromJSON(mockAnalysis);
  }

  /**
   * Save a food analysis
   * @param {FoodAnalysis} foodAnalysis - The food analysis to save
   * @returns {Promise<FoodAnalysis>}
   */
  async saveFoodAnalysis(foodAnalysis) {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.baseURL}/api/foods`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(foodAnalysis.toJSON())
    // });
    // const data = await response.json();
    // return FoodAnalysis.fromJSON(data);

    // Mock save for now
    await this._simulateNetworkDelay();

    return foodAnalysis;
  }

  /**
   * Simulate network delay for more realistic mock behavior
   * @private
   */
  async _simulateNetworkDelay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const foodAPIClient = new FoodAPIClient();
