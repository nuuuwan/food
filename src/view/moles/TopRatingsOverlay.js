import React from "react";
import { Box, Typography } from "@mui/material";

const TopRatingsOverlay = ({
  warningBadges,
  singaporeGradeScale,
  singaporeNutriGrade,
  novaBadgeColor,
  novaClassNumber,
}) => {
  const activeNutriGrade = singaporeGradeScale.find(
    (item) => item.grade === singaporeNutriGrade,
  );

  const formatOverlayValue = (value, unit) => {
    if (value === null || value === undefined || !Number.isFinite(value)) {
      return `...${unit}/100g`;
    }
    return `${Math.max(0, Math.round(value))}${unit}/100g`;
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        width: { xs: 198, sm: 208 },
        display: "flex",
        gap: 0.5,
        justifyContent: "flex-end",
        alignItems: "stretch",
      }}
    >
      <Box
        sx={{
          flex: 1,
          p: 0.35,
          borderRadius: 1.2,
          backgroundColor: "rgba(255,255,255,0.88)",
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 0.35,
        }}
      >
        {warningBadges.map((item) => (
          <Box
            key={item.key}
            sx={{
              borderRadius: 1,
              border: "1px solid",
              borderColor: "common.black",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                backgroundColor: item.panelColor,
                color: "common.white",
                textAlign: "center",
                py: 0.2,
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, fontSize: "0.54rem", lineHeight: 1 }}
              >
                {item.label}
              </Typography>
            </Box>
            <Box sx={{ p: 0.2, textAlign: "center", bgcolor: "common.white" }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, fontSize: "0.52rem", lineHeight: 1 }}
              >
                {formatOverlayValue(item.value, item.unit)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          width: { xs: 44, sm: 48 },
          p: 0.35,
          borderRadius: 1.2,
          backgroundColor: "rgba(255,255,255,0.88)",
        }}
      >
        <Typography
          sx={{
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1,
            mb: 0.2,
            fontSize: "0.5rem",
          }}
        >
          NUTRI-GRADE
        </Typography>
        <Box
          sx={{
            minHeight: 33,
            borderRadius: 0.5,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "common.white",
            fontWeight: 900,
            fontSize: "1rem",
            lineHeight: 1,
            backgroundColor: activeNutriGrade?.color || "#9e9e9e",
            border: "1px solid",
            borderColor: "common.black",
          }}
        >
          {activeNutriGrade?.grade || "-"}
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: 44, sm: 48 },
          borderRadius: 1.2,
          backgroundColor: "rgba(255,255,255,0.88)",
          p: 0.35,
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            color: "text.secondary",
            fontWeight: 900,
            lineHeight: 1,
            mb: 0.2,
            fontSize: "0.5rem",
          }}
        >
          NOVA
        </Typography>
        <Box
          sx={{
            minHeight: 33,
            borderRadius: 0.5,
            border: "1px solid",
            borderColor: "common.black",
            backgroundColor: novaBadgeColor,
            color: "common.white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {novaClassNumber}
        </Box>
      </Box>
    </Box>
  );
};

export default TopRatingsOverlay;
