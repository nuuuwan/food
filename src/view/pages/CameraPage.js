import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/core/DataContext";
import { Box, Button, Typography, Container, Paper } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const CameraPage = () => {
  const navigate = useNavigate();
  const { startScan } = useData();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const MAX_UPLOAD_BYTES = 500 * 1024;

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(file);
    });

  const loadImageFromDataUrl = (dataUrl) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to load image"));
      image.src = dataUrl;
    });

  const estimateDataUrlBytes = (dataUrl) => {
    const base64 = dataUrl.split(",")[1] || "";
    return Math.floor((base64.length * 3) / 4);
  };

  const compressImageDataUrl = async (originalDataUrl) => {
    const image = await loadImageFromDataUrl(originalDataUrl);

    const maxDimension = 960;
    const scale = Math.min(
      1,
      maxDimension / Math.max(image.width, image.height),
    );
    const targetWidth = Math.max(1, Math.round(image.width * scale));
    const targetHeight = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not initialize image compressor");
    }

    context.drawImage(image, 0, 0, targetWidth, targetHeight);

    const qualitySteps = [0.8, 0.7, 0.6, 0.5, 0.4, 0.3];
    let bestCandidate = originalDataUrl;

    for (const quality of qualitySteps) {
      const candidate = canvas.toDataURL("image/jpeg", quality);
      bestCandidate = candidate;
      if (estimateDataUrlBytes(candidate) <= MAX_UPLOAD_BYTES) {
        return candidate;
      }
    }

    return bestCandidate;
  };

  const handleScan = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setIsUploading(true);
      const imageDataUrl = await readFileAsDataUrl(file);
      const compressedImageDataUrl = await compressImageDataUrl(imageDataUrl);
      setPreviewImage(compressedImageDataUrl);
      await startScan(compressedImageDataUrl);
    } catch (error) {
      console.error("Failed to process selected image:", error);
      return;
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = "";
      }
    }

    navigate("/processing");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h3" gutterBottom>
          Food Image Scanner
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Scan food images to get instant AI-powered insights
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
          {previewImage ? (
            <img
              src={previewImage}
              alt="Selected food image"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <CameraAltIcon
                sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Upload Food Image
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select an image to analyze
              </Typography>
            </Box>
          )}

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
          disabled={isUploading}
          sx={{ px: 6, py: 1.5 }}
        >
          {isUploading ? "Uploading..." : "Scan Food Image"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelected}
          style={{ display: "none" }}
        />
      </Box>
    </Container>
  );
};

export default CameraPage;
