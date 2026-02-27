import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import HistoryIcon from "@mui/icons-material/History";
import { useData } from "../../nonview/core/DataContext";

const CustomBottomNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { startScan } = useData();
  const fileInputRef = useRef(null);
  const [value, setValue] = useState(-1);
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

  const openUploader = useCallback(() => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  }, [isUploading]);

  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setIsUploading(true);
      const imageDataUrl = await readFileAsDataUrl(file);
      const compressedImageDataUrl = await compressImageDataUrl(imageDataUrl);
      navigate("/processing");
      await startScan(compressedImageDataUrl);
    } catch (error) {
      console.error("Failed to process selected image:", error);
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  useEffect(() => {
    // Update selected tab based on current route
    const path = location.pathname;
    if (path === "/list") {
      setValue(1);
    } else {
      setValue(-1);
    }
  }, [location]);

  useEffect(() => {
    const handleOpenUploader = () => {
      openUploader();
    };

    window.addEventListener("food:open-uploader", handleOpenUploader);
    return () => {
      window.removeEventListener("food:open-uploader", handleOpenUploader);
    };
  }, [openUploader]);

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        openUploader();
        break;
      case 1:
        setValue(1);
        navigate("/list");
        break;
      default:
        break;
    }
  };

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction
          label={isUploading ? "Uploading" : "Camera"}
          icon={<CameraAltIcon />}
          disabled={isUploading}
        />
        <BottomNavigationAction label="History" icon={<HistoryIcon />} />
      </BottomNavigation>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelected}
        style={{ display: "none" }}
      />
    </Paper>
  );
};

export default CustomBottomNavigator;
