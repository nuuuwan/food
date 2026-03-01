import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/core/DataContext";
import { Box, Button, Typography, Container, Grid } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import HistoryFoodCard from "../moles/HistoryFoodCard";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { foodHistory } = useData();

  const openUploader = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("food:open-uploader"));
    }
  };

  const openFood = (foodId) => navigate(`/item/${foodId}`);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Your Food
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {foodHistory.length} scanned item{foodHistory.length !== 1 ? "s" : ""}
      </Typography>

      {foodHistory.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No scans yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start scanning food images to build your history
          </Typography>
          <Button variant="contained" onClick={openUploader}>
            Scan Your First Food Image
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {foodHistory.map((food) => (
            <HistoryFoodCard key={food.id} food={food} onOpen={openFood} />
          ))}
        </Grid>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1,
          m: 3,
          px: 1.5,
          py: 1.25,
          borderRadius: 2,
        }}
      >
        <LockIcon
          sx={{
            fontSize: "1rem",
            mt: 0.2,
            color: "text.secondary",
            flexShrink: 0,
          }}
        />
        <Typography variant="caption" color="text.secondary">
          Your data is stored only on this device. Nothing is sent to the cloud
          — your food history stays completely private.
        </Typography>
      </Box>
    </Container>
  );
};

export default HistoryPage;
