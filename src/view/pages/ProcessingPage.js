import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart } from "@mui/x-charts/PieChart";
import { useData } from "../../nonview/core/DataContext";
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
import TopRatingsOverlay from "../moles/TopRatingsOverlay";

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

const ProcessingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    currentFood,
    currentScan,
    analysisState,
    processingStatus,
    processingSnapshot,
    analysisPreview,
  } = useData();

  const statusMessage = processingStatus.detail || processingStatus.title;
  const previewImage = processingSnapshot?.previewImage || currentScan;
  const resolvedFood = currentFood || null;
  const nutrients = resolvedFood?.nutrients || null;
  const ingredients = Array.isArray(resolvedFood?.ingredients)
    ? resolvedFood.ingredients
    : [];
  const servingSize =
    resolvedFood?.servingSize || analysisPreview?.servingSize || null;

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

  const getNovaLabelByCode = (code) =>
    ({
      "NOVA 1": "Unprocessed or minimally processed",
      "NOVA 2": "Processed culinary ingredient",
      "NOVA 3": "Processed food",
      "NOVA 4": "Ultra-processed food",
    })[code] || "Unknown";

  const inferNormalizedNovaCode = (rawValue) => {
    const normalized = String(rawValue || "")
      .trim()
      .toUpperCase();
    const match = normalized.match(/([1-4])/);
    return match ? `NOVA ${match[1]}` : "-";
  };

  const modelNutriGrade = String(
    resolvedFood?.classifications?.singaporeNutriGrade || "",
  )
    .trim()
    .toUpperCase();
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
    String(
      resolvedFood?.classifications?.singaporeNutriGradeReason || "",
    ).trim() ||
    `Estimated from sugar ${formatNumber(sugarPer100g, 1)}g and saturated fat ${formatNumber(saturatedFatPer100g, 1)}g per 100g.`;

  const modelNovaClassCode = inferNormalizedNovaCode(
    resolvedFood?.classifications?.novaClassCode ||
      resolvedFood?.classifications?.novaClass,
  );
  const modelNovaClassLabel = String(
    resolvedFood?.classifications?.novaClassLabel || "",
  ).trim();
  const modelNovaClassReason = String(
    resolvedFood?.classifications?.novaClassReason || "",
  ).trim();
  const modelNovaTriggerItems = Array.isArray(
    resolvedFood?.classifications?.novaTriggerItems,
  )
    ? resolvedFood.classifications.novaTriggerItems.filter(Boolean)
    : [];
  const novaClass =
    modelNovaClassCode !== "-"
      ? {
          code: modelNovaClassCode,
          label: modelNovaClassLabel || getNovaLabelByCode(modelNovaClassCode),
        }
      : { code: "-", label: "Unknown" };
  const novaClassReason =
    modelNovaClassReason ||
    `Estimated from ingredient profile (${ingredients.length} listed) and added sugar ${formatNumber(toNullableNumber(nutrients?.addedSugar) || 0, 1)}g.`;
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
      value: sugarPer100g,
      unit: "g",
      panelColor: getTrafficLightPanelColor("sugar", sugarPer100g),
    },
    {
      key: "salt",
      label: "Salt",
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
      color: "#2e7d32",
    },
    {
      key: "fat",
      label: "Fat",
      grams: fat,
      gramsUnit: "g",
      dailyValue: 78,
      dailyValueUnit: "g",
      calories: fatCalories,
      color: "#ef6c00",
    },
    {
      key: "carbs",
      label: "Carbs",
      grams: carbs,
      gramsUnit: "g",
      dailyValue: 275,
      dailyValueUnit: "g",
      calories: carbsCalories,
      color: "#c62828",
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

  const isUnknownQuantity = (quantity) => {
    if (quantity === null || quantity === undefined) {
      return true;
    }

    const normalized = String(quantity).trim().toLowerCase();
    return normalized === "" || normalized === "unknown";
  };

  const ingredientListText = ingredients
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

  const getSectionSx = (isAvailable) => ({
    opacity: isAvailable ? 1 : 0.35,
    transition: "opacity 260ms ease",
  });

  useEffect(() => {
    if (analysisState === "success" && currentFood?.id) {
      const timer = setTimeout(() => {
        navigate(`/item/${currentFood.id}`);
      }, 2200);

      return () => clearTimeout(timer);
    }

    if (analysisState === "error") {
      navigate("/list");
    }
  }, [analysisState, currentFood, navigate]);

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
        <Paper
          elevation={2}
          sx={{
            overflow: "hidden",
            position: "relative",
            height: { xs: 280, sm: 380, md: 460 },
            borderRadius: 0,
            bgcolor: "grey.200",
          }}
        >
          {previewImage ? (
            <Box
              component="img"
              src={previewImage}
              alt={resolvedFood?.productName || "Processing preview"}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Preparing image...
              </Typography>
            </Box>
          )}

          <TopRatingsOverlay
            warningBadges={warningBadges}
            singaporeGradeScale={singaporeGradeScale}
            singaporeNutriGrade={singaporeNutriGrade}
            novaBadgeColor={novaBadgeColor}
            novaClassNumber={novaClassNumber}
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
              {resolvedFood?.productName ||
                analysisPreview?.productName ||
                "Building result..."}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
              {statusMessage || "Analyzing image..."}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2.5,
            fontStyle: "italic",
            ...getSectionSx(Boolean(ingredientListText)),
          }}
        >
          {ingredientListText || "Building ingredient list..."}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            ...getSectionSx(Boolean(servingSize || effectiveServingSizeGrams)),
          }}
        >
          Serving Size: {servingSize || "-"}
          {effectiveServingSizeGrams !== null
            ? ` • ${formatNumber(effectiveServingSizeGrams, 1)} g`
            : ""}
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Paper
              elevation={0}
              sx={{
                mb: 3,
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
                ...getSectionSx(Boolean(nutrients)),
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 600 }}>
                Calorie Breakdown
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
            </Paper>

            <Paper
              elevation={0}
              sx={{
                mb: 3,
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
                ...getSectionSx(Boolean(nutrients)),
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
            </Paper>

            <Paper
              elevation={0}
              sx={{
                mb: 3,
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
                ...getSectionSx(Boolean(nutrients)),
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
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
                ...getSectionSx(Boolean(nutrients)),
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
            </Paper>

            <Box
              sx={{
                mt: 3,
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
                ...getSectionSx(
                  Boolean(resolvedFood?.classifications || nutrients),
                ),
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
              sx={{ display: "block", mt: 1.25 }}
            >
              {statusMessage || "Building your result..."}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default ProcessingPage;
