import React, { createContext, useContext, useState } from "react";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// Dummy data for M0
const dummyFoodAnalysis = {
  id: "food-001",
  timestamp: Date.now(),
  imageUri: "/food/peanut-butter.jpg",
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
  healthScore: 78,
};

const dummyFoodHistory = [
  {
    id: "food-001",
    timestamp: Date.now() - 86400000, // 1 day ago
    imageUri: "/food/peanut-butter.jpg",
    productName: "Organic Peanut Butter",
    healthScore: 78,
  },
  {
    id: "food-002",
    timestamp: Date.now() - 172800000, // 2 days ago
    imageUri: "/food/peanut-butter.jpg",
    productName: "Whole Grain Bread",
    healthScore: 85,
  },
  {
    id: "food-003",
    timestamp: Date.now() - 259200000, // 3 days ago
    imageUri: "/food/peanut-butter.jpg",
    productName: "Greek Yogurt",
    healthScore: 92,
  },
];

export const DataProvider = ({ children }) => {
  const [currentScan, setCurrentScan] = useState(null);
  const [analysisState, setAnalysisState] = useState("idle"); // idle | scanning | success | error
  const [currentFood, setCurrentFood] = useState(dummyFoodAnalysis);
  const [foodHistory, setFoodHistory] = useState(dummyFoodHistory);

  const startScan = (imageData) => {
    setCurrentScan(imageData);
    setAnalysisState("scanning");
  };

  const completeAnalysis = (foodData) => {
    setCurrentFood(foodData);
    setAnalysisState("success");
    // Add to history
    setFoodHistory([
      {
        id: foodData.id,
        timestamp: foodData.timestamp,
        imageUri: foodData.imageUri,
        productName: foodData.productName,
        healthScore: foodData.healthScore,
      },
      ...foodHistory,
    ]);
  };

  const resetScan = () => {
    setCurrentScan(null);
    setAnalysisState("idle");
  };

  const value = {
    currentScan,
    analysisState,
    currentFood,
    foodHistory,
    startScan,
    completeAnalysis,
    resetScan,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
