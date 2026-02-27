export class NutritionInfo {
  constructor({
    calories = 0,
    protein = 0,
    carbs = 0,
    fat = 0,
    saturatedFat = 0,
    cholesterol = 0,
    fiber = 0,
    sodium = 0,
    potassium = 0,
    calcium = 0,
    iron = 0,
    magnesium = 0,
    zinc = 0,
    vitaminD = 0,
    vitaminB12 = 0,
    folate = 0,
    vitaminC = 0,
    sugar = 0,
    addedSugar = 0,
    caffeine = 0,
    alcohol = 0,
  } = {}) {
    this.calories = calories;
    this.protein = protein;
    this.carbs = carbs;
    this.fat = fat;
    this.saturatedFat = saturatedFat;
    this.cholesterol = cholesterol;
    this.fiber = fiber;
    this.sodium = sodium;
    this.potassium = potassium;
    this.calcium = calcium;
    this.iron = iron;
    this.magnesium = magnesium;
    this.zinc = zinc;
    this.vitaminD = vitaminD;
    this.vitaminB12 = vitaminB12;
    this.folate = folate;
    this.vitaminC = vitaminC;
    this.sugar = sugar;
    this.addedSugar = addedSugar;
    this.caffeine = caffeine;
    this.alcohol = alcohol;
  }

  static fromJSON(data) {
    return new NutritionInfo(data);
  }

  toJSON() {
    return {
      calories: this.calories,
      protein: this.protein,
      carbs: this.carbs,
      fat: this.fat,
      saturatedFat: this.saturatedFat,
      cholesterol: this.cholesterol,
      fiber: this.fiber,
      sodium: this.sodium,
      potassium: this.potassium,
      calcium: this.calcium,
      iron: this.iron,
      magnesium: this.magnesium,
      zinc: this.zinc,
      vitaminD: this.vitaminD,
      vitaminB12: this.vitaminB12,
      folate: this.folate,
      vitaminC: this.vitaminC,
      sugar: this.sugar,
      addedSugar: this.addedSugar,
      caffeine: this.caffeine,
      alcohol: this.alcohol,
    };
  }
}
