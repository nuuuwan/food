import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { formatNumber } from "../../nonview/core/nutritionUtils";

const DailyValueTile = ({
  label,
  alternativeName,
  value,
  unit,
  percentDV,
  showSymbolAsLabel,
  color,
  extraInfo,
}) => (
  <Box
    sx={{
      p: 1,
      borderRadius: 1.5,
      backgroundColor: color ? alpha(color, 0.1) : "action.hover",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: showSymbolAsLabel ? 700 : 600,
          color: color || "inherit",
        }}
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
      {extraInfo && (
        <Typography variant="body2" color="text.secondary">
          {extraInfo}
        </Typography>
      )}
    </Box>
    <Typography
      variant="body1"
      sx={{ fontWeight: 600, color: color || "text.secondary", mt: 0.5 }}
    >
      {percentDV === null ? "-" : `${formatNumber(percentDV, 0)}% DV`}
    </Typography>
  </Box>
);

export default DailyValueTile;
