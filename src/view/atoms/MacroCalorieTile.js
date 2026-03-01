import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  formatNumber,
  getDailyValuePercent,
} from "../../nonview/core/nutritionUtils";

const MacroCalorieTile = ({ segment, totalMacroCalories }) => {
  const pct =
    totalMacroCalories > 0 ? (segment.calories / totalMacroCalories) * 100 : 0;
  const gramsDvPct = getDailyValuePercent(
    segment.grams,
    segment.gramsUnit,
    segment.dailyValue,
    segment.dailyValueUnit,
  );

  return (
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
        {formatNumber(segment.calories, 0)} kcal ({formatNumber(pct, 0)}%)
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {formatNumber(segment.grams, 0)} {segment.gramsUnit}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {gramsDvPct === null ? "-" : `${formatNumber(gramsDvPct, 0)}% DV`}
      </Typography>
    </Box>
  );
};

export default MacroCalorieTile;
