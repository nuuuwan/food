import React, { createContext, useContext, useEffect, useState } from "react";
import { foodAPIClient } from "./FoodAPIClient";
import { persistHistoryToLocalStorage } from "./dataHistory";
import { loadInitialHistory } from "./dataLoaders";
import { runScanWorkflow } from "./dataScanWorkflow";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};

export const DataProvider = ({ children }) => {
  const [currentScan, setCurrentScan] = useState(null);
  const [analysisState, setAnalysisState] = useState("idle");
  const [currentFood, setCurrentFood] = useState(null);
  const [foodHistory, setFoodHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingStatus, setProcessingStatus] = useState({
    title: "",
    detail: "",
  });
  const [processingSnapshot, setProcessingSnapshot] = useState(null);
  const [analysisPreview, setAnalysisPreview] = useState(null);
  const [scanError, setScanError] = useState(null);

  useEffect(() => {
    loadInitialHistory({ setIsLoading, setFoodHistory });
  }, []);

  useEffect(() => {
    persistHistoryToLocalStorage(foodHistory);
  }, [foodHistory]);

  const completeAnalysis = (foodData) => {
    setCurrentFood(foodData);
    setAnalysisState("success");
    setFoodHistory((previous) => [
      foodData,
      ...previous.filter((item) => item.id !== foodData.id),
    ]);
  };

  const startScan = async (imageData, scanMeta = {}) => {
    setCurrentFood(null);
    try {
      await runScanWorkflow({
        imageData,
        scanMeta,
        foodAPIClient,
        setCurrentScan,
        setProcessingSnapshot,
        setAnalysisPreview,
        setAnalysisState,
        setProcessingStatus,
        completeAnalysis,
      });
    } catch (error) {
      console.error("Failed to analyze food photo:", error);
      const msg = error?.message || "";
      const isNonFood = msg.toLowerCase().includes("not a food");
      setScanError({
        isNonFood,
        message: isNonFood
          ? msg.replace(/^not a food image:\s*/i, "")
          : "Could not process image. Please try again.",
      });
      setProcessingStatus({
        title: "Failed",
        detail: "Could not process image",
      });
      setAnalysisState("error");
    }
  };

  const resetScan = () => {
    setCurrentScan(null);
    setCurrentFood(null);
    setAnalysisState("idle");
    setProcessingStatus({ title: "", detail: "" });
    setProcessingSnapshot(null);
    setAnalysisPreview(null);
    setScanError(null);
  };

  const loadFoodById = async (foodId) => {
    try {
      const food = await foodAPIClient.getFoodById(foodId);
      setCurrentFood(food.toJSON());
    } catch (error) {
      console.error(`Failed to load food ${foodId}:`, error);
      const fallback = foodHistory.find((item) => item.id === foodId);
      if (fallback) setCurrentFood(fallback);
    }
  };

  const value = {
    currentScan,
    analysisState,
    currentFood,
    foodHistory,
    isLoading,
    processingStatus,
    processingSnapshot,
    analysisPreview,
    scanError,
    startScan,
    completeAnalysis,
    resetScan,
    loadFoodById,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
