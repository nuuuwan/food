import { NutritionInfo } from "./NutritionInfo";
import { Ingredient } from "./Ingredient";
import { Photo } from "./Photo";

export class FoodAnalysis {
  constructor({
    id = "",
    productName = "",
    timestamp = Date.now(),
    nutritionInfo = null,
    ingredients = [],
    warnings = [],
    servingSize = "",
    photos = [],
  } = {}) {
    this.id = id;
    this.productName = productName;
    this.timestamp = timestamp;
    this.nutritionInfo =
      nutritionInfo instanceof NutritionInfo
        ? nutritionInfo
        : new NutritionInfo(nutritionInfo);
    this.ingredients = ingredients.map((ing) =>
      ing instanceof Ingredient ? ing : Ingredient.fromJSON(ing),
    );
    this.warnings = warnings;
    this.servingSize = servingSize;
    this.photos = photos.map((photo) =>
      photo instanceof Photo ? photo : Photo.fromJSON(photo),
    );
  }

  static fromJSON(data) {
    // Handle legacy format with imageUri at top level
    const photos =
      data.photos ||
      (data.imageUri
        ? [
            {
              id: `${data.id}-photo-1`,
              timestamp: data.timestamp,
              imageUri: data.imageUri,
            },
          ]
        : []);

    return new FoodAnalysis({
      id: data.id,
      productName: data.productName,
      timestamp: data.timestamp,
      nutritionInfo: data.nutrients || data.nutritionInfo,
      ingredients: data.ingredients || [],
      warnings: data.warnings || [],
      servingSize: data.servingSize || "",
      photos: photos,
    });
  }

  toJSON() {
    return {
      id: this.id,
      productName: this.productName,
      timestamp: this.timestamp,
      nutritionInfo: this.nutritionInfo.toJSON(),
      nutrients: this.nutritionInfo.toJSON(), // backwards compatibility
      ingredients: this.ingredients.map((ing) => ing.toJSON()),
      warnings: this.warnings,
      servingSize: this.servingSize,
      photos: this.photos.map((photo) => photo.toJSON()),
      imageUri: this.primaryPhoto?.imageUri || "", // backwards compatibility
    };
  }

  // Get the primary (first/most recent) photo
  get primaryPhoto() {
    return this.photos.length > 0 ? this.photos[0] : null;
  }

  // Convenience getter for backwards compatibility
  get imageUri() {
    return this.primaryPhoto?.imageUri || "";
  }

  // Convenience getter for backwards compatibility
  get nutrients() {
    return this.nutritionInfo;
  }

  // Add a photo to the analysis
  addPhoto(photo) {
    const photoInstance =
      photo instanceof Photo ? photo : Photo.fromJSON(photo);
    this.photos.push(photoInstance);
  }
}
