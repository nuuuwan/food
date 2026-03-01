import React from "react";
import { Box, Typography } from "@mui/material";

const NutriGradeBadge = ({ singaporeGradeScale, singaporeNutriGrade }) => {
  const activeGrade = singaporeGradeScale.find(
    (item) => item.grade === singaporeNutriGrade,
  );

  return (
    <Box
      sx={{
        height: 48,
        width: 48,
      }}
    >
      <Typography
        sx={{
          fontSize: "0.4rem",
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.5)",
          lineHeight: 1,
          mb: 0.3,
          textAlign: "center",
        }}
      >
        Nutri-Grade
      </Typography>
      <Box
        sx={{
          borderRadius: 40,
          backgroundColor: activeGrade?.color || "#9e9e9e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          width: 24,
          height: 24,
          margin: "auto",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontWeight: 900,
            fontSize: "1rem",
          }}
        >
          {activeGrade?.grade || "-"}
        </Typography>
      </Box>
    </Box>
  );
};

export default NutriGradeBadge;
