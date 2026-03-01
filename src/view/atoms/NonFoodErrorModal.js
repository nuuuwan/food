import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import NoPhotographyIcon from "@mui/icons-material/NoPhotography";

const NonFoodErrorModal = ({ open, reason, onDismiss }) => (
  <Dialog
    open={open}
    onClose={onDismiss}
    PaperProps={{ sx: { borderRadius: 3, p: 1, maxWidth: 360 } }}
  >
    <DialogTitle
      sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}
    >
      <NoPhotographyIcon color="error" />
      Not a food image
    </DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary">
        {reason ||
          "The image you selected doesn't appear to contain food or a food label. Please try a different photo."}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 2, pb: 2 }}>
      <Button
        variant="contained"
        onClick={onDismiss}
        fullWidth
        sx={{ borderRadius: 2 }}
      >
        Got it
      </Button>
    </DialogActions>
  </Dialog>
);

export default NonFoodErrorModal;
