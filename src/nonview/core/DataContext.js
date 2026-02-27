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
  const [processingStatus, setProcessingStatus] = useState({
    title: "",
    detail: "",
  });
  // Load initial data on mount
  useEffect(() => {
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

        return parsed.filter(
          (item) => item?.id && !/^food-00\d+$/.test(item?.id || ""),
        );
      } catch {
        return [];
      }
    };

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
        const realHistory = history.filter(
          (item) => !/^food-00\d+$/.test(item?.id || ""),
        );
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
  }, [HISTORY_STORAGE_KEY]);

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
    setProcessingStatus({
      title: "Image extracted",
      detail: "Preparing upload payload...",
    });

    try {
      const stageToStatus = {
        "cache-check": {
          title: "Checking local cache",
          detail: "Looking for previous analysis in localStorage...",
        },
        uploading: {
          title: "Uploading image",
          detail: "Sending image for analysis...",
        },
        computing: {
          title: "Computing results",
          detail: "Model is generating nutrition insights...",
        },
      };

      const { analysis, meta } = await foodAPIClient.analyzeFoodPhotoWithMeta(
        imageData,
        (stage) => {
          if (stageToStatus[stage]) {
            setProcessingStatus(stageToStatus[stage]);
          }
        },
      );

      if (meta?.cacheSource === "localStorage") {
        setProcessingStatus({
          title: "Found in localStorage",
          detail: "Analysis already cached locally. Skipping model analysis.",
        });
      } else if (meta?.cacheSource === "backend") {
        setProcessingStatus({
          title: "Using cached analysis",
          detail: "Image was previously analyzed. Reusing stored results.",
        });
      } else {
        setProcessingStatus({
          title: "Analysis complete",
          detail: "Results computed successfully.",
        });
      }

      completeAnalysis(analysis.toJSON());
    } catch (error) {
      console.error("Failed to analyze food photo:", error);
      setProcessingStatus({
        title: "Analysis failed",
        detail: "Unable to process this image.",
      });
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
    setProcessingStatus({ title: "", detail: "" });
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
    processingStatus,
    startScan,
    completeAnalysis,
    resetScan,
    loadFoodById,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
