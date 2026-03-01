import React from "react";
import { Box, Typography } from "@mui/material";

const NovaBadge = ({ novaBadgeColor, novaClassNumber }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
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
      NOVA
    </Typography>
    <Box
      sx={{
        borderRadius: 1,
        backgroundColor: novaBadgeColor,
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
        {novaClassNumber}
      </Typography>
    </Box>
  </Box>
);

export default NovaBadge;
