import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useData } from "../../nonview/core/DataContext";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

const DAILY_VALUE_FIELDS = [
  {
    key: "fiber",
    label: "Fibre",
    sourceUnit: "g",
    displayUnit: "g",
    dailyValue: 28,
    dailyValueUnit: "g",
  },
  {
    key: "sugar",
    label: "Sugar",
    sourceUnit: "g",
    displayUnit: "g",
    dailyValue: 25,
    dailyValueUnit: "g",
  },
  {
    key: "cholesterol",
    label: "Cholesterol",
    sourceUnit: "mg",
    displayUnit: "mg",
    dailyValue: 300,
    dailyValueUnit: "mg",
  },
];

const VITAMIN_DV_FIELDS = [
  {
    key: "vitaminD",
    label: "D",
    alternativeName: "Calciferol",
    sourceUnit: "mcg",
    dailyValue: 20,
    dailyValueUnit: "mcg",
  },
  {
    key: "vitaminB12",
    label: "B12",
    alternativeName: "Cobalamin",
    sourceUnit: "mcg",
    dailyValue: 2.4,
    dailyValueUnit: "mcg",
  },
  {
    key: "folate",
    label: "B9",
    alternativeName: "Folate",
    sourceUnit: "mcg",
    dailyValue: 400,
    dailyValueUnit: "mcg",
  },
  {
    key: "vitaminC",
    label: "C",
    alternativeName: "Ascorbic Acid",
    sourceUnit: "mg",
    dailyValue: 90,
    dailyValueUnit: "mg",
  },
];

const MINERAL_DV_FIELDS = [
  {
    key: "sodium",
    label: "Sodium",
    alternativeName: "Na",
    sourceUnit: "mg",
    dailyValue: 2300,
    dailyValueUnit: "mg",
  },
  {
    key: "potassium",
    label: "Potassium",
    alternativeName: "K",
    sourceUnit: "mg",
    dailyValue: 4700,
    dailyValueUnit: "mg",
  },
  {
    key: "calcium",
    label: "Calcium",
    alternativeName: "Ca",
    sourceUnit: "mg",
    dailyValue: 1300,
    dailyValueUnit: "mg",
  },
  {
    key: "iron",
    label: "Iron",
    alternativeName: "Fe",
    sourceUnit: "mg",
    dailyValue: 18,
    dailyValueUnit: "mg",
  },
  {
    key: "magnesium",
    label: "Magnesium",
    alternativeName: "Mg",
    sourceUnit: "mg",
    dailyValue: 420,
    dailyValueUnit: "mg",
  },
  {
    key: "zinc",
    label: "Zinc",
    alternativeName: "Zn",
    sourceUnit: "mg",
    dailyValue: 11,
    dailyValueUnit: "mg",
  },
];

const FoodPage = () => {
  const theme = useTheme();
  const { foodId } = useParams();
  const { currentFood, foodHistory, loadFoodById } = useData();

  const routeFoodFromHistory = useMemo(
    () => foodHistory.find((item) => item.id === foodId) || null,
    [foodHistory, foodId],
  );

  useEffect(() => {
    if (!foodId) {
      return;
    }

    if (!currentFood || currentFood.id !== foodId) {
      loadFoodById(foodId);
    }
  }, [foodId, currentFood, loadFoodById]);

  const displayFood =
    currentFood && currentFood.id === foodId
      ? currentFood
      : routeFoodFromHistory;

  if (!displayFood) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const {
    productName,
    nutrients,
    ingredients,
    servingSize,
    timestamp,
    photos,
  } = displayFood;

  const getServingSizeGrams = (servingSizeValue) => {
    if (!servingSizeValue) {
      return null;
    }

    const match = String(servingSizeValue).match(
      /(\d+(?:\.\d+)?)\s*(g|gram|grams)\b/i,
    );
    if (!match) {
      return null;
    }

    const parsed = Number(match[1]);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const toNullableNumber = (value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    if (typeof value === "number") {
      return Number.isFinite(value) ? value : null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const formatNumber = (value, maximumFractionDigits = 1) => {
    if (value === null || value === undefined || !Number.isFinite(value)) {
      return "-";
    }

    const maxDigits = Math.max(0, Number(maximumFractionDigits) || 0);
    const minDigits = Math.min(maxDigits, value % 1 === 0 ? 0 : 1);

    return value.toLocaleString("en-US", {
      maximumFractionDigits: maxDigits,
      minimumFractionDigits: minDigits,
    });
  };

  const convertUnit = (value, fromUnit, toUnit) => {
    if (value === null || value === undefined || !Number.isFinite(value)) {
      return null;
    }

    if (fromUnit === toUnit) {
      return value;
    }

    if (fromUnit === "mg" && toUnit === "g") {
      return value / 1000;
    }

    if (fromUnit === "mcg" && toUnit === "mg") {
      return value / 1000;
    }

    if (fromUnit === "mg" && toUnit === "mcg") {
      return value * 1000;
    }

    return value;
  };

  const getDailyValuePercent = (
    rawValue,
    sourceUnit,
    dailyValue,
    dailyValueUnit,
  ) => {
    if (rawValue === null || rawValue === undefined) {
      return null;
    }

    const normalizedValue = convertUnit(rawValue, sourceUnit, dailyValueUnit);
    if (
      normalizedValue === null ||
      !Number.isFinite(normalizedValue) ||
      !dailyValue ||
      !Number.isFinite(dailyValue)
    ) {
      return null;
    }

    return (normalizedValue / dailyValue) * 100;
  };

  const protein = toNullableNumber(nutrients?.protein) || 0;
  const fat = toNullableNumber(nutrients?.fat) || 0;
  const carbs = toNullableNumber(nutrients?.carbs) || 0;

  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;
  const carbsCalories = carbs * 4;
  const totalMacroCalories = proteinCalories + fatCalories + carbsCalories;
  const totalCalories =
    toNullableNumber(nutrients?.calories) || totalMacroCalories;

  const sodiumMg = toNullableNumber(nutrients?.sodium);
  const fatGrams = toNullableNumber(nutrients?.fat);
  const sugarGrams = toNullableNumber(nutrients?.sugar);
  const saltGrams =
    sodiumMg === null || sodiumMg === undefined
      ? null
      : (sodiumMg / 1000) * 2.5;
  const servingSizeGrams = getServingSizeGrams(servingSize);
  const nutrientMassLowerBound = [protein, fat, carbs].reduce(
    (total, value) => total + (Number.isFinite(value) ? value : 0),
    0,
  );
  const effectiveServingSizeGrams =
    servingSizeGrams && servingSizeGrams > 0
      ? Math.max(servingSizeGrams, nutrientMassLowerBound)
      : nutrientMassLowerBound > 0
        ? nutrientMassLowerBound
        : null;

  const toPer100g = (valueInGrams) => {
    if (valueInGrams === null || valueInGrams === undefined) {
      return null;
    }

    if (!effectiveServingSizeGrams || effectiveServingSizeGrams <= 0) {
      return valueInGrams;
    }

    return (valueInGrams / effectiveServingSizeGrams) * 100;
  };

  const sugarPer100g = toPer100g(sugarGrams);
  const saltPer100g = toPer100g(saltGrams);
  const fatPer100g = toPer100g(fatGrams);
  const saturatedFatPer100g = toPer100g(
    toNullableNumber(nutrients?.saturatedFat) || 0,
  );

  const getSingaporeNutriGrade = (sugarValue, saturatedFatValue) => {
    const getSugarGrade = (value) => {
      if (value === null || value === undefined) {
        return null;
      }

      if (value <= 1) {
        return "A";
      }
      if (value <= 5) {
        return "B";
      }
      if (value <= 10) {
        return "C";
      }
      return "D";
    };

    const getSaturatedFatGrade = (value) => {
      if (value === null || value === undefined) {
        return null;
      }

      if (value <= 0.7) {
        return "A";
      }
      if (value <= 1.2) {
        return "B";
      }
      if (value <= 2.8) {
        return "C";
      }
      return "D";
    };

    const gradeRank = { A: 1, B: 2, C: 3, D: 4 };
    const sugarGrade = getSugarGrade(sugarValue);
    const satFatGrade = getSaturatedFatGrade(saturatedFatValue);

    if (!sugarGrade && !satFatGrade) {
      return "-";
    }

    if (!sugarGrade) {
      return satFatGrade;
    }

    if (!satFatGrade) {
      return sugarGrade;
    }

    return gradeRank[sugarGrade] >= gradeRank[satFatGrade]
      ? sugarGrade
      : satFatGrade;
  };

  const modelNutriGrade = String(
    displayFood?.classifications?.singaporeNutriGrade || "",
  )
    .trim()
    .toUpperCase();
  const modelNutriGradeReason = String(
    displayFood?.classifications?.singaporeNutriGradeReason || "",
  ).trim();
  const inferredSingaporeNutriGrade = getSingaporeNutriGrade(
    sugarPer100g,
    saturatedFatPer100g,
  );
  const singaporeNutriGrade = ["A", "B", "C", "D"].includes(modelNutriGrade)
    ? modelNutriGrade
    : inferredSingaporeNutriGrade;
  const singaporeGradeScale = [
    { grade: "A", color: "#1f8b43" },
    { grade: "B", color: "#8abf2f" },
    { grade: "C", color: "#f0a128" },
    { grade: "D", color: "#c71c22" },
  ];
  const singaporeNutriGradeReason =
    modelNutriGradeReason ||
    `Estimated from sugar ${formatNumber(sugarPer100g, 1)}g and saturated fat ${formatNumber(saturatedFatPer100g, 1)}g per 100g.`;

  const getNovaLabelByCode = (code) =>
    ({
      "NOVA 1": "Unprocessed or minimally processed",
      "NOVA 2": "Processed culinary ingredient",
      "NOVA 3": "Processed food",
      "NOVA 4": "Ultra-processed food",
    })[code] || "Unknown";

  const inferNOVAClass = () => {
    const normalizedIngredients = (ingredients || [])
      .map((ingredient) => String(ingredient?.name || "").toLowerCase())
      .filter(Boolean);
    const ingredientCount = normalizedIngredients.length;

    if (ingredientCount === 0) {
      return { code: "-", label: "Unknown" };
    }

    const additiveKeywords = [
      "flavour",
      "flavor",
      "emulsifier",
      "stabilizer",
      "stabiliser",
      "preservative",
      "sweetener",
      "colour",
      "color",
      "maltodextrin",
      "hydrogenated",
      "modified starch",
      "high fructose",
    ];

    const hasAdditiveSignals = normalizedIngredients.some((name) =>
      additiveKeywords.some((keyword) => name.includes(keyword)),
    );

    const hasAddedSugar = (toNullableNumber(nutrients?.addedSugar) || 0) > 0;
    const hasManyIngredients = ingredientCount >= 5;

    if (hasAdditiveSignals || (hasManyIngredients && hasAddedSugar)) {
      return { code: "NOVA 4", label: "Ultra-processed food" };
    }

    if (hasManyIngredients || hasAddedSugar) {
      return { code: "NOVA 3", label: "Processed food" };
    }

    if (ingredientCount >= 2) {
      return { code: "NOVA 2", label: "Processed culinary ingredient" };
    }

    return { code: "NOVA 1", label: "Unprocessed or minimally processed" };
  };

  const inferNormalizedNovaCode = (rawValue) => {
    const normalized = String(rawValue || "")
      .trim()
      .toUpperCase();
    const match = normalized.match(/([1-4])/);
    return match ? `NOVA ${match[1]}` : "-";
  };

  const modelNovaClassCode = inferNormalizedNovaCode(
    displayFood?.classifications?.novaClassCode ||
      displayFood?.classifications?.novaClass,
  );
  const modelNovaClassLabel = String(
    displayFood?.classifications?.novaClassLabel || "",
  ).trim();
  const modelNovaClassReason = String(
    displayFood?.classifications?.novaClassReason || "",
  ).trim();
  const modelNovaTriggerItems = Array.isArray(
    displayFood?.classifications?.novaTriggerItems,
  )
    ? displayFood.classifications.novaTriggerItems.filter(Boolean)
    : [];
  const inferredNovaClass = inferNOVAClass();
  const novaClass =
    modelNovaClassCode !== "-"
      ? {
          code: modelNovaClassCode,
          label: modelNovaClassLabel || getNovaLabelByCode(modelNovaClassCode),
        }
      : inferredNovaClass;
  const novaClassReason =
    modelNovaClassReason ||
    `Estimated from ingredient profile (${(ingredients || []).length} listed) and added sugar ${formatNumber(toNullableNumber(nutrients?.addedSugar) || 0, 1)}g.`;
  const novaSpecificItemText =
    modelNovaTriggerItems.length > 0 ? modelNovaTriggerItems.join(", ") : "";
  const novaClassNumber = (novaClass.code.match(/(\d+)/) || [])[1] || "-";
  const novaBadgeColor =
    {
      1: "#38b000",
      2: "#8abf2f",
      3: "#f0a128",
      4: "#c71c22",
    }[novaClassNumber] || theme.palette.grey[500];

  const getTrafficLightPanelColor = (key, valuePer100g) => {
    if (valuePer100g === null || valuePer100g === undefined) {
      return theme.palette.grey[500];
    }

    if (key === "sugar") {
      if (valuePer100g > 22) {
        return theme.palette.error.main;
      }
      if (valuePer100g >= 5) {
        return theme.palette.warning.main;
      }
      return theme.palette.success.main;
    }

    if (key === "salt") {
      if (valuePer100g > 1.25) {
        return theme.palette.error.main;
      }
      if (valuePer100g >= 0.25) {
        return theme.palette.warning.main;
      }
      return theme.palette.success.main;
    }

    if (key === "fat") {
      if (valuePer100g > 17.5) {
        return theme.palette.error.main;
      }
      if (valuePer100g >= 3) {
        return theme.palette.warning.main;
      }
      return theme.palette.success.main;
    }

    return theme.palette.grey[500];
  };

  const warningBadges = [
    {
      key: "sugar",
      label: "Sugar",
      sinhalaLabel: "සීනි",
      tamilLabel: "சர்க்கரை",
      value: sugarPer100g,
      unit: "g",
      panelColor: getTrafficLightPanelColor("sugar", sugarPer100g),
    },
    {
      key: "salt",
      label: "Salt",
      sinhalaLabel: "ලුණු",
      tamilLabel: "உப்பு",
      value:
        saltPer100g === null || saltPer100g === undefined
          ? null
          : saltPer100g * 1000,
      unit: "mg",
      panelColor: getTrafficLightPanelColor("salt", saltPer100g),
    },
    {
      key: "fat",
      label: "Fat",
      sinhalaLabel: "මේද",
      tamilLabel: "கொழுப்பு",
      value: fatPer100g,
      unit: "g",
      panelColor: getTrafficLightPanelColor("fat", fatPer100g),
    },
  ];

  const calorieSegments = [
    {
      key: "protein",
      label: "Protein",
      grams: protein,
      gramsUnit: "g",
      dailyValue: 50,
      dailyValueUnit: "g",
      calories: proteinCalories,
      color: "#1e3a8a",
    },
    {
      key: "fat",
      label: "Fat",
      grams: fat,
      gramsUnit: "g",
      dailyValue: 78,
      dailyValueUnit: "g",
      calories: fatCalories,
      color: "#6d28d9",
    },
    {
      key: "carbs",
      label: "Carbs",
      grams: carbs,
      gramsUnit: "g",
      dailyValue: 275,
      dailyValueUnit: "g",
      calories: carbsCalories,
      color: "#be185d",
    },
  ];

  const getVisibleDailyValueFields = (fields) =>
    fields.filter((item) => {
      const rawValue = toNullableNumber(nutrients?.[item.key]);
      const percent = getDailyValuePercent(
        rawValue,
        item.sourceUnit,
        item.dailyValue,
        item.dailyValueUnit,
      );

      if (percent === null) {
        return true;
      }

      return percent >= 0.5;
    });

  const visibleVitaminFields = getVisibleDailyValueFields(VITAMIN_DV_FIELDS);
  const visibleMineralFields = getVisibleDailyValueFields(MINERAL_DV_FIELDS);

  const getFieldDailyValuePercent = (field) => {
    const rawValue = toNullableNumber(nutrients?.[field.key]);
    const percent = getDailyValuePercent(
      rawValue,
      field.sourceUnit,
      field.dailyValue,
      field.dailyValueUnit,
    );

    return percent === null ? -1 : percent;
  };

  const sortedVisibleVitaminFields = [...visibleVitaminFields].sort(
    (left, right) =>
      getFieldDailyValuePercent(right) - getFieldDailyValuePercent(left),
  );

  const sortedVisibleMineralFields = [...visibleMineralFields].sort(
    (left, right) =>
      getFieldDailyValuePercent(right) - getFieldDailyValuePercent(left),
  );

  const formatDateTime = (ts) => {
    const date = new Date(ts);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateStr} at ${timeStr}`;
  };

  const getImageSizeKB = (imageUri) => {
    if (!imageUri || typeof imageUri !== "string") {
      return null;
    }

    const match = imageUri.match(/^data:.*;base64,(.+)$/);
    if (!match) {
      return null;
    }

    const base64 = match[1];
    const bytes = Math.floor((base64.length * 3) / 4);
    return bytes / 1024;
  };

  const primaryImageSizeKB = getImageSizeKB(photos?.[0]?.imageUri);
  const imageSizeLabel =
    primaryImageSizeKB === null
      ? "Unavailable"
      : `${formatNumber(primaryImageSizeKB, 1)} KB`;

  const isUnknownQuantity = (quantity) => {
    if (quantity === null || quantity === undefined) {
      return true;
    }

    const normalized = String(quantity).trim().toLowerCase();
    return normalized === "" || normalized === "unknown";
  };

  const ingredientListText = (ingredients || [])
    .map((ingredient) => {
      const name = String(ingredient?.name || "").trim();
      if (!name) {
        return "";
      }

      const quantity = ingredient?.quantity;
      if (isUnknownQuantity(quantity)) {
        return name;
      }

      return `${name} (${String(quantity).trim()})`;
    })
    .filter(Boolean)
    .join(", ");

  const formatOverlayValue = (value, unit) => {
    if (value === null || value === undefined || !Number.isFinite(value)) {
      return `...${unit}/100g`;
    }
    return `${Math.max(0, Math.round(value))}${unit}/100g`;
  };

  const renderTopRatingsOverlay = () => (
    <Box
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        width: { xs: 198, sm: 208 },
        display: "flex",
        gap: 0.5,
        justifyContent: "flex-end",
        alignItems: "stretch",
      }}
    >
      <Box
        sx={{
          flex: 1,
          p: 0.35,
          borderRadius: 1.2,
          backgroundColor: "rgba(255,255,255,0.88)",
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 0.35,
        }}
      >
        {warningBadges.map((item) => (
          <Box
            key={item.key}
            sx={{
              borderRadius: 1,
              border: "1px solid",
              borderColor: "common.black",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                backgroundColor: item.panelColor,
                color: "common.white",
                textAlign: "center",
                py: 0.2,
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, fontSize: "0.54rem", lineHeight: 1 }}
              >
                {item.label}
              </Typography>
            </Box>
            <Box sx={{ p: 0.2, textAlign: "center", bgcolor: "common.white" }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, fontSize: "0.52rem", lineHeight: 1 }}
              >
                {formatOverlayValue(item.value, item.unit)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          width: { xs: 72, sm: 76 },
          p: 0.35,
          borderRadius: 1.2,
          backgroundColor: "rgba(255,255,255,0.88)",
        }}
      >
        <Typography
          sx={{
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1,
            mb: 0.2,
            fontSize: "0.5rem",
          }}
        >
          NUTRI-GRADE
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            border: "1px solid",
            borderColor: "common.black",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          {singaporeGradeScale.map((gradeItem) => (
            <Box
              key={gradeItem.grade}
              sx={{
                py: 0.2,
                textAlign: "center",
                color: "common.white",
                backgroundColor: gradeItem.color,
                fontWeight: singaporeNutriGrade === gradeItem.grade ? 900 : 500,
                fontSize: "0.6rem",
                outline:
                  singaporeNutriGrade === gradeItem.grade
                    ? "1.5px solid #000"
                    : "none",
              }}
            >
              {gradeItem.grade}
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: 34, sm: 36 },
          borderRadius: 1.2,
          backgroundColor: "rgba(255,255,255,0.88)",
          p: 0.3,
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            color: "text.secondary",
            fontWeight: 900,
            lineHeight: 1,
            mb: 0.1,
            fontSize: "0.5rem",
          }}
        >
          NOVA
        </Typography>
        <Box
          sx={{
            minHeight: 33,
            borderRadius: 0.5,
            backgroundColor: novaBadgeColor,
            color: "common.white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {novaClassNumber}
        </Box>
      </Box>
    </Box>
  );

  const renderPhotoCollage = () => {
    if (!photos || photos.length === 0) return null;

    const collageHeight = { xs: 280, sm: 380, md: 460 };

    if (photos.length === 1) {
      return (
        <Paper
          elevation={2}
          sx={{
            overflow: "hidden",
            position: "relative",
            height: collageHeight,
            borderRadius: 0,
          }}
        >
          {renderTopRatingsOverlay()}
          <img
            src={photos[0].imageUri}
            alt={productName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
              p: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              {productName}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
              {formatDateTime(timestamp)}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
              {imageSizeLabel}
            </Typography>
          </Box>
        </Paper>
      );
    }

    return (
      <Paper
        elevation={2}
        sx={{
          overflow: "hidden",
          position: "relative",
          height: collageHeight,
          borderRadius: 0,
        }}
      >
        {renderTopRatingsOverlay()}
        <Grid container spacing={0.5} sx={{ height: "100%" }}>
          {photos.slice(0, 4).map((photo, index) => (
            <Grid
              item
              xs={
                photos.length === 2
                  ? 6
                  : photos.length === 3 && index === 0
                    ? 12
                    : 6
              }
              key={photo.id}
              sx={{
                height:
                  photos.length === 2
                    ? "100%"
                    : photos.length === 3 && index === 0
                      ? "50%"
                      : "50%",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={photo.imageUri}
                  alt={`${productName} - ${index + 1}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
            p: 2,
          }}
        >
          <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
            {productName}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
            {formatDateTime(timestamp)} • {photos.length} photo
            {photos.length !== 1 ? "s" : ""}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
            {imageSizeLabel}
          </Typography>
        </Box>
      </Paper>
    );
  };

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          ml: "calc(50% - 50vw)",
          mr: "calc(50% - 50vw)",
          mt: 0,
          mb: 3,
        }}
      >
        {renderPhotoCollage()}
      </Box>

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2.5, fontStyle: "italic" }}
        >
          {ingredientListText || "-"}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Serving Size: {servingSize || "-"}
          {effectiveServingSizeGrams !== null
            ? ` • ${formatNumber(effectiveServingSizeGrams, 1)} g`
            : ""}
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Nutrition Facts
            </Typography>

            <Box
              sx={{
                mb: 3,
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 600 }}>
                Calories Breakdown
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                Total calories: {formatNumber(totalCalories, 0)} kcal
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 1.5 }}
              >
                DV means Daily Value based on a 2,000 kcal adult diet.
              </Typography>
              {totalMacroCalories > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 1.5,
                  }}
                >
                  <PieChart
                    height={180}
                    hideLegend
                    series={[
                      {
                        innerRadius: 36,
                        outerRadius: 70,
                        paddingAngle: 2,
                        cornerRadius: 3,
                        data: calorieSegments.map((segment) => ({
                          id: segment.key,
                          value: segment.calories,
                          label: segment.label,
                          color: segment.color,
                        })),
                      },
                    ]}
                  />
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1.5 }}
                >
                  No macro calorie breakdown available.
                </Typography>
              )}

              <Grid container spacing={1}>
                {calorieSegments.map((segment) => {
                  const pct =
                    totalMacroCalories > 0
                      ? (segment.calories / totalMacroCalories) * 100
                      : 0;
                  const gramsDvPct = getDailyValuePercent(
                    segment.grams,
                    segment.gramsUnit,
                    segment.dailyValue,
                    segment.dailyValueUnit,
                  );

                  return (
                    <Grid item xs={12} sm={4} key={segment.key}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1.5,
                          backgroundColor: alpha(segment.color, 0.1),
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: segment.color, fontWeight: 600 }}
                        >
                          {segment.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: segment.color }}
                        >
                          {formatNumber(segment.calories, 0)} kcal (
                          {formatNumber(pct, 0)}%)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatNumber(segment.grams, 0)} {segment.gramsUnit}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {gramsDvPct === null
                            ? "-"
                            : `${formatNumber(gramsDvPct, 0)}% DV`}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            <Box
              sx={{
                mb: 3,
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Fibre, Sugar & Cholesterol
              </Typography>
              <Grid container spacing={1}>
                {DAILY_VALUE_FIELDS.map((item) => {
                  const rawValue = toNullableNumber(nutrients?.[item.key]);
                  const displayValue = convertUnit(
                    rawValue,
                    item.sourceUnit,
                    item.displayUnit,
                  );
                  const percent = getDailyValuePercent(
                    rawValue,
                    item.sourceUnit,
                    item.dailyValue,
                    item.dailyValueUnit,
                  );

                  return (
                    <Grid item xs={12} sm={4} key={item.key}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1.5,
                          backgroundColor: "action.hover",
                          minHeight: 96,
                          aspectRatio: "1 / 1",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          width: "100%",
                          maxWidth: 140,
                          mx: "auto",
                        }}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.label}
                          </Typography>
                          <Typography variant="body2">
                            {formatNumber(displayValue, 0)} {item.displayUnit}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "text.secondary",
                            mt: 0.5,
                          }}
                        >
                          {percent === null
                            ? "-"
                            : `${formatNumber(percent, 0)}% DV`}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            <Box
              sx={{
                mb: 3,
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Vitamins (Daily Values)
              </Typography>
              {visibleVitaminFields.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No vitamin daily values are available for this item.
                </Typography>
              ) : (
                <Grid container spacing={1}>
                  {sortedVisibleVitaminFields.map((item) => {
                    const rawValue = toNullableNumber(nutrients?.[item.key]);
                    const percent = getDailyValuePercent(
                      rawValue,
                      item.sourceUnit,
                      item.dailyValue,
                      item.dailyValueUnit,
                    );

                    return (
                      <Grid item xs={12} sm={6} md={4} key={item.key}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1.5,
                            backgroundColor: "action.hover",
                            minHeight: 96,
                            aspectRatio: "1 / 1",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            width: "100%",
                            maxWidth: 140,
                            mx: "auto",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {item.label}
                            </Typography>
                            {item.alternativeName && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {item.alternativeName}
                              </Typography>
                            )}
                            <Typography variant="body2">
                              {formatNumber(rawValue, 0)} {item.sourceUnit}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "text.secondary",
                              mt: 0.5,
                            }}
                          >
                            {percent === null
                              ? "-"
                              : `${formatNumber(percent, 0)}% DV`}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>

            <Box
              sx={{
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Minerals (Daily Values)
              </Typography>
              {visibleMineralFields.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No mineral daily values are available for this item.
                </Typography>
              ) : (
                <Grid container spacing={1}>
                  {sortedVisibleMineralFields.map((item) => {
                    const rawValue = toNullableNumber(nutrients?.[item.key]);
                    const percent = getDailyValuePercent(
                      rawValue,
                      item.sourceUnit,
                      item.dailyValue,
                      item.dailyValueUnit,
                    );

                    return (
                      <Grid item xs={12} sm={6} md={4} key={item.key}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1.5,
                            backgroundColor: "action.hover",
                            minHeight: 96,
                            aspectRatio: "1 / 1",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            width: "100%",
                            maxWidth: 140,
                            mx: "auto",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              {item.alternativeName || item.label}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.label}
                            </Typography>
                            <Typography variant="body2">
                              {formatNumber(rawValue, 0)} {item.sourceUnit}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "text.secondary",
                              mt: 0.5,
                            }}
                          >
                            {percent === null
                              ? "-"
                              : `${formatNumber(percent, 0)}% DV`}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>

            <Box
              sx={{
                mt: 3,
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 0.8, fontWeight: 600 }}>
                Classification Explanations
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.35 }}
              >
                🇱🇰 Sri Lanka Traffic Light: Based on estimated sugar, salt, and
                fat per 100g.
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.35 }}
              >
                🇸🇬 Singapore Nutri-Grade: {singaporeNutriGrade} —{" "}
                {singaporeNutriGradeReason}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                🇧🇷 NOVA (Brazil): {novaClass.code} — {novaClassReason}
              </Typography>
              {novaClass.code === "NOVA 4" && novaSpecificItemText && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.35, fontWeight: 700 }}
                >
                  Ultra-processed trigger item(s): {novaSpecificItemText}
                </Typography>
              )}
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 2 }}
            >
              Results are estimated from label text extracted from the uploaded
              image and model-based nutrient inference. Prompt and analysis
              logic (requestGeminiAnalysis, Google Gemini gemini-2.0-flash by
              Google):{" "}
              <a
                href="https://github.com/nuuuwan/food/blob/main/api/analyze.js"
                target="_blank"
                rel="noreferrer"
              >
                api/analyze.js
              </a>
              .
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default FoodPage;
