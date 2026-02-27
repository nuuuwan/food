import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import HistoryIcon from "@mui/icons-material/History";

const CustomBottomNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    // Update selected tab based on current route
    const path = location.pathname;
    if (path === "/" || path === "/camera") {
      setValue(0);
    } else if (path === "/list") {
      setValue(1);
    } else {
      setValue(-1);
    }
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/camera");
        break;
      case 1:
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
        <BottomNavigationAction label="Camera" icon={<CameraAltIcon />} />
        <BottomNavigationAction label="History" icon={<HistoryIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default CustomBottomNavigator;
