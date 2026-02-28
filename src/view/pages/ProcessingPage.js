import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/core/DataContext";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import ProcessingStepList, {
  getCurrentStepIndex,
} from "../moles/ProcessingStepList";
import ProcessingPreviewCard from "../atoms/ProcessingPreviewCard";
import InterimAnalysisCard from "../atoms/InterimAnalysisCard";

const ProcessingPage = () => {
  const navigate = useNavigate();
  const {
    currentFood,
    currentScan,
    analysisState,
    processingStatus,
    processingSnapshot,
    analysisPreview,
  } = useData();
  const isLocalCacheHit = processingStatus.title === "Cached local";
  const statusMessage = processingStatus.detail || processingStatus.title;
  const currentStepIndex = getCurrentStepIndex(processingStatus.title);
  const totalProgressSteps = 6;
  const progressValue =
    analysisState === "success"
      ? 100
      : Math.max(
          8,
          Math.round(((currentStepIndex + 1) / totalProgressSteps) * 100),
        );

  useEffect(() => {
    if (analysisState === "success" && currentFood?.id) {
      const timer = setTimeout(() => {
        navigate(`/item/${currentFood.id}`);
      }, 2200);

      return () => clearTimeout(timer);
    }

    if (analysisState === "error") {
      // Handle error - for now just go back to list
      console.error("Analysis failed");
      navigate("/list");
    }
  }, [analysisState, currentFood, navigate]);

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
        {analysisState !== "success" && (
          <CircularProgress size={80} sx={{ mb: 4 }} />
        )}
        <Typography variant="h4" gutterBottom>
          {analysisState === "success"
            ? "Analysis Ready"
            : "Analyzing Photo..."}
        </Typography>
        <Box sx={{ width: "100%", maxWidth: 420, mb: 3 }}>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{ height: 8, borderRadius: 999 }}
          />
        </Box>
        <ProcessingStepList
          currentStepIndex={currentStepIndex}
          analysisState={analysisState}
          isLocalCacheHit={isLocalCacheHit}
        />
        <ProcessingPreviewCard
          imageUri={processingSnapshot?.previewImage || currentScan}
        />
        <InterimAnalysisCard preview={analysisPreview} />
        <Typography variant="body1" color="text.secondary">
          {statusMessage || "Working..."}
        </Typography>
      </Box>
    </Container>
  );
};

export default ProcessingPage;
