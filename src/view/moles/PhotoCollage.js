import React from "react";
import { Box, Paper, Grid, Typography } from "@mui/material";
import TopRatingsOverlay from "./TopRatingsOverlay";
import {
  formatDateTime,
  getImageSizeKB,
  formatNumber,
} from "../../nonview/core/nutritionUtils";
import { SINGAPORE_GRADE_SCALE } from "../../nonview/core/singaporeNutriGrade";

const PhotoCollage = ({
  photos,
  productName,
  timestamp,
  warningBadges,
  singaporeNutriGrade,
  novaBadgeColor,
  novaClassNumber,
  previewImageUri,
  statusMessage,
}) => {
  const hasPhotos = photos && photos.length > 0;
  if (!hasPhotos && !previewImageUri) {
    return null;
  }

  const collageHeight = { xs: 280, sm: 380, md: 460 };
  const primaryImageSizeKB = hasPhotos
    ? getImageSizeKB(photos[0]?.imageUri)
    : null;
  const imageSizeLabel =
    primaryImageSizeKB === null
      ? null
      : `${formatNumber(primaryImageSizeKB, 1)} KB`;

  const overlay = (
    <TopRatingsOverlay
      warningBadges={warningBadges}
      singaporeGradeScale={SINGAPORE_GRADE_SCALE}
      singaporeNutriGrade={singaporeNutriGrade}
      novaBadgeColor={novaBadgeColor}
      novaClassNumber={novaClassNumber}
    />
  );

  const subtitleLine = statusMessage
    ? statusMessage
    : timestamp
      ? `${formatDateTime(timestamp)}${hasPhotos && photos.length > 1 ? ` • ${photos.length} photos` : ""}`
      : null;

  const caption = (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
        p: 2,
      }}
    >
      <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
        {productName || "Building result..."}
      </Typography>
      {subtitleLine && (
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
          {subtitleLine}
        </Typography>
      )}
      {imageSizeLabel && (
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
          {imageSizeLabel}
        </Typography>
      )}
    </Box>
  );

  // Preview image (processing mode) — single image, no photo object array
  if (!hasPhotos && previewImageUri) {
    return (
      <Paper
        elevation={2}
        sx={{
          overflow: "hidden",
          position: "relative",
          height: collageHeight,
          borderRadius: 0,
          bgcolor: "grey.200",
        }}
      >
        {overlay}
        <img
          src={previewImageUri}
          alt={productName || "Analyzing..."}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        {caption}
      </Paper>
    );
  }

  if (photos.length === 1) {
    return (
      <Paper
        elevation={2}
        sx={{
          overflow: "hidden",
          position: "relative",
          height: collageHeight,
          borderRadius: 0,
        }}
      >
        {overlay}
        <img
          src={photos[0].imageUri}
          alt={productName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        {caption}
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        overflow: "hidden",
        position: "relative",
        height: collageHeight,
        borderRadius: 0,
      }}
    >
      {overlay}
      <Grid container spacing={0.5} sx={{ height: "100%" }}>
        {photos.slice(0, 4).map((photo, index) => (
          <Grid
            item
            xs={
              photos.length === 2
                ? 6
                : photos.length === 3 && index === 0
                  ? 12
                  : 6
            }
            key={photo.id}
            sx={{
              height:
                photos.length === 2
                  ? "100%"
                  : photos.length === 3 && index === 0
                    ? "50%"
                    : "50%",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={photo.imageUri}
                alt={`${productName} - ${index + 1}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
      {caption}
    </Paper>
  );
};

export default PhotoCollage;
