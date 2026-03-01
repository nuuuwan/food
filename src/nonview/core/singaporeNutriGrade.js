export const SINGAPORE_GRADE_SCALE = [
  { grade: "A", color: "#1f8b43" },
  { grade: "B", color: "#8abf2f" },
  { grade: "C", color: "#f0a128" },
  { grade: "D", color: "#c71c22" },
];

const getSugarGrade = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (value <= 1) return "A";
  if (value <= 5) return "B";
  if (value <= 10) return "C";
  return "D";
};

const getSaturatedFatGrade = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (value <= 0.7) return "A";
  if (value <= 1.2) return "B";
  if (value <= 2.8) return "C";
  return "D";
};

export const getSingaporeNutriGrade = (sugarValue, saturatedFatValue) => {
  const gradeRank = { A: 1, B: 2, C: 3, D: 4 };
  const sugarGrade = getSugarGrade(sugarValue);
  const satFatGrade = getSaturatedFatGrade(saturatedFatValue);

  if (!sugarGrade && !satFatGrade) return "-";
  if (!sugarGrade) return satFatGrade;
  if (!satFatGrade) return sugarGrade;

  return gradeRank[sugarGrade] >= gradeRank[satFatGrade]
    ? sugarGrade
    : satFatGrade;
};

export const resolveSingaporeNutriGrade = (
  displayFood,
  sugarPer100g,
  saturatedFatPer100g,
) => {
  const modelGrade = String(
    displayFood?.classifications?.singaporeNutriGrade || "",
  )
    .trim()
    .toUpperCase();
  const modelReason = String(
    displayFood?.classifications?.singaporeNutriGradeReason || "",
  ).trim();

  const inferredGrade = getSingaporeNutriGrade(
    sugarPer100g,
    saturatedFatPer100g,
  );
  const grade = ["A", "B", "C", "D"].includes(modelGrade)
    ? modelGrade
    : inferredGrade;

  return { grade, modelReason };
};
