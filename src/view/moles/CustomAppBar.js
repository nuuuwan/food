import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VERSION from "../../nonview/cons/VERSION";
import { getStorageStats } from "../../nonview/core/storageStats";
import AppBarMenu from "./AppBarMenu";

const CustomAppBar = () => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);

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
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleOpenMenu}
        >
          <MoreVertIcon />
        </IconButton>
        <AppBarMenu
          anchorEl={menuAnchorEl}
          open={isMenuOpen}
          onClose={handleCloseMenu}
          onGitHub={handleGitHubClick}
          onRefresh={handleRefresh}
          stats={storageStats}
          version={VERSION.DATETIME_STR}
        />
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
