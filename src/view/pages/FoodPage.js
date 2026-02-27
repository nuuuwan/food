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
    title: "Energy",
    fields: [{ key: "calories", label: "Calories", unit: "" }],
  },
  {
    title: "Carbohydrates",
    fields: [
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
    title: "Electrolytes",
    fields: [
      { key: "sodium", label: "Sodium", unit: "mg" },
      { key: "potassium", label: "Potassium", unit: "mg" },
    ],
  },
  {
    title: "Minerals",
    fields: [
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

    // Multiple photos - create collage
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
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Serving Size: {servingSize || "-"}
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Nutrition Facts
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Values per serving
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {NUTRIENT_GROUPS.map((group) => (
                <Grid item xs={12} sm={6} lg={4} key={group.title}>
                  <Box
                    sx={{
                      p: { xs: 1.75, sm: 2.25 },
                      borderRadius: 2,
                      backgroundColor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                      height: "100%",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 1.25, fontWeight: 700 }}>
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
                                py: { xs: 0.75, sm: 1 },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ color: nutrientColor, fontSize: { xs: "0.9rem", sm: "1rem" } }}
                              >
                                {nutrient.label}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                sx={{ color: nutrientColor, fontWeight: 700, whiteSpace: "nowrap" }}
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
    </>
  );
};

export default FoodPage;
