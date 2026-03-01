import React from "react";
import { Box } from "@mui/material";
import TrafficLightBadge from "../atoms/TrafficLightBadge";
import NutriGradeBadge from "../atoms/NutriGradeBadge";
import NovaBadge from "../atoms/NovaBadge";

const TopRatingsOverlay = ({
  warningBadges,
  singaporeGradeScale,
  singaporeNutriGrade,
  novaBadgeColor,
  novaClassNumber,
}) => (
  <Box
    sx={{
      position: "absolute",
      top: 8,
      right: 8,
      display: "flex",
      gap: 0.5,
      alignItems: "stretch",
      backgroundColor: "rgba(255,255,255,0.90)",
      backdropFilter: "blur(8px)",
      borderRadius: 1.5,
      p: 0.6,
    }}
  >
    <TrafficLightBadge warningBadges={warningBadges} />

    <Box
      sx={{
        width: 1,
        bgcolor: "rgba(0,0,0,0.1)",
        alignSelf: "stretch",
        mx: 0.2,
        borderRadius: 4,
      }}
    />

    <NutriGradeBadge
      singaporeGradeScale={singaporeGradeScale}
      singaporeNutriGrade={singaporeNutriGrade}
    />

    <Box
      sx={{
        width: 1,
        bgcolor: "rgba(0,0,0,0.1)",
        alignSelf: "stretch",
        mx: 0.2,
        borderRadius: 4,
      }}
    />

    <NovaBadge
      novaBadgeColor={novaBadgeColor}
      novaClassNumber={novaClassNumber}
    />
  </Box>
);

export default TopRatingsOverlay;
