import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/core/DataContext";
import { Box, Button, Typography, Container, Paper } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const CameraPage = () => {
  const navigate = useNavigate();
  const { startScan } = useData();

  const handleScan = () => {
    // For M0, we'll just simulate scanning with dummy data
    startScan("dummy-image-data");
    navigate("/processing");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h3" gutterBottom>
          Food Label Scanner
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Scan nutrition labels to get instant AI-powered insights
        </Typography>

        <Paper
          elevation={3}
          sx={{
            height: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            mb: 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CameraAltIcon
              sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              Camera Preview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (M0: Static Prototype)
            </Typography>
          </Box>

          {/* Scan Overlay Simulation */}
          <Box
            sx={{
              position: "absolute",
              width: "80%",
              height: "60%",
              border: "3px solid",
              borderColor: "primary.main",
              borderRadius: 2,
              opacity: 0.5,
            }}
          />
        </Paper>

        <Button
          variant="contained"
          size="large"
          startIcon={<CameraAltIcon />}
          onClick={handleScan}
          sx={{ px: 6, py: 1.5 }}
        >
          Scan Label
        </Button>
      </Box>
    </Container>
  );
};

export default CameraPage;
