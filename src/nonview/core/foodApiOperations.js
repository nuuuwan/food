import { FoodAnalysis } from "./FoodAnalysis";
import {
  getLocalAnalysis,
  hashImageData,
  storeAnalysisLocally,
  storeImageLocally,
} from "./foodApiCache";
import { isCacheHit } from "./foodApiRequest";

export const getFoodByIdOperation = async (client, foodId) => {
  const data = await client._request(`/api/foods/${foodId}`);
  return FoodAnalysis.fromJSON(client._hydrateImage(data));
};

export const getFoodHistoryOperation = async (client) => {
  const data = await client._request("/api/foods");
  return data.map((item) => FoodAnalysis.fromJSON(client._hydrateImage(item)));
};

export const analyzeFoodPhotoWithMetaOperation = async (
  client,
  imageData,
  onStatusChange,
) => {
  const imageHash = await hashImageData(imageData);
  storeImageLocally(client.localImageKeyPrefix, imageHash, imageData);

  onStatusChange?.("cache-check");
  const localAnalysis = getLocalAnalysis(
    client.localAnalysisKeyPrefix,
    imageHash,
  );
  if (localAnalysis) {
    return {
      analysis: FoodAnalysis.fromJSON(
        client._hydrateImage(localAnalysis, imageHash, imageData),
      ),
      meta: { cacheHit: true, cacheSource: "localStorage", imageHash },
    };
  }

  onStatusChange?.("uploading");
  const data = await client._request("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ imageData }),
  });
  onStatusChange?.("computing");

  const hydratedData = client._hydrateImage(data, imageHash, imageData);
  storeAnalysisLocally(client.localAnalysisKeyPrefix, imageHash, hydratedData);

  return {
    analysis: FoodAnalysis.fromJSON(hydratedData),
    meta: {
      cacheHit: isCacheHit(data?.cacheHit),
      cacheSource: isCacheHit(data?.cacheHit) ? "backend" : "none",
      imageHash,
    },
  };
};

export const saveFoodAnalysisOperation = async (client, foodAnalysis) => {
  const payload =
    typeof foodAnalysis.toJSON === "function"
      ? foodAnalysis.toJSON()
      : foodAnalysis;
  const data = await client._request("/api/foods", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return FoodAnalysis.fromJSON(data);
};
