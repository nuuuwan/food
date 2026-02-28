import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/core/DataContext";
import { Box, Button, Typography, Container } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CameraPreviewCard from "../atoms/CameraPreviewCard";
import { useImageScanUploader } from "../../nonview/core/useImageScanUploader";

const CameraPage = () => {
  const navigate = useNavigate();
  const { startScan } = useData();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState("");
  const { isUploading, uploadFile } = useImageScanUploader({
    startScan,
    navigateToProcessing: () => navigate("/processing"),
  });

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
      const compressedImageDataUrl = await uploadFile(file);
      if (compressedImageDataUrl) {
        setPreviewImage(compressedImageDataUrl);
      }
    } catch (error) {
      console.error("Failed to process selected image:", error);
      return;
    } finally {
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h3" gutterBottom>
          <CameraPreviewCard previewImage={previewImage} />
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
