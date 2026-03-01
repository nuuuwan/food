const defaultNutrients = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  saturatedFat: 0,
  cholesterol: 0,
  fiber: 0,
  sodium: 0,
  potassium: 0,
  calcium: 0,
  iron: 0,
  magnesium: 0,
  zinc: 0,
  vitaminD: 0,
  vitaminB12: 0,
  folate: 0,
  vitaminC: 0,
  sugar: 0,
  addedSugar: 0,
  caffeine: 0,
  alcohol: 0,
};

const DEFAULT_CLASSIFICATIONS = {
  singaporeNutriGrade: "-",
  singaporeNutriGradeReason: "",
  novaClassCode: "-",
  novaClassLabel: "Unknown",
  novaClassReason: "",
  novaTriggerItems: [],
};

const NOVA_LABEL_BY_CODE = {
  "NOVA 1": "Unprocessed or minimally processed",
  "NOVA 2": "Processed culinary ingredient",
  "NOVA 3": "Processed food",
  "NOVA 4": "Ultra-processed food",
};

module.exports = {
  defaultNutrients,
  DEFAULT_CLASSIFICATIONS,
  NOVA_LABEL_BY_CODE,
};
