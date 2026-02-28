import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/core/DataContext";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Paper,
} from "@mui/material";

const ProcessingPage = () => {
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
  const resolvedName =
    resolvedFood?.productName || analysisPreview?.productName || "";
  const resolvedIngredients = Array.isArray(resolvedFood?.ingredients)
    ? resolvedFood.ingredients
    : [];
  const resolvedClassifications = resolvedFood?.classifications || null;
  const resolvedNutrients = resolvedFood?.nutrients || null;

  const toNullableNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
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

  const servingSizeGrams = getServingSizeGrams(
    resolvedFood?.servingSize || analysisPreview?.servingSize,
  );
  const protein = toNullableNumber(resolvedNutrients?.protein) || 0;
  const fat = toNullableNumber(resolvedNutrients?.fat) || 0;
  const carbs = toNullableNumber(resolvedNutrients?.carbs) || 0;
  const nutrientMassLowerBound = protein + fat + carbs;
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

  const sugarPer100g = toPer100g(toNullableNumber(resolvedNutrients?.sugar));
  const sodiumMg = toNullableNumber(resolvedNutrients?.sodium);
  const saltGrams =
    sodiumMg === null || sodiumMg === undefined
      ? null
      : (sodiumMg / 1000) * 2.5;
  const saltPer100g = toPer100g(saltGrams);
  const fatPer100g = toPer100g(toNullableNumber(resolvedNutrients?.fat));

  const getTrafficLightPanelColor = (key, valuePer100g) => {
    if (valuePer100g === null || valuePer100g === undefined) {
      return "#9e9e9e";
    }

    if (key === "sugar") {
      if (valuePer100g > 22) {
        return "#c62828";
      }
      if (valuePer100g >= 5) {
        return "#f9a825";
      }
      return "#2e7d32";
    }

    if (key === "salt") {
      if (valuePer100g > 1.25) {
        return "#c62828";
      }
      if (valuePer100g >= 0.25) {
        return "#f9a825";
      }
      return "#2e7d32";
    }

    if (key === "fat") {
      if (valuePer100g > 17.5) {
        return "#c62828";
      }
      if (valuePer100g >= 3) {
        return "#f9a825";
      }
      return "#2e7d32";
    }

    return "#9e9e9e";
  };

  const formatNutrientValue = (value, unit) => {
    if (value === null || value === undefined || !Number.isFinite(value)) {
      return `...${unit}/100g`;
    }
    return `${Math.max(0, Math.round(value))}${unit}/100g`;
  };

  const trafficFigures = [
    {
      key: "sugar",
      label: "Sugar",
      value: sugarPer100g,
      unit: "g",
      color: getTrafficLightPanelColor("sugar", sugarPer100g),
    },
    {
      key: "salt",
      label: "Salt",
      value:
        saltPer100g === null || saltPer100g === undefined
          ? null
          : saltPer100g * 1000,
      unit: "mg",
      color: getTrafficLightPanelColor("salt", saltPer100g),
    },
    {
      key: "fat",
      label: "Fat",
      value: fatPer100g,
      unit: "g",
      color: getTrafficLightPanelColor("fat", fatPer100g),
    },
  ];

  const singaporeNutriGrade =
    resolvedClassifications?.singaporeNutriGrade || "-";
  const singaporeGradeScale = [
    { grade: "A", color: "#1f8b43" },
    { grade: "B", color: "#8abf2f" },
    { grade: "C", color: "#f0a128" },
    { grade: "D", color: "#c71c22" },
  ];

  const novaClassCode = resolvedClassifications?.novaClassCode || "-";
  const novaClassNumber = (novaClassCode.match(/(\d+)/) || [])[1] || "-";
  const novaBadgeColor =
    {
      1: "#38b000",
      2: "#8abf2f",
      3: "#f0a128",
      4: "#c71c22",
    }[novaClassNumber] || "#9e9e9e";

  const getSectionSx = (isAvailable) => ({
    opacity: isAvailable ? 1 : 0.3,
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
      // Handle error - for now just go back to list
      console.error("Analysis failed");
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
          mb: 2.5,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            overflow: "hidden",
            position: "relative",
            height: { xs: 260, sm: 340, md: 400 },
            borderRadius: 0,
            bgcolor: "grey.200",
          }}
        >
          {previewImage ? (
            <Box
              component="img"
              src={previewImage}
              alt="Processing preview"
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
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 0,
              right: 0,
              px: 1,
              display: "flex",
              gap: 1,
              justifyContent: "center",
              alignItems: "stretch",
              overflowX: "auto",
            }}
          >
            <Box
              sx={{
                minWidth: 210,
                p: 0.6,
                borderRadius: 1.5,
                backgroundColor: "rgba(255,255,255,0.88)",
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 0.5,
              }}
            >
              {trafficFigures.map((item) => (
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
                      backgroundColor: item.color,
                      color: "common.white",
                      textAlign: "center",
                      py: 0.35,
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {item.label}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 0.35,
                      textAlign: "center",
                      bgcolor: "common.white",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {formatNutrientValue(item.value, item.unit)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                minWidth: 170,
                p: 0.6,
                borderRadius: 1.5,
                backgroundColor: "rgba(255,255,255,0.88)",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 900,
                  textAlign: "center",
                  lineHeight: 1,
                  mb: 0.35,
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
                      py: 0.45,
                      textAlign: "center",
                      color: "common.white",
                      backgroundColor: gradeItem.color,
                      fontWeight:
                        singaporeNutriGrade === gradeItem.grade ? 900 : 500,
                      outline:
                        singaporeNutriGrade === gradeItem.grade
                          ? "2px solid #000"
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
                minWidth: 82,
                borderRadius: 1.5,
                backgroundColor: "rgba(255,255,255,0.88)",
                p: 0.45,
              }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  color: "text.secondary",
                  fontWeight: 900,
                  lineHeight: 1,
                  mb: 0.2,
                }}
              >
                NOVA
              </Typography>
              <Box
                sx={{
                  minHeight: 52,
                  borderRadius: 0.7,
                  backgroundColor: novaBadgeColor,
                  color: "common.white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                {novaClassNumber}
              </Box>
            </Box>
          </Box>

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
              sx={{ color: "common.white", fontWeight: 700 }}
            >
              {analysisPreview?.productName || "Building result..."}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
              {analysisState === "success"
                ? "Analysis ready"
                : "Analyzing image..."}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ mb: 2.25, ...getSectionSx(Boolean(resolvedName)) }}>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                {resolvedName || "Building item name..."}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {analysisPreview?.servingSize
                  ? `Serving Size: ${analysisPreview.servingSize}`
                  : "Serving size pending..."}
              </Typography>
            </Box>

            <Box
              sx={{
                mb: 2,
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
                ...getSectionSx(resolvedIngredients.length > 0),
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 0.8, fontWeight: 600 }}>
                Ingredients
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                {resolvedIngredients.length > 0
                  ? resolvedIngredients
                      .map((ingredient) => {
                        const name = String(ingredient?.name || "").trim();
                        const quantity = String(
                          ingredient?.quantity || "",
                        ).trim();
                        if (!name) {
                          return "";
                        }
                        if (!quantity || quantity.toLowerCase() === "unknown") {
                          return name;
                        }
                        return `${name} (${quantity})`;
                      })
                      .filter(Boolean)
                      .join(", ")
                  : "Building ingredient list..."}
              </Typography>
            </Box>

            <Box
              sx={{
                mb: 2,
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
                ...getSectionSx(Boolean(resolvedClassifications)),
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 0.8, fontWeight: 600 }}>
                Ratings / Classifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nutri-Grade:{" "}
                {resolvedClassifications?.singaporeNutriGrade || "..."}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                NOVA: {resolvedClassifications?.novaClassCode || "..."}
              </Typography>
            </Box>

            <Box
              sx={{
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
                ...getSectionSx(Boolean(resolvedNutrients)),
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 0.8, fontWeight: 600 }}>
                Nutrition Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calories: {resolvedNutrients?.calories ?? "..."} kcal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Protein: {resolvedNutrients?.protein ?? "..."} g • Carbs:{" "}
                {resolvedNutrients?.carbs ?? "..."} g • Fat:{" "}
                {resolvedNutrients?.fat ?? "..."} g
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 2,
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
                ...getSectionSx(
                  Boolean(resolvedClassifications || resolvedNutrients),
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
                Sri Lanka Traffic Light: Based on estimated sugar, salt, and fat
                per 100g.
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.35 }}
              >
                Singapore Nutri-Grade:{" "}
                {resolvedClassifications?.singaporeNutriGradeReason ||
                  "Reason pending..."}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                NOVA:{" "}
                {resolvedClassifications?.novaClassReason ||
                  "Reason pending..."}
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 700 }}>
                References
              </Typography>
              <Box component="ul" sx={{ mt: 0, mb: 0, pl: 2.25 }}>
                <li>
                  <Typography variant="caption" color="text.secondary">
                    <a
                      href="https://www.hpb.gov.sg/healthy-living/food-beverage/nutri-grade"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Singapore HPB: Nutri-Grade
                    </a>
                  </Typography>
                </li>
                <li>
                  <Typography variant="caption" color="text.secondary">
                    <a
                      href="https://world.openfoodfacts.org/nova"
                      target="_blank"
                      rel="noreferrer"
                    >
                      NOVA food processing classification overview
                    </a>
                  </Typography>
                </li>
                <li>
                  <Typography variant="caption" color="text.secondary">
                    <a
                      href="https://www.google.com/search?q=Sri+Lanka+Food+Color+Coding+for+Sugar+Salt+and+Fat+Regulations+2019"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Sri Lanka Food color coding regulations (sugar/salt/fat)
                    </a>
                  </Typography>
                </li>
              </Box>
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
