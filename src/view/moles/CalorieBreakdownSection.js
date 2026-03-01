import React from "react";
import { Box, Paper, Grid, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import DailyValueTile from "../atoms/DailyValueTile";
import {
  formatNumber,
  getDailyValuePercent,
} from "../../nonview/core/nutritionUtils";

const CalorieBreakdownSection = ({
  calorieSegments,
  totalCalories,
  totalMacroCalories,
}) => (
  <Paper
    elevation={0}
    sx={{
      mb: 3,
      p: { xs: 1.75, sm: 2.25 },
      borderRadius: 2,
      backgroundColor: "background.default",
    }}
  >
    <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 600 }}>
      Calorie Breakdown
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
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
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
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
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
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
            <DailyValueTile
              label={segment.label}
              value={segment.grams}
              unit={segment.gramsUnit}
              percentDV={gramsDvPct}
              color={segment.color}
              extraInfo={`${formatNumber(segment.calories, 0)} kcal · ${formatNumber(pct, 0)}%`}
            />
          </Grid>
        );
      })}
    </Grid>
  </Paper>
);

export default CalorieBreakdownSection;
