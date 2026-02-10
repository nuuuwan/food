import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import GitHubIcon from "@mui/icons-material/GitHub";

const CustomAppBar = () => {
  const handleGitHubClick = () => {
    window.open("https://github.com/nuuuwan/food", "_blank");
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
          aria-label="github"
          onClick={handleGitHubClick}
        >
          <GitHubIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
