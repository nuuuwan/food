import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SkipNextIcon from "@mui/icons-material/SkipNext";

export const PROCESS_STEPS = [
  { key: "Preparing image", label: "Image prepared" },
  { key: "Checking cache", label: "Cache checked" },
  { key: "Uploading", label: "Image uploaded" },
  { key: "Analyzing", label: "Analysis complete" },
  { key: "Reviewing result", label: "Interim result ready" },
  { key: "Done", label: "Results ready" },
];

export const getCurrentStepIndex = (title) => {
  const list = [
    "Preparing image",
    "Checking cache",
    "Uploading",
    "Analyzing",
    "Reviewing result",
    "Done",
  ];
  if (["Cached local", "Cached remote"].includes(title)) {
    return 5;
  }
  const index = list.indexOf(title || "");
  return index >= 0 ? index : 0;
};

const ProcessingStepList = ({
  currentStepIndex,
  analysisState,
  isLocalCacheHit,
}) => (
  <Box sx={{ width: "100%", maxWidth: 420, textAlign: "left", mb: 2 }}>
    {PROCESS_STEPS.map((step, index) => {
      const isComplete =
        currentStepIndex > index || analysisState === "success";
      const isActive =
        currentStepIndex === index && analysisState !== "success";
      const isSkipped =
        isLocalCacheHit &&
        ["Image uploaded", "Analysis complete"].includes(step.label);
      const color = isSkipped
        ? "warning.main"
        : isComplete
          ? "success.main"
          : isActive
            ? "text.primary"
            : "text.secondary";

      return (
        <Box
          key={step.label}
          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, color }}
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
);

export default ProcessingStepList;
