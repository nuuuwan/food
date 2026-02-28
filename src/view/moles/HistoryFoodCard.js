import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import HistoryCardImage from "../atoms/HistoryCardImage";

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${dateStr} at ${timeStr}`;
};

const HistoryFoodCard = ({ food, onOpen }) => (
  <Grid item xs={12} sm={6} md={4} key={food.id}>
    <Card elevation={2}>
      <CardActionArea onClick={() => onOpen(food.id)}>
        <HistoryCardImage food={food} />
        <CardContent>
          <Typography variant="h6" gutterBottom noWrap>
            {food.productName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(food.timestamp)}
            {food.photos && food.photos.length > 1 && (
              <span> • {food.photos.length} photos</span>
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
);

export default HistoryFoodCard;
