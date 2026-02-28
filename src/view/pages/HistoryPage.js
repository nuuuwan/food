import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/core/DataContext";
import { Box, Button, Typography, Container, Grid } from "@mui/material";
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
        History
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
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
    </Container>
  );
};

export default HistoryPage;
