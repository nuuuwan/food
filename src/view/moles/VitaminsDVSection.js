import React from "react";
import { Paper, Grid, Typography } from "@mui/material";
import DailyValueTile from "../atoms/DailyValueTile";
import {
  toNullableNumber,
  getDailyValuePercent,
} from "../../nonview/core/nutritionUtils";

const VitaminsDVSection = ({ nutrients, sortedVisibleVitaminFields }) => (
  <Paper
    elevation={0}
    sx={{
      mb: 3,
      p: { xs: 1.75, sm: 2.25 },
      borderRadius: 2,
      backgroundColor: "background.default",
    }}
  >
    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
      Vitamins (Daily Values)
    </Typography>
    {sortedVisibleVitaminFields.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        No vitamin daily values are available for this item.
      </Typography>
    ) : (
      <Grid container spacing={1}>
        {sortedVisibleVitaminFields.map((item) => {
          const rawValue = toNullableNumber(nutrients?.[item.key]);
          const percent = getDailyValuePercent(
            rawValue,
            item.sourceUnit,
            item.dailyValue,
            item.dailyValueUnit,
          );

          return (
            <Grid item xs={12} sm={6} md={4} key={item.key}>
              <DailyValueTile
                label={item.label}
                alternativeName={item.alternativeName}
                value={rawValue}
                unit={item.sourceUnit}
                percentDV={percent}
              />
            </Grid>
          );
        })}
      </Grid>
    )}
  </Paper>
);

export default VitaminsDVSection;
