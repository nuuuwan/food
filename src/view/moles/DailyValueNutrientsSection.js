import React from "react";
import { Paper, Grid, Typography } from "@mui/material";
import DailyValueTile from "../atoms/DailyValueTile";
import {
  toNullableNumber,
  convertUnit,
  getDailyValuePercent,
} from "../../nonview/core/nutritionUtils";
import { DAILY_VALUE_FIELDS } from "../../nonview/core/nutritionConstants";

const DailyValueNutrientsSection = ({ nutrients }) => (
  <Paper
    elevation={1}
    sx={{
      mb: 3,
      p: { xs: 1.75, sm: 2.25 },
      borderRadius: 2,
      backgroundColor: "background.default",
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
            <DailyValueTile
              label={item.label}
              value={displayValue}
              unit={item.displayUnit}
              percentDV={percent}
            />
          </Grid>
        );
      })}
    </Grid>
  </Paper>
);

export default DailyValueNutrientsSection;
