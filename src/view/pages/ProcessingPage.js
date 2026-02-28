import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/core/DataContext";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  LinearProgress,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SkipNextIcon from "@mui/icons-material/SkipNext";

const PROCESS_STEPS = [
  { key: "Preparing image", label: "Image prepared" },
  { key: "Checking cache", label: "Cache checked" },
  { key: "Uploading", label: "Image uploaded" },
  { key: "Analyzing", label: "Analysis complete" },
  { key: "Reviewing result", label: "Interim result ready" },
  { key: "Done", label: "Results ready" },
  { key: "Cached local", label: "Results ready" },
  { key: "Cached remote", label: "Results ready" },
];

const getCurrentStepIndex = (title) => {
  const normalizedTitle = title || "";

  if (
    normalizedTitle === "Cached local" ||
    normalizedTitle === "Cached remote"
  ) {
    return 5;
  }

  if (normalizedTitle === "Done") {
    return 5;
  }

  if (normalizedTitle === "Reviewing result") {
    return 4;
  }

  if (normalizedTitle === "Analyzing") {
    return 3;
  }

  if (normalizedTitle === "Uploading") {
    return 2;
  }

  if (normalizedTitle === "Checking cache") {
    return 1;
  }

  if (normalizedTitle === "Preparing image") {
    return 0;
  }

  return 0;
};

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
        <Box sx={{ width: "100%", maxWidth: 420, textAlign: "left", mb: 2 }}>
          {PROCESS_STEPS.slice(0, totalProgressSteps).map((step, index) => {
            const isComplete =
              currentStepIndex > index || analysisState === "success";
            const isActive =
              currentStepIndex === index && analysisState !== "success";
            const isSkipped =
              isLocalCacheHit &&
              (step.label === "Image uploaded" ||
                step.label === "Analysis complete");

            return (
              <Box
                key={step.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 0.5,
                  color: isSkipped
                    ? "warning.main"
                    : isComplete
                      ? "success.main"
                      : isActive
                        ? "text.primary"
                        : "text.secondary",
                }}
              >
                {isSkipped ? (
                  <SkipNextIcon fontSize="small" />
                ) : isComplete ? (
                  <CheckCircleIcon fontSize="small" />
                ) : (
                  <RadioButtonUncheckedIcon fontSize="small" />
                )}
                <Typography variant="body2">{step.label}</Typography>
              </Box>
            );
          })}
        </Box>
        {(processingSnapshot?.previewImage || currentScan) && (
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 420,
              p: 1,
              mb: 2,
              bgcolor: "action.hover",
            }}
          >
            <Box
              component="img"
              src={processingSnapshot?.previewImage || currentScan}
              alt="Processing preview"
              sx={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.75 }}
            >
              Optimized preview used for upload and analysis
            </Typography>
          </Paper>
        )}
        {analysisPreview && (
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 420,
              p: 1.25,
              mb: 2,
              bgcolor: "action.hover",
              textAlign: "left",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Interim analysis
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {analysisPreview.productName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              Calories: {analysisPreview.calories ?? "-"} kcal
              {analysisPreview.servingSize
                ? ` • Serving: ${analysisPreview.servingSize}`
                : ""}
            </Typography>
          </Paper>
        )}
        <Typography variant="body1" color="text.secondary">
          {statusMessage || "Working..."}
        </Typography>
      </Box>
    </Container>
  );
};

export default ProcessingPage;
