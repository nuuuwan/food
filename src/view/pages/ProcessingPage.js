import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/core/DataContext";
import { Box, Typography, Container, CircularProgress } from "@mui/material";

const ProcessingPage = () => {
  const navigate = useNavigate();
  const { currentFood, completeAnalysis } = useData();

  useEffect(() => {
    // Simulate AI processing delay
    const timer = setTimeout(() => {
      // For M0, we use the dummy data that's already in DataContext
      completeAnalysis(currentFood);
      navigate(`/food/${currentFood.id}`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, currentFood, completeAnalysis]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <CircularProgress size={80} sx={{ mb: 4 }} />
        <Typography variant="h4" gutterBottom>
          Analyzing Label...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI is processing your nutrition label
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          This usually takes 2-3 seconds
        </Typography>
      </Box>
    </Container>
  );
};

export default ProcessingPage;
