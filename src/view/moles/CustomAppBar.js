import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Box,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import GitHubIcon from "@mui/icons-material/GitHub";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";

const CustomAppBar = () => {
  const theme = useTheme();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const getStorageStats = () => {
    if (typeof window === "undefined") {
      return { usedKB: 0, remainingKB: 0 };
    }

    const assumedCapacityBytes = 5 * 1024 * 1024;
    let usedBytes = 0;

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index) || "";
      const value = window.localStorage.getItem(key) || "";
      usedBytes += (key.length + value.length) * 2;
    }

    const remainingBytes = Math.max(assumedCapacityBytes - usedBytes, 0);
    return {
      usedKB: usedBytes / 1024,
      remainingKB: remainingBytes / 1024,
    };
  };

  const storageStats = getStorageStats();

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
    <AppBar position="static">
      <Toolbar>
        <RestaurantIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Food AI
        </Typography>
        <IconButton
          size="large"
          color="inherit"
          aria-label="github"
          onClick={handleGitHubClick}
        >
          <GitHubIcon />
        </IconButton>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleOpenMenu}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={menuAnchorEl}
          open={isMenuOpen}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{ sx: { width: 300, p: 0.5 } }}
        >
          <MenuItem onClick={handleGitHubClick}>
            <GitHubIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              GitHub repository
            </Typography>
            <OpenInNewIcon fontSize="small" />
          </MenuItem>
          <MenuItem onClick={handleRefresh}>
            <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">Refresh</Typography>
          </MenuItem>
          <Divider />
          <Box sx={{ px: 1.5, py: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Local storage usage
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Used {storageStats.usedKB.toFixed(1)} KB • Remaining{" "}
              {storageStats.remainingKB.toFixed(1)} KB
            </Typography>
            <BarChart
              height={130}
              xAxis={[
                {
                  data: ["Storage"],
                  scaleType: "band",
                },
              ]}
              yAxis={[{ min: 0 }]}
              series={[
                {
                  label: "Used KB",
                  data: [storageStats.usedKB],
                  color: theme.palette.error.main,
                  stack: "total",
                },
                {
                  label: "Remaining KB",
                  data: [storageStats.remainingKB],
                  color: theme.palette.success.main,
                  stack: "total",
                },
              ]}
              slotProps={{ legend: { hidden: true } }}
              margin={{ left: 40, right: 10, top: 10, bottom: 30 }}
            />
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
