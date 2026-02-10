export class NutritionInfo {
  constructor({
    calories = 0,
    protein = 0,
    carbs = 0,
    fat = 0,
    fiber = 0,
    sodium = 0,
    sugar = 0,
  } = {}) {
    this.calories = calories;
    this.protein = protein;
    this.carbs = carbs;
    this.fat = fat;
    this.fiber = fiber;
    this.sodium = sodium;
    this.sugar = sugar;
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
      fiber: this.fiber,
      sodium: this.sodium,
      sugar: this.sugar,
    };
  }
}
