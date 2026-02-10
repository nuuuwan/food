import { useData } from "../../nonview/core/DataContext";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
} from "@mui/material";

const FoodPage = () => {
  const { currentFood } = useData();

  if (!currentFood) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const {
    productName,
    nutrients,
    ingredients,
    warnings,
    imageUri,
    servingSize,
    timestamp,
  } = currentFood;

  const formatDateTime = (ts) => {
    const date = new Date(ts);
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Image Preview with Overlaid Title */}
      <Paper
        elevation={2}
        sx={{ mb: 3, overflow: "hidden", position: "relative" }}
      >
        <img
          src={imageUri}
          alt={productName}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
            p: 2,
          }}
        >
          <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
            {productName}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
            {formatDateTime(timestamp)}
          </Typography>
        </Box>
      </Paper>

      {/* Insights */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Insights
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box>
            <Typography variant="body2" sx={{ mb: 1, color: "success.main" }}>
              ✓ Good source of protein (8g per serving)
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: "success.main" }}>
              ✓ Contains healthy fats
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: "success.main" }}>
              ✓ Low in sodium
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: "warning.main" }}>
              ✗ High in calories - watch portion size
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Serving Size: {servingSize || "N/A"}
      </Typography>

      {/* Nutrition Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Nutrition Facts
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Calories
              </Typography>
              <Typography variant="h6">{nutrients.calories}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Protein
              </Typography>
              <Typography variant="h6">{nutrients.protein}g</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Carbs
              </Typography>
              <Typography variant="h6">{nutrients.carbs}g</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Fat
              </Typography>
              <Typography variant="h6">{nutrients.fat}g</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Fiber
              </Typography>
              <Typography variant="h6">{nutrients.fiber}g</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Sodium
              </Typography>
              <Typography variant="h6">{nutrients.sodium}mg</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Sugar
              </Typography>
              <Typography variant="h6">{nutrients.sugar}g</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Ingredients
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box component="ol" sx={{ pl: 2 }}>
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                <Typography variant="body1">
                  {ingredient.name} - {ingredient.quantity}
                </Typography>
              </li>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Warnings */}
      {warnings.length > 0 && (
        <Card sx={{ mb: 3, backgroundColor: "#fff3e0" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              ⚠️ Allergen Warnings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {warnings.map((warning, index) => (
              <Typography key={index} variant="body1" sx={{ mb: 0.5 }}>
                • {warning}
              </Typography>
            ))}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default FoodPage;
