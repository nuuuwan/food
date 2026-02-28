import { getLocalImage, hydrateImageFromLocalStorage } from "./foodApiCache";
import {
  getLocalBaseURL,
  resolveBaseURL,
  shouldFallbackToLocal,
} from "./foodApiConfig";
import { requestWithFallback } from "./foodApiRequest";
import {
  analyzeFoodPhotoWithMetaOperation,
  getFoodByIdOperation,
  getFoodHistoryOperation,
  saveFoodAnalysisOperation,
} from "./foodApiOperations";

export class FoodAPIClient {
  constructor(baseURL) {
    this.baseURL = resolveBaseURL(baseURL);
    this.localImageKeyPrefix = "food:image:";
    this.localAnalysisKeyPrefix = "food:analysis:";
  }

  _request(path, options = {}) {
    return requestWithFallback({
      path,
      options,
      baseURL: this.baseURL,
      getLocalBaseURL,
      shouldFallbackToLocal,
    });
  }

  _hydrateImage(foodData, fallbackHash = "", fallbackImageData = "") {
    const imageHash = foodData?.imageHash || fallbackHash;
    const localImage =
      getLocalImage(this.localImageKeyPrefix, imageHash) || fallbackImageData;
    return { ...hydrateImageFromLocalStorage(foodData, localImage), imageHash };
  }

  getFoodById(foodId) {
    return getFoodByIdOperation(this, foodId);
  }

  getFoodHistory() {
    return getFoodHistoryOperation(this);
  }

  analyzeFoodPhotoWithMeta(imageData, onStatusChange) {
    return analyzeFoodPhotoWithMetaOperation(this, imageData, onStatusChange);
  }

  async analyzeFoodPhoto(imageData) {
    const result = await this.analyzeFoodPhotoWithMeta(imageData);
    return result.analysis;
  }

  saveFoodAnalysis(foodAnalysis) {
    return saveFoodAnalysisOperation(this, foodAnalysis);
  }
}

export const foodAPIClient = new FoodAPIClient();
