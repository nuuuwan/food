import React from "react";
import { Box, Typography } from "@mui/material";

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
      gap: 0.25,
    }}
  >
    {warningBadges.map((item) => (
      <Box
        key={item.key}
        sx={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <Box
          sx={{
            borderRadius: 1,
            backgroundColor: item.panelColor,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            p: 0.5,
            width: 48,
            height: 48,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.5rem",
              letterSpacing: "0.04em",
              color: "white",
              lineHeight: 1,
              mb: 0.3,
              textAlign: "center",
            }}
          >
            {item.label}
          </Typography>
          <Box
            sx={{
              borderRadius: 1,
              backgroundColor: "white",
              color: "black",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              p: 0.25,
              width: 40,
              height: 40,
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "0.62rem",
                lineHeight: 1,
              }}
            >
              {formatValue(item.value, item.unit)}
            </Typography>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.38rem",
                lineHeight: 1,
                mt: 0.25,
                opacity: 0.5,
              }}
            >
              per 100g
            </Typography>
          </Box>
        </Box>
      </Box>
    ))}
  </Box>
);

export default TrafficLightBadge;
