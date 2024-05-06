import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationDialog: React.FC<Props> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle className="text-center">
        <Typography variant="h5">Confirm Deletion</Typography>
        <IconButton
          onClick={onCancel}
          sx={{ position: "absolute", right: 0, top: 0 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this task?</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onCancel}
          color="primary"
          variant="outlined"
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
