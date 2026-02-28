import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import HistoryIcon from "@mui/icons-material/History";
import { useData } from "../../nonview/core/DataContext";
import { useImageScanUploader } from "../../nonview/core/useImageScanUploader";
const CustomBottomNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { startScan } = useData();
  const fileInputRef = useRef(null);
  const [value, setValue] = useState(-1);
  const { isUploading, uploadFile } = useImageScanUploader({
    startScan,
    navigateToProcessing: () => navigate("/processing"),
  });

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
      await uploadFile(file, { awaitScan: true });
    } catch (error) {
      console.error("Failed to process selected image:", error);
    } finally {
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  useEffect(() => {
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
