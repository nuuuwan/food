import React from "react";
import { Box, Typography } from "@mui/material";

const NutriGradeBadge = ({ singaporeGradeScale, singaporeNutriGrade }) => {
  const activeGrade = singaporeGradeScale.find(
    (item) => item.grade === singaporeNutriGrade,
  );

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}
    >
      <Typography
        sx={{
          fontSize: "0.44rem",
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
          borderRadius: 1,
          backgroundColor: activeGrade?.color || "#9e9e9e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          minHeight: 32,
          minWidth: 32,
          px: 0.5,
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontWeight: 900,
            fontSize: "1rem",
            lineHeight: 1,
          }}
        >
          {activeGrade?.grade || "-"}
        </Typography>
      </Box>
    </Box>
  );
};

export default NutriGradeBadge;
