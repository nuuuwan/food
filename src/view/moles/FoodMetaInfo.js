import React from "react";
import { Typography } from "@mui/material";
import { formatNumber } from "../../nonview/core/nutritionUtils";

const fadeSx = (isProcessing, ready) => ({
  opacity: isProcessing && !ready ? 0.35 : 1,
  transition: "opacity 260ms ease",
});

const FoodMetaInfo = ({
  ingredientListText,
  servingSize,
  effectiveServingSizeGrams,
  isProcessing,
}) => (
  <>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        mb: 2.5,
        fontStyle: "italic",
        ...fadeSx(isProcessing, Boolean(ingredientListText)),
      }}
    >
      {ingredientListText ||
        (isProcessing ? "Building ingredient list..." : "-")}
    </Typography>

    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        mb: 2,
        ...fadeSx(
          isProcessing,
          Boolean(servingSize || effectiveServingSizeGrams),
        ),
      }}
    >
      Serving Size: {servingSize || "-"}
      {effectiveServingSizeGrams != null
        ? ` • ${formatNumber(effectiveServingSizeGrams, 1)} g`
        : ""}
    </Typography>
  </>
);

export default FoodMetaInfo;
