import React, { createContext, useContext, useState, useEffect } from "react";
import { foodAPIClient } from "./FoodAPIClient";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const HISTORY_STORAGE_KEY = "food:history";
  const [currentScan, setCurrentScan] = useState(null);
  const [analysisState, setAnalysisState] = useState("idle"); // idle | scanning | success | error
  const [currentFood, setCurrentFood] = useState(null);
  const [foodHistory, setFoodHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isSeedMockFood = (food) => /^food-00\d+$/.test(food?.id || "");
  const sortByTimestampDesc = (items) =>
    [...items].sort(
      (left, right) => (right?.timestamp || 0) - (left?.timestamp || 0),
    );

  const mergeById = (first, second) => {
    const merged = new Map();

    first.forEach((item) => {
      if (item?.id) {
        merged.set(item.id, item);
      }
    });

    second.forEach((item) => {
      if (item?.id) {
        merged.set(item.id, item);
      }
    });

    return sortByTimestampDesc(Array.from(merged.values()));
  };

  const loadHistoryFromLocalStorage = () => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((item) => item?.id && !isSeedMockFood(item));
    } catch {
      return [];
    }
  };

  // Load initial data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const localHistory = loadHistoryFromLocalStorage();
        if (localHistory.length > 0) {
          setFoodHistory((previousHistory) =>
            mergeById(previousHistory, localHistory),
          );
        }

        const history = await foodAPIClient.getFoodHistory();
        const realHistory = history.filter((item) => !isSeedMockFood(item));
        const loadedHistory = realHistory.map((item) => item.toJSON());

        setFoodHistory((previousHistory) =>
          mergeById(previousHistory, loadedHistory),
        );
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(foodHistory),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [foodHistory]);

  const startScan = async (imageData) => {
    setCurrentScan(imageData);
    setAnalysisState("scanning");

    try {
      // Call API to analyze the photo
      const analysis = await foodAPIClient.analyzeFoodPhoto(imageData);
      completeAnalysis(analysis.toJSON());
    } catch (error) {
      console.error("Failed to analyze food photo:", error);
      setAnalysisState("error");
    }
  };

  const completeAnalysis = (foodData) => {
    setCurrentFood(foodData);
    setAnalysisState("success");

    setFoodHistory((previousHistory) => [
      foodData,
      ...previousHistory.filter((item) => item.id !== foodData.id),
    ]);
  };

  const resetScan = () => {
    setCurrentScan(null);
    setAnalysisState("idle");
  };

  const loadFoodById = async (foodId) => {
    try {
      const food = await foodAPIClient.getFoodById(foodId);
      setCurrentFood(food.toJSON());
    } catch (error) {
      console.error(`Failed to load food ${foodId}:`, error);

      const fallback = foodHistory.find((item) => item.id === foodId);
      if (fallback) {
        setCurrentFood(fallback);
      }
    }
  };

  const value = {
    currentScan,
    analysisState,
    currentFood,
    foodHistory,
    isLoading,
    startScan,
    completeAnalysis,
    resetScan,
    loadFoodById,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
