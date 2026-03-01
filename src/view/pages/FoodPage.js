import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useData } from "../../nonview/core/DataContext";
import { useFoodPageData } from "../../nonview/core/useFoodPageData";
import { SINGAPORE_GRADE_SCALE } from "../../nonview/core/singaporeNutriGrade";
import PhotoCollage from "../moles/PhotoCollage";
import FoodMetaInfo from "../moles/FoodMetaInfo";
import FoodNutrientCard from "../moles/FoodNutrientCard";

const FoodPage = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const {
    currentFood,
    foodHistory,
    loadFoodById,
    analysisState,
    processingStatus,
    processingSnapshot,
    analysisPreview,
  } = useData();

  const isProcessing = !foodId;
  const statusMessage =
    processingStatus?.detail || processingStatus?.title || null;

  const routeFoodFromHistory = useMemo(
    () =>
      foodId ? foodHistory.find((item) => item.id === foodId) || null : null,
    [foodHistory, foodId],
  );

  useEffect(() => {
    if (!foodId) return;
    if (!currentFood || currentFood.id !== foodId) loadFoodById(foodId);
  }, [foodId, currentFood, loadFoodById]);

  useEffect(() => {
    if (!isProcessing) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isProcessing]);

  useEffect(() => {
    if (!isProcessing) return;
    if (analysisState === "success" && currentFood?.id) {
      navigate(`/item/${currentFood.id}`, { replace: true });
    } else if (analysisState === "error") {
      navigate("/list", { replace: true });
    }
  }, [isProcessing, analysisState, currentFood, navigate]);

  const routeFood =
    currentFood && currentFood.id === foodId
      ? currentFood
      : routeFoodFromHistory;

  const displayFood = routeFood ?? {
    productName: analysisPreview?.productName || null,
    nutrients: null,
    ingredients: [],
    servingSize: analysisPreview?.servingSize || null,
    timestamp: null,
    photos: [],
  };

  const {
    calorieSegments,
    totalCalories,
    totalMacroCalories,
    effectiveServingSizeGrams,
    singaporeNutriGrade,
    singaporeNutriGradeReason,
    novaClass,
    novaClassReason,
    novaSpecificItemText,
    novaClassNumber,
    novaBadgeColor,
    warningBadges,
    sortedVisibleVitaminFields,
    sortedVisibleMineralFields,
    ingredientListText,
  } = useFoodPageData(displayFood);

  const { productName, nutrients, servingSize, timestamp, photos } =
    displayFood;

  if (!isProcessing && !routeFood) {
    return (
      <Container
        maxWidth="md"
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">Loading...</Typography>
      </Container>
    );
  }

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
        <PhotoCollage
          photos={photos}
          productName={productName}
          timestamp={timestamp}
          warningBadges={warningBadges}
          singaporeNutriGrade={singaporeNutriGrade}
          singaporeGradeScale={SINGAPORE_GRADE_SCALE}
          novaBadgeColor={novaBadgeColor}
          novaClassNumber={novaClassNumber}
          previewImageUri={
            isProcessing ? processingSnapshot?.previewImage : undefined
          }
          statusMessage={isProcessing ? statusMessage : undefined}
        />
      </Box>

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <FoodMetaInfo
          ingredientListText={ingredientListText}
          servingSize={servingSize}
          effectiveServingSizeGrams={effectiveServingSizeGrams}
          isProcessing={isProcessing}
        />

        <FoodNutrientCard
          nutrients={nutrients}
          calorieSegments={calorieSegments}
          totalCalories={totalCalories}
          totalMacroCalories={totalMacroCalories}
          sortedVisibleVitaminFields={sortedVisibleVitaminFields}
          sortedVisibleMineralFields={sortedVisibleMineralFields}
          singaporeNutriGrade={singaporeNutriGrade}
          singaporeNutriGradeReason={singaporeNutriGradeReason}
          novaClass={novaClass}
          novaClassReason={novaClassReason}
          novaSpecificItemText={novaSpecificItemText}
          warningBadges={warningBadges}
          isProcessing={isProcessing}
          statusMessage={statusMessage}
        />
      </Container>
    </>
  );
};

export default FoodPage;
