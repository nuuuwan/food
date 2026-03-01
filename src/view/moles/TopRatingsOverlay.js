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
      gap: 0.1,
      alignItems: "stretch",
      backgroundColor: "rgba(255,255,255,0.5)",
      backdropFilter: "blur(8px)",
      borderRadius: 2,
      p: 1,
    }}
  >
    <TrafficLightBadge warningBadges={warningBadges} />

    <NutriGradeBadge
      singaporeGradeScale={singaporeGradeScale}
      singaporeNutriGrade={singaporeNutriGrade}
    />

    <NovaBadge
      novaBadgeColor={novaBadgeColor}
      novaClassNumber={novaClassNumber}
    />
  </Box>
);

export default TopRatingsOverlay;
