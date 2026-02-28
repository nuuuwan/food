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
    classifications = {},
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
    this.classifications = {
      singaporeNutriGrade: classifications?.singaporeNutriGrade || "-",
      singaporeNutriGradeReason:
        classifications?.singaporeNutriGradeReason || "",
      novaClassCode: classifications?.novaClassCode || "-",
      novaClassLabel: classifications?.novaClassLabel || "Unknown",
      novaClassReason: classifications?.novaClassReason || "",
      novaTriggerItems: Array.isArray(classifications?.novaTriggerItems)
        ? classifications.novaTriggerItems
        : [],
    };
    this.servingSize = servingSize;
    this.photos = photos.map((photo) =>
      photo instanceof Photo ? photo : Photo.fromJSON(photo),
    );
  }

  static fromJSON(data) {
    return new FoodAnalysis({
      id: data.id,
      productName: data.productName,
      timestamp: data.timestamp,
      nutritionInfo: new NutritionInfo(data.nutrients || data.nutritionInfo),
      ingredients: (data.ingredients || []).map((ing) =>
        Ingredient.fromJSON(ing),
      ),
      warnings: data.warnings || [],
      classifications: data.classifications || {},
      servingSize: data.servingSize || "",
      photos: (data.photos || []).map((photo) => Photo.fromJSON(photo)),
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
      classifications: this.classifications,
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
