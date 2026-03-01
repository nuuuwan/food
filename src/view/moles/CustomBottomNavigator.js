import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import HistoryIcon from "@mui/icons-material/History";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useData } from "../../nonview/core/DataContext";
import { useImageScanUploader } from "../../nonview/core/useImageScanUploader";
import VERSION from "../../nonview/cons/VERSION";

import AppBarMenu from "./AppBarMenu";

const CustomBottomNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { startScan } = useData();
  const fileInputRef = useRef(null);
  const [value, setValue] = useState(-1);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);
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

  const handleOpenMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleGitHubClick = () => {
    handleCloseMenu();
    window.open("https://github.com/nuuuwan/food", "_blank");
  };

  const handleRefresh = () => {
    handleCloseMenu();
    window.location.reload();
  };

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={1}
    >
      <Box sx={{ display: "flex", alignItems: "center", pl: 0.5 }}>
        <IconButton
          size="large"
          aria-label="menu"
          onClick={handleOpenMenu}
          sx={{ ml: 0.5, mr: 0.25 }}
        >
          <MoreVertIcon />
        </IconButton>
        <BottomNavigation
          value={value}
          onChange={handleChange}
          showLabels
          sx={{ flex: 1 }}
        >
          <BottomNavigationAction
            label={isUploading ? "Scanning..." : "Camera"}
            icon={<CameraAltIcon />}
            disabled={isUploading}
          />
          <BottomNavigationAction label="Your Food" icon={<HistoryIcon />} />
        </BottomNavigation>
      </Box>
      <AppBarMenu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        onGitHub={handleGitHubClick}
        onRefresh={handleRefresh}
        version={VERSION.DATETIME_STR}
      />
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
