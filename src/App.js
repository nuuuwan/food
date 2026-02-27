import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import { DataProvider } from "./nonview/core/DataContext";
import FoodPage from "./view/pages/FoodPage";
import HistoryPage from "./view/pages/HistoryPage";
import CustomAppBar from "./view/moles/CustomAppBar";
import CustomBottomNavigator from "./view/moles/CustomBottomNavigator";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#4caf50",
    },
  },
  typography: {
    fontFamily:
      '"PT Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataProvider>
        <BrowserRouter basename="/food">
          <Box sx={{ pb: 7 }}>
            <CustomAppBar />
            <Routes>
              <Route path="/" element={<Navigate to="/list" replace />} />
              <Route path="/item/:foodId" element={<FoodPage />} />
              <Route path="/list" element={<HistoryPage />} />
              <Route path="*" element={<Navigate to="/list" replace />} />
            </Routes>
            <CustomBottomNavigator />
          </Box>
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
