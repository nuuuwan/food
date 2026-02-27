import { FoodAnalysis } from "./FoodAnalysis";

/**
 * Client for interacting with the Food API
 * Currently returns mock data, but will be updated to call real backend endpoints
 */
export class FoodAPIClient {
  constructor(baseURL) {
    this.baseURL =
      baseURL ||
      process.env.REACT_APP_API_BASE_URL ||
      this._getDefaultBaseURLForEnvironment();
  }

  _getDefaultBaseURLForEnvironment() {
    if (typeof window === "undefined") {
      return "";
    }

    const isLocalFrontend =
      window.location.hostname === "localhost" &&
      window.location.port === "3000";

    return isLocalFrontend ? "http://localhost:3001" : "";
  }

  _buildUrl(path) {
    return `${this.baseURL}${path}`;
  }

  async _request(path, options = {}) {
    const response = await fetch(this._buildUrl(path), {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      let message = `Request failed: ${response.status}`;

      try {
        const errorPayload = await response.json();
        if (errorPayload?.error) {
          message = errorPayload.error;
        }
      } catch {
        message = `Request failed: ${response.status}`;
      }

      throw new Error(message);
    }

    return response.json();
  }

  /**
   * Get a food analysis by ID
   * @param {string} foodId - The ID of the food to fetch
   * @returns {Promise<FoodAnalysis>}
   */
  async getFoodById(foodId) {
    const data = await this._request(`/api/foods/${foodId}`);
    return FoodAnalysis.fromJSON(data);
  }

  /**
   * Get food history (list of previously scanned foods)
   * @returns {Promise<Array<FoodAnalysis>>}
   */
  async getFoodHistory() {
    const data = await this._request("/api/foods");
    return data.map((item) => FoodAnalysis.fromJSON(item));
  }

  /**
   * Analyze a food photo and return the analysis
   * @param {string} imageData - Base64 encoded image or file
   * @returns {Promise<FoodAnalysis>}
   */
  async analyzeFoodPhoto(imageData) {
    const data = await this._request("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ imageData }),
    });

    return FoodAnalysis.fromJSON(data);
  }

  /**
   * Save a food analysis
   * @param {FoodAnalysis} foodAnalysis - The food analysis to save
   * @returns {Promise<FoodAnalysis>}
   */
  async saveFoodAnalysis(foodAnalysis) {
    const payload =
      typeof foodAnalysis.toJSON === "function"
        ? foodAnalysis.toJSON()
        : foodAnalysis;

    const data = await this._request("/api/foods", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return FoodAnalysis.fromJSON(data);
  }
}

// Singleton instance
export const foodAPIClient = new FoodAPIClient();
