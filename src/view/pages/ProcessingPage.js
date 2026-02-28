import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/core/DataContext";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  LinearProgress,
  Card,
  CardContent,
  Paper,
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
  const previewImage = processingSnapshot?.previewImage || currentScan;
  const stageIndex =
    analysisState === "success" ? totalProgressSteps : currentStepIndex;
  const getStageSx = (threshold) => ({
    opacity: stageIndex >= threshold ? 1 : 0.32,
    transition: "opacity 260ms ease",
  });

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
    <>
      {previewImage && (
        <Box
          sx={{
            width: "100vw",
            ml: "calc(50% - 50vw)",
            mr: "calc(50% - 50vw)",
            mt: 0,
            mb: 2.5,
          }}
        >
          <Paper
            elevation={2}
            sx={{
              overflow: "hidden",
              position: "relative",
              height: { xs: 260, sm: 340, md: 400 },
              borderRadius: 0,
            }}
          >
            <Box
              component="img"
              src={previewImage}
              alt="Processing preview"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
                p: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: "common.white", fontWeight: 700 }}
              >
                {analysisPreview?.productName || "Building result..."}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.9)" }}
              >
                {analysisState === "success"
                  ? "Analysis ready"
                  : "Analyzing image..."}
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.25 }}>
          Serving Size: {analysisPreview?.servingSize || "..."}
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Nutrition Facts
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Building your result card...
            </Typography>

            <Box sx={{ width: "100%", mb: 2.25 }}>
              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{ height: 8, borderRadius: 999 }}
              />
            </Box>

            <Box
              sx={{
                mb: 2,
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
                ...getStageSx(1),
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                {analysisState !== "success" && <CircularProgress size={18} />}
                <Typography variant="body2" color="text.secondary">
                  {statusMessage || "Working..."}
                </Typography>
              </Box>
              <ProcessingStepList
                currentStepIndex={currentStepIndex}
                analysisState={analysisState}
                isLocalCacheHit={isLocalCacheHit}
              />
            </Box>

            <Box
              sx={{
                mb: 2,
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
                ...getStageSx(2),
              }}
            >
              <InterimAnalysisCard preview={analysisPreview} />
              <Typography variant="caption" color="text.secondary">
                Product, serving, and calories appear first.
              </Typography>
            </Box>

            <Box
              sx={{
                mb: 2,
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                backgroundColor: "background.default",
                ...getStageSx(3),
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Labels (building)
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {["Sugar", "Salt", "Fat"].map((label) => (
                  <Box
                    key={label}
                    sx={{
                      flex: 1,
                      borderRadius: 1,
                      border: "1px dashed",
                      borderColor: "divider",
                      p: 1,
                      backgroundColor: "background.paper",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="body2">...</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ ...getStageSx(4) }}>
              <ProcessingPreviewCard imageUri={previewImage} />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default ProcessingPage;
