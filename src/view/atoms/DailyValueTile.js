import React from "react";
import { Box, Typography } from "@mui/material";
import { formatNumber } from "../../nonview/core/nutritionUtils";

const DailyValueTile = ({
  label,
  alternativeName,
  value,
  unit,
  percentDV,
  showSymbolAsLabel,
}) => (
  <Box
    sx={{
      p: 1,
      borderRadius: 1.5,
      backgroundColor: "action.hover",
      minHeight: 96,
      aspectRatio: "1 / 1",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "100%",
      maxWidth: 140,
      mx: "auto",
    }}
  >
    <Box>
      <Typography
        variant="body2"
        sx={{ fontWeight: showSymbolAsLabel ? 700 : 600 }}
      >
        {showSymbolAsLabel ? alternativeName || label : label}
      </Typography>
      {!showSymbolAsLabel && alternativeName && (
        <Typography variant="caption" color="text.secondary">
          {alternativeName}
        </Typography>
      )}
      {showSymbolAsLabel && (
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      )}
      <Typography variant="body2">
        {formatNumber(value, 0)} {unit}
      </Typography>
    </Box>
    <Typography
      variant="body2"
      sx={{ fontWeight: 600, color: "text.secondary", mt: 0.5 }}
    >
      {percentDV === null ? "-" : `${formatNumber(percentDV, 0)}% DV`}
    </Typography>
  </Box>
);

export default DailyValueTile;
