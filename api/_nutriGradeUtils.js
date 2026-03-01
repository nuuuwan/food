const toNonNegativeNumber = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.max(0, parsed);
};

const normalizeNutriGrade = (value) => {
  const normalized = String(value || "")
    .trim()
    .toUpperCase();
  return ["A", "B", "C", "D"].includes(normalized) ? normalized : "-";
};

const normalizeNovaCode = (value) => {
  const normalized = String(value || "")
    .trim()
    .toUpperCase();
  const match = normalized.match(/([1-4])/);
  return match ? `NOVA ${match[1]}` : "-";
};

const normalizeShortReason = (value, maxLength = 160) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

const inferNutriGradeFromNutrients = (nutrients) => {
  const sugar = toNonNegativeNumber(nutrients?.sugar);
  const saturatedFat = toNonNegativeNumber(nutrients?.saturatedFat);

  const sugarGrade =
    sugar <= 1 ? "A" : sugar <= 5 ? "B" : sugar <= 10 ? "C" : "D";
  const satFatGrade =
    saturatedFat <= 0.7
      ? "A"
      : saturatedFat <= 1.2
        ? "B"
        : saturatedFat <= 2.8
          ? "C"
          : "D";

  const rank = { A: 1, B: 2, C: 3, D: 4 };
  return rank[sugarGrade] >= rank[satFatGrade] ? sugarGrade : satFatGrade;
};

const inferNutriGradeReasonFromNutrients = (nutrients) => {
  const sugar = toNonNegativeNumber(nutrients?.sugar).toFixed(1);
  const saturatedFat = toNonNegativeNumber(nutrients?.saturatedFat).toFixed(1);
  return `Based on sugar ${sugar}g and saturated fat ${saturatedFat}g per 100g estimate.`;
};

module.exports = {
  toNonNegativeNumber,
  normalizeNutriGrade,
  normalizeNovaCode,
  normalizeShortReason,
  inferNutriGradeFromNutrients,
  inferNutriGradeReasonFromNutrients,
};
