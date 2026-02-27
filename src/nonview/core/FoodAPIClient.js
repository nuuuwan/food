import { FoodAnalysis } from "./FoodAnalysis";

/**
 * Client for interacting with the Food API
 * Currently returns mock data, but will be updated to call real backend endpoints
 */
export class FoodAPIClient {
  constructor(baseURL) {
    this.baseURL = this._resolveBaseURL(baseURL);
    this.localImageKeyPrefix = "food:image:";
    this.localAnalysisKeyPrefix = "food:analysis:";
  }

  _resolveBaseURL(explicitBaseURL) {
    if (explicitBaseURL) {
      return explicitBaseURL;
    }

    if (process.env.REACT_APP_API_BASE_URL) {
      return process.env.REACT_APP_API_BASE_URL;
    }

    const target = (
      process.env.REACT_APP_VERCEL_TARGET || "local"
    ).toLowerCase();
    const localBaseURL =
      process.env.REACT_APP_LOCAL_API_BASE_URL || "http://localhost:3001";
    const remoteBaseURL = process.env.REACT_APP_REMOTE_API_BASE_URL || "";

    if (target === "remote") {
      return remoteBaseURL;
    }

    if (target === "local") {
      return localBaseURL;
    }

    return this._getDefaultBaseURLForEnvironment();
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

  _getLocalBaseURL() {
    return process.env.REACT_APP_LOCAL_API_BASE_URL || "http://localhost:3001";
  }

  _buildUrl(path, baseURL = this.baseURL) {
    return `${baseURL}${path}`;
  }

  _toBytesFromImageData(imageData) {
    if (!imageData) {
      return new Uint8Array();
    }

    const match = String(imageData).match(/^data:.*;base64,(.+)$/);
    if (!match) {
      return new TextEncoder().encode(String(imageData));
    }

    const base64 = match[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  }

  async _hashImageData(imageData) {
    if (!imageData || typeof window === "undefined" || !window.crypto?.subtle) {
      return "";
    }

    const bytes = this._toBytesFromImageData(imageData);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("");
  }

  _storeImageLocally(imageHash, imageData) {
    if (!imageHash || !imageData || typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        `${this.localImageKeyPrefix}${imageHash}`,
        imageData,
      );
    } catch (error) {
      console.warn("Failed to store image in localStorage:", error);
    }
  }

  _getLocalImage(imageHash) {
    if (!imageHash || typeof window === "undefined") {
      return "";
    }

    try {
      return (
        window.localStorage.getItem(
          `${this.localImageKeyPrefix}${imageHash}`,
        ) || ""
      );
    } catch {
      return "";
    }
  }

  _storeAnalysisLocally(imageHash, analysisData) {
    if (!imageHash || !analysisData || typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        `${this.localAnalysisKeyPrefix}${imageHash}`,
        JSON.stringify(analysisData),
      );
    } catch (error) {
      console.warn("Failed to store analysis in localStorage:", error);
    }
  }

  _getLocalAnalysis(imageHash) {
    if (!imageHash || typeof window === "undefined") {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(
        `${this.localAnalysisKeyPrefix}${imageHash}`,
      );
      if (!raw) {
        return null;
      }

      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  _hydrateImageFromLocalStorage(
    foodData,
    fallbackHash = "",
    fallbackImageData = "",
  ) {
    if (!foodData || typeof foodData !== "object") {
      return foodData;
    }

    const imageHash = foodData.imageHash || fallbackHash;
    const localImage = this._getLocalImage(imageHash) || fallbackImageData;

    if (!localImage) {
      return foodData;
    }

    const photos = Array.isArray(foodData.photos) ? [...foodData.photos] : [];
    if (photos.length === 0) {
      photos.push({
        id: `${foodData.id || "food"}-photo-local`,
        timestamp: foodData.timestamp || Date.now(),
        imageUri: localImage,
      });
    } else {
      photos[0] = {
        ...photos[0],
        imageUri: localImage,
      };
    }

    return {
      ...foodData,
      imageHash,
      photos,
    };
  }

  _isLocalFrontend() {
    return (
      typeof window !== "undefined" &&
      window.location.hostname === "localhost" &&
      window.location.port === "3000"
    );
  }

  _shouldFallbackToLocal(primaryBaseURL, error) {
    const fallbackEnabled =
      (process.env.REACT_APP_ENABLE_LOCAL_FALLBACK || "false").toLowerCase() ===
      "true";

    if (!fallbackEnabled) {
      return false;
    }

    if (!this._isLocalFrontend()) {
      return false;
    }

    const localBaseURL = this._getLocalBaseURL();
    if (!primaryBaseURL || primaryBaseURL === localBaseURL) {
      return false;
    }

    if (error?.name === "TypeError") {
      return true;
    }

    return /401|403|network|cors/i.test(error?.message || "");
  }

  async _requestFromBase(path, options = {}, baseURL = this.baseURL) {
    const response = await fetch(this._buildUrl(path, baseURL), {
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

  async _request(path, options = {}) {
    const primaryBaseURL = this.baseURL;

    try {
      return await this._requestFromBase(path, options, primaryBaseURL);
    } catch (error) {
      if (!this._shouldFallbackToLocal(primaryBaseURL, error)) {
        throw error;
      }

      return this._requestFromBase(path, options, this._getLocalBaseURL());
    }
  }

  /**
   * Get a food analysis by ID
   * @param {string} foodId - The ID of the food to fetch
   * @returns {Promise<FoodAnalysis>}
   */
  async getFoodById(foodId) {
    const data = await this._request(`/api/foods/${foodId}`);
    const hydratedData = this._hydrateImageFromLocalStorage(data);
    return FoodAnalysis.fromJSON(hydratedData);
  }

  /**
   * Get food history (list of previously scanned foods)
   * @returns {Promise<Array<FoodAnalysis>>}
   */
  async getFoodHistory() {
    const data = await this._request("/api/foods");
    return data.map((item) =>
      FoodAnalysis.fromJSON(this._hydrateImageFromLocalStorage(item)),
    );
  }

  /**
   * Analyze a food photo and return the analysis
   * @param {string} imageData - Base64 encoded image or file
   * @returns {Promise<FoodAnalysis>}
   */
  async analyzeFoodPhotoWithMeta(imageData, onStatusChange) {
    const imageHash = await this._hashImageData(imageData);
    this._storeImageLocally(imageHash, imageData);

    onStatusChange?.("cache-check");
    const localAnalysis = this._getLocalAnalysis(imageHash);
    if (localAnalysis) {
      const hydratedLocal = this._hydrateImageFromLocalStorage(
        localAnalysis,
        imageHash,
        imageData,
      );

      return {
        analysis: FoodAnalysis.fromJSON(hydratedLocal),
        meta: {
          cacheHit: true,
          cacheSource: "localStorage",
          imageHash,
        },
      };
    }

    onStatusChange?.("uploading");

    const data = await this._request("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ imageData }),
    });

    onStatusChange?.("computing");

    const hydratedData = this._hydrateImageFromLocalStorage(
      data,
      imageHash,
      imageData,
    );

    this._storeAnalysisLocally(imageHash, hydratedData);

    return {
      analysis: FoodAnalysis.fromJSON(hydratedData),
      meta: {
        cacheHit: Boolean(data?.cacheHit),
        cacheSource: data?.cacheHit ? "backend" : "none",
        imageHash,
      },
    };
  }

  async analyzeFoodPhoto(imageData) {
    const result = await this.analyzeFoodPhotoWithMeta(imageData);
    return result.analysis;
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
