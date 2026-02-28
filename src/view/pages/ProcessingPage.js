import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/core/DataContext";
import { Box, Typography, Container, Card, CardContent, Paper } from "@mui/material";

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
  const resolvedName = resolvedFood?.productName || analysisPreview?.productName || "";
  const resolvedIngredients = Array.isArray(resolvedFood?.ingredients)
    ? resolvedFood.ingredients
    : [];
  const resolvedClassifications = resolvedFood?.classifications || null;
  const resolvedNutrients = resolvedFood?.nutrients || null;

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
      {previewImage && (
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
            }}
          >
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
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.9)" }}
              >
                {analysisState === "success"
                  ? "Analysis ready"
                  : "Analyzing image..."}
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}

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
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                {resolvedIngredients.length > 0
                  ? resolvedIngredients
                      .map((ingredient) => {
                        const name = String(ingredient?.name || "").trim();
                        const quantity = String(ingredient?.quantity || "").trim();
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
                Nutri-Grade: {resolvedClassifications?.singaporeNutriGrade || "..."}
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
                Protein: {resolvedNutrients?.protein ?? "..."} g • Carbs: {resolvedNutrients?.carbs ?? "..."} g • Fat: {resolvedNutrients?.fat ?? "..."} g
              </Typography>
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
