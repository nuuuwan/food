import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useData } from "../../nonview/core/DataContext";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
} from "@mui/material";

const NUTRIENT_GROUPS = [
  {
    title: "Energy & Carbs",
    fields: [
      { key: "calories", label: "Calories", unit: "" },
      { key: "carbs", label: "Carbs", unit: "g" },
      { key: "sugar", label: "Sugar", unit: "g" },
      { key: "addedSugar", label: "Added Sugar", unit: "g" },
    ],
  },
  {
    title: "Protein & Fibre",
    fields: [
      { key: "protein", label: "Protein", unit: "g" },
      { key: "fiber", label: "Fiber", unit: "g" },
    ],
  },
  {
    title: "Fats",
    fields: [
      { key: "fat", label: "Fat", unit: "g" },
      { key: "saturatedFat", label: "Saturated Fat", unit: "g" },
      { key: "cholesterol", label: "Cholesterol", unit: "mg" },
    ],
  },
  {
    title: "Minerals",
    fields: [
      { key: "sodium", label: "Sodium", unit: "mg" },
      { key: "potassium", label: "Potassium", unit: "mg" },
      { key: "calcium", label: "Calcium", unit: "mg" },
      { key: "iron", label: "Iron", unit: "mg" },
      { key: "magnesium", label: "Magnesium", unit: "mg" },
      { key: "zinc", label: "Zinc", unit: "mg" },
    ],
  },
  {
    title: "Vitamins",
    fields: [
      { key: "vitaminD", label: "Vitamin D", unit: "mcg" },
      { key: "vitaminB12", label: "Vitamin B12", unit: "mcg" },
      { key: "folate", label: "Folate", unit: "mcg" },
      { key: "vitaminC", label: "Vitamin C", unit: "mg" },
    ],
  },
  {
    title: "Other",
    fields: [
      { key: "caffeine", label: "Caffeine", unit: "mg" },
      { key: "alcohol", label: "Alcohol", unit: "g" },
    ],
  },
];

const NUTRIENT_TONES = {
  calories: "neutral",
  carbs: "neutral",
  fat: "neutral",
  caffeine: "neutral",
  protein: "good",
  fiber: "good",
  potassium: "good",
  calcium: "good",
  iron: "good",
  magnesium: "good",
  zinc: "good",
  vitaminD: "good",
  vitaminB12: "good",
  folate: "good",
  vitaminC: "good",
  sugar: "bad",
  addedSugar: "bad",
  saturatedFat: "bad",
  cholesterol: "bad",
  sodium: "bad",
  alcohol: "bad",
};

const FoodPage = () => {
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

  const formatNutrientValue = (value, unit = "") => {
    if (value === null || value === undefined) {
      return "-";
    }

    return `${value}${unit}`;
  };

  const getNutrientTone = (key) => NUTRIENT_TONES[key] || "neutral";

  const getNutrientColor = (key, value) => {
    if (value === null || value === undefined) {
      return "text.disabled";
    }

    const tone = getNutrientTone(key);

    if (tone === "good") {
      return "success.main";
    }

    if (tone === "bad") {
      return "error.main";
    }

    return "text.secondary";
  };

  const insights = (() => {
    const calories = toNullableNumber(nutrients?.calories);
    const protein = toNullableNumber(nutrients?.protein);
    const fat = toNullableNumber(nutrients?.fat);
    const saturatedFat = toNullableNumber(nutrients?.saturatedFat);
    const cholesterol = toNullableNumber(nutrients?.cholesterol);
    const fiber = toNullableNumber(nutrients?.fiber);
    const sodium = toNullableNumber(nutrients?.sodium);
    const potassium = toNullableNumber(nutrients?.potassium);
    const calcium = toNullableNumber(nutrients?.calcium);
    const iron = toNullableNumber(nutrients?.iron);
    const magnesium = toNullableNumber(nutrients?.magnesium);
    const zinc = toNullableNumber(nutrients?.zinc);
    const vitaminD = toNullableNumber(nutrients?.vitaminD);
    const vitaminB12 = toNullableNumber(nutrients?.vitaminB12);
    const folate = toNullableNumber(nutrients?.folate);
    const vitaminC = toNullableNumber(nutrients?.vitaminC);
    const sugar = toNullableNumber(nutrients?.sugar);
    const addedSugar = toNullableNumber(nutrients?.addedSugar);
    const caffeine = toNullableNumber(nutrients?.caffeine);
    const alcohol = toNullableNumber(nutrients?.alcohol);

    const items = [];

    if (protein !== null && protein >= 15) {
      items.push({
        type: "positive",
        text: `High protein (${protein}g per serving)`,
      });
    } else if (protein !== null && protein >= 8) {
      items.push({
        type: "positive",
        text: `Good source of protein (${protein}g per serving)`,
      });
    } else if (protein !== null) {
      items.push({
        type: "warning",
        text: `Low protein content (${protein}g per serving)`,
      });
    }

    if (fiber !== null && fiber >= 5) {
      items.push({
        type: "positive",
        text: `High in fiber (${fiber}g)`,
      });
    } else if (fiber !== null && fiber <= 2) {
      items.push({
        type: "warning",
        text: `Low fiber (${fiber}g)`,
      });
    }

    if (sodium !== null && sodium <= 140) {
      items.push({
        type: "positive",
        text: `Low in sodium (${sodium}mg)`,
      });
    } else if (sodium !== null && sodium >= 400) {
      items.push({
        type: "warning",
        text: `High sodium (${sodium}mg)`,
      });
    }

    if (sugar !== null && sugar <= 5) {
      items.push({
        type: "positive",
        text: `Low sugar (${sugar}g)`,
      });
    } else if (sugar !== null && sugar >= 15) {
      items.push({
        type: "warning",
        text: `High sugar (${sugar}g)`,
      });
    }

    if (addedSugar !== null && addedSugar <= 2) {
      items.push({
        type: "positive",
        text: `Low added sugar (${addedSugar}g)`,
      });
    } else if (addedSugar !== null && addedSugar >= 10) {
      items.push({
        type: "warning",
        text: `High added sugar (${addedSugar}g)`,
      });
    }

    if (fat !== null && sugar !== null && fat >= 10 && sugar <= 6) {
      items.push({
        type: "positive",
        text: `Contains healthy fats (${fat}g)`,
      });
    } else if (fat !== null && fat >= 20) {
      items.push({
        type: "warning",
        text: `High in fat (${fat}g)`,
      });
    }

    if (saturatedFat !== null && saturatedFat <= 2) {
      items.push({
        type: "positive",
        text: `Low saturated fat (${saturatedFat}g)`,
      });
    } else if (saturatedFat !== null && saturatedFat >= 5) {
      items.push({
        type: "warning",
        text: `High saturated fat (${saturatedFat}g)`,
      });
    }

    if (cholesterol !== null && cholesterol <= 5) {
      items.push({
        type: "positive",
        text: `Low cholesterol (${cholesterol}mg)`,
      });
    } else if (cholesterol !== null && cholesterol >= 20) {
      items.push({
        type: "warning",
        text: `Higher cholesterol (${cholesterol}mg)`,
      });
    }

    if (calories !== null && calories >= 450) {
      items.push({
        type: "warning",
        text: `High in calories (${calories}) — watch portion size`,
      });
    } else if (calories !== null && calories <= 180) {
      items.push({
        type: "positive",
        text: `Lower-calorie option (${calories} calories)`,
      });
    }

    if (potassium !== null && potassium >= 300) {
      items.push({
        type: "positive",
        text: `Good potassium content (${potassium}mg)`,
      });
    }

    if (calcium !== null && calcium >= 100) {
      items.push({
        type: "positive",
        text: `Useful calcium amount (${calcium}mg)`,
      });
    }

    if (iron !== null && iron >= 2) {
      items.push({
        type: "positive",
        text: `Contains iron (${iron}mg)`,
      });
    }

    if (magnesium !== null && magnesium >= 40) {
      items.push({
        type: "positive",
        text: `Contains magnesium (${magnesium}mg)`,
      });
    }

    if (zinc !== null && zinc >= 1.5) {
      items.push({
        type: "positive",
        text: `Contains zinc (${zinc}mg)`,
      });
    }

    if (vitaminD !== null && vitaminD >= 2) {
      items.push({
        type: "positive",
        text: `Contains vitamin D (${vitaminD}mcg)`,
      });
    }

    if (vitaminB12 !== null && vitaminB12 >= 0.5) {
      items.push({
        type: "positive",
        text: `Contains vitamin B12 (${vitaminB12}mcg)`,
      });
    }

    if (folate !== null && folate >= 80) {
      items.push({
        type: "positive",
        text: `Contains folate (${folate}mcg)`,
      });
    }

    if (vitaminC !== null && vitaminC >= 12) {
      items.push({
        type: "positive",
        text: `Contains vitamin C (${vitaminC}mg)`,
      });
    }

    if (caffeine !== null && caffeine > 0) {
      items.push({
        type: "warning",
        text: `Contains caffeine (${caffeine}mg)`,
      });
    }

    if (alcohol !== null && alcohol > 0) {
      items.push({
        type: "warning",
        text: `Contains alcohol (${alcohol}g)`,
      });
    }

    return items;
  })();

  const positiveInsights = insights.filter(
    (insight) => insight.type === "positive",
  );
  const warningInsights = insights.filter(
    (insight) => insight.type === "warning",
  );
  const MAX_INSIGHTS_PER_COLUMN = 6;

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

  const renderPhotoCollage = () => {
    if (!photos || photos.length === 0) return null;

    const collageHeight = 400; // Fixed height for all collages

    if (photos.length === 1) {
      return (
        <Paper
          elevation={2}
          sx={{
            mb: 3,
            overflow: "hidden",
            position: "relative",
            height: collageHeight,
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

    // Multiple photos - create collage
    return (
      <Paper
        elevation={2}
        sx={{
          mb: 3,
          overflow: "hidden",
          position: "relative",
          height: collageHeight,
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Photo Collage with Overlaid Title */}
      {renderPhotoCollage()}

      {/* Insights */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Insights
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: "action.hover",
                  height: "100%",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "success.main" }}
                >
                  Highlights
                </Typography>
                {positiveInsights.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    -
                  </Typography>
                ) : (
                  positiveInsights
                    .slice(0, MAX_INSIGHTS_PER_COLUMN)
                    .map((insight, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 0.75 }}>
                        • {insight.text}
                      </Typography>
                    ))
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: "action.hover",
                  height: "100%",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "warning.main" }}
                >
                  Watch-outs
                </Typography>
                {warningInsights.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    -
                  </Typography>
                ) : (
                  warningInsights
                    .slice(0, MAX_INSIGHTS_PER_COLUMN)
                    .map((insight, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 0.75 }}>
                        • {insight.text}
                      </Typography>
                    ))
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Serving Size: {servingSize || "-"}
      </Typography>

      {/* Nutrition Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Nutrition Facts
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {NUTRIENT_GROUPS.map((group) => (
              <Grid item xs={12} md={6} key={group.title}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    backgroundColor: "action.hover",
                    height: "100%",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {group.title}
                  </Typography>
                  <Box>
                    {group.fields.map((nutrient, index) => {
                      const value = toNullableNumber(nutrients?.[nutrient.key]);
                      const nutrientColor = getNutrientColor(
                        nutrient.key,
                        value,
                      );

                      return (
                        <Box key={nutrient.key}>
                          <Box
                            sx={{
                              py: 0.75,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 2,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: nutrientColor }}
                            >
                              {nutrient.label}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{ color: nutrientColor, fontWeight: 700 }}
                            >
                              {formatNutrientValue(value, nutrient.unit)}
                            </Typography>
                          </Box>
                          {index < group.fields.length - 1 && <Divider />}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Ingredients
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box component="ol" sx={{ pl: 2 }}>
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                <Typography variant="body1">
                  {ingredient.name} - {ingredient.quantity}
                </Typography>
              </li>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FoodPage;
