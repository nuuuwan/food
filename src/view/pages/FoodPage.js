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
  Divider,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";

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
    dailyValue: 50,
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
    label: "Vitamin D",
    alternativeName: "Calciferol",
    sourceUnit: "mcg",
    dailyValue: 20,
    dailyValueUnit: "mcg",
  },
  {
    key: "vitaminB12",
    label: "Vitamin B12",
    alternativeName: "Cobalamin",
    sourceUnit: "mcg",
    dailyValue: 2.4,
    dailyValueUnit: "mcg",
  },
  {
    key: "folate",
    label: "Vitamin B9",
    alternativeName: "Folate",
    sourceUnit: "mcg",
    dailyValue: 400,
    dailyValueUnit: "mcg",
  },
  {
    key: "vitaminC",
    label: "Vitamin C",
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
      value: sugarGrams,
      unit: "g",
      panelColor: getTrafficLightPanelColor("sugar", sugarGrams),
    },
    {
      key: "salt",
      label: "Salt",
      value: saltGrams,
      unit: "g",
      panelColor: getTrafficLightPanelColor("salt", saltGrams),
    },
    {
      key: "fat",
      label: "Fat",
      value: fatGrams,
      unit: "g",
      panelColor: getTrafficLightPanelColor("fat", fatGrams),
    },
  ];

  const calorieSegments = [
    {
      key: "protein",
      label: "Protein",
      calories: proteinCalories,
      color: theme.palette.success.main,
    },
    {
      key: "fat",
      label: "Fat",
      calories: fatCalories,
      color: theme.palette.warning.main,
    },
    {
      key: "carbs",
      label: "Carbs",
      calories: carbsCalories,
      color: theme.palette.error.main,
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

  const isUnknownQuantity = (quantity) => {
    if (quantity === null || quantity === undefined) {
      return true;
    }

    const normalized = String(quantity).trim().toLowerCase();
    return normalized === "" || normalized === "unknown";
  };

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
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Image size:{" "}
          {primaryImageSizeKB === null
            ? "Unavailable"
            : `${formatNumber(primaryImageSizeKB, 1)} KB`}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Serving Size: {servingSize || "-"}
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Nutrition Facts
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Values per serving
            </Typography>

            <Box
              sx={{
                mb: 3,
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Traffic light warning
              </Typography>
              <Grid container spacing={1.5}>
                {warningBadges.map((item) => {
                  const valueLabel =
                    item.value === null || item.value === undefined
                      ? `...${item.unit}/100g`
                      : `${formatNumber(item.value, 2)}${item.unit}/100g`;

                  return (
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      key={item.key}
                      sx={{ display: "flex" }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          maxWidth: 150,
                          mx: { xs: "auto", sm: 0 },
                          minHeight: 150,
                          borderRadius: 2,
                          border: "2px solid",
                          borderColor: "common.black",
                          backgroundColor: item.panelColor,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            pt: 2,
                            pb: 1,
                            px: 1.5,
                            textAlign: "center",
                            color: "common.white",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 700, lineHeight: 1.1 }}
                          >
                            {item.label}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            m: 1,
                            px: 1,
                            py: 1,
                            borderRadius: 1.25,
                            border: "2px solid",
                            borderColor: "grey.400",
                            backgroundColor: "common.white",
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, color: "text.primary" }}
                          >
                            {valueLabel}
                          </Typography>
                        </Box>
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
                border: "1px solid",
                borderColor: "divider",
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

                  return (
                    <Grid item xs={12} sm={4} key={segment.key}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                          backgroundColor: "background.paper",
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
                border: "1px solid",
                borderColor: "divider",
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
                          p: 1.25,
                          borderRadius: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                          backgroundColor: "background.paper",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatNumber(displayValue, 2)} {item.displayUnit}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {percent === null
                            ? "-"
                            : `${formatNumber(percent, 0)}% adult daily value`}
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
                border: "1px solid",
                borderColor: "divider",
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
                  {visibleVitaminFields.map((item) => {
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
                            p: 1.25,
                            borderRadius: 1.5,
                            border: "1px solid",
                            borderColor: "divider",
                            backgroundColor: "background.paper",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            gap: 1,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.alternativeName
                                ? `${item.label} (${item.alternativeName})`
                                : item.label}
                            </Typography>
                            <Typography variant="body2">
                              {formatNumber(rawValue)} {item.sourceUnit}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "text.secondary" }}
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
                border: "1px solid",
                borderColor: "divider",
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
                  {visibleMineralFields.map((item) => {
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
                            p: 1.25,
                            borderRadius: 1.5,
                            border: "1px solid",
                            borderColor: "divider",
                            backgroundColor: "background.paper",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            gap: 1,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.alternativeName
                                ? `${item.label} (${item.alternativeName})`
                                : item.label}
                            </Typography>
                            <Typography variant="body2">
                              {formatNumber(rawValue)} {item.sourceUnit}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "text.secondary" }}
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

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 2 }}
            >
              Results are estimated from label text extracted from the uploaded
              image and model-based nutrient inference. Prompt and analysis
              logic (requestGeminiAnalysis):{" "}
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

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Ingredients
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box component="ol" sx={{ pl: 2 }}>
              {(ingredients || []).map((ingredient, index) => (
                <li key={index}>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {ingredient.name}
                    </Typography>
                    {!isUnknownQuantity(ingredient.quantity) && (
                      <Typography variant="body2" color="text.secondary">
                        {ingredient.quantity}
                      </Typography>
                    )}
                  </Box>
                </li>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default FoodPage;
