import { foodAPIClient } from "./FoodAPIClient";
import {
  isRealFoodItem,
  loadHistoryFromLocalStorage,
  mergeById,
} from "./dataHistory";

export const loadInitialHistory = async ({ setIsLoading, setFoodHistory }) => {
  try {
    setIsLoading(true);
    const localHistory = loadHistoryFromLocalStorage();

    if (localHistory.length > 0) {
      setFoodHistory((previousHistory) =>
        mergeById(previousHistory, localHistory),
      );
    }

    const history = await foodAPIClient.getFoodHistory();
    const loadedHistory = history
      .filter(isRealFoodItem)
      .map((item) => item.toJSON());
    setFoodHistory((previousHistory) =>
      mergeById(previousHistory, loadedHistory),
    );
  } catch (error) {
    console.error("Failed to load initial data:", error);
  } finally {
    setIsLoading(false);
  }
};
