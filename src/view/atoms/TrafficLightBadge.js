import React from "react";
import { Box, Typography } from "@mui/material";

const LABEL_SX = {
  fontSize: "0.44rem",
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "rgba(0,0,0,0.5)",
  lineHeight: 1,
  mb: 0.3,
  textAlign: "center",
};

const formatValue = (value, unit) => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return `\u2026${unit}`;
  }
  return `${Math.max(0, Math.round(value))}${unit}`;
};

const TrafficLightBadge = ({ warningBadges }) => (
  <Box
    sx={{
      display: "flex",
      gap: 0.4,
      alignItems: "stretch",
    }}
  >
    {warningBadges.map((item) => (
      <Box
        key={item.key}
        sx={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <Typography sx={LABEL_SX}>{item.label}</Typography>
        <Box
          sx={{
            borderRadius: 1,
            backgroundColor: item.panelColor,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            minHeight: 32,
            minWidth: 36,
            px: 0.3,
            py: 0.4,
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontWeight: 800,
              fontSize: "0.62rem",
              lineHeight: 1,
            }}
          >
            {formatValue(item.value, item.unit)}
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontWeight: 600,
              fontSize: "0.38rem",
              lineHeight: 1,
              mt: 0.25,
            }}
          >
            per 100g
          </Typography>
        </Box>
      </Box>
    ))}
  </Box>
);

export default TrafficLightBadge;
