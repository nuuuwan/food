import React from "react";
import { Menu, MenuItem, Typography, Divider, Box } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import RefreshIcon from "@mui/icons-material/Refresh";

const AppBarMenu = ({
  anchorEl,
  open,
  onClose,
  onGitHub,
  onRefresh,
  version,
}) => (
  <Menu
    anchorEl={anchorEl}
    open={open}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    transformOrigin={{ vertical: "top", horizontal: "right" }}
    PaperProps={{ sx: { width: 300, p: 0.5 } }}
  >
    <MenuItem onClick={onGitHub}>
      <GitHubIcon fontSize="small" sx={{ mr: 1 }} />
      <Typography variant="body2" sx={{ flexGrow: 1 }}>
        GitHub repository
      </Typography>
    </MenuItem>
    <MenuItem onClick={onRefresh}>
      <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
      <Typography variant="body2">Refresh</Typography>
    </MenuItem>
    <Divider />
    <Box sx={{ px: 1.5, py: 1 }}>
      <Typography variant="caption" color="text.secondary">
        Version
      </Typography>
      <Typography variant="body2">{version}</Typography>
    </Box>
  </Menu>
);

export default AppBarMenu;
