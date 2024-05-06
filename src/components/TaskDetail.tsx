import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Task } from "../api/TasksApi";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmation from "./DeleteConfirmation";
import { useMutation, useQueryClient } from "react-query";
import { deleteTask } from "../api/TasksApi";
import { useSnackbar } from "notistack";
import UpdateTask from "./UpdateTask";

interface Props {
  open: boolean;
  task: Task | null;
  onClose: () => void;
}

const TaskDetail: React.FC<Props> = ({ open, task, onClose }) => {
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [openUpdate, setOpenUpdate] = useState(false);

  const { mutate: deleteTaskMutation, isLoading: isDeleting } = useMutation(
    deleteTask,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tasks");
        onClose();
        enqueueSnackbar("Task deleted successfully", { variant: "success" });
      },
      onError: () => {
        enqueueSnackbar("Error deleting task", { variant: "error" });
      },
    }
  );

  const handleDelete = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteTaskMutation(task?.id || 0);
    setDeleteConfirmationOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleUpdateClick = () => {
    setOpenUpdate(true);
  };

  const handleCloseUpdateTask = () => {
    setOpenUpdate(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="text-center">
        <Typography>{task?.title}</Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 0, top: 0 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="subtitle1">Description:</Typography>
          <Typography sx={{ ml: 1 }}>{task?.description}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle1">Completed:</Typography>
          <Typography sx={{ ml: 1 }}>
            {task?.completed ? "Yes" : "No"}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <IconButton color="primary" sx={{ mr: 2 }} onClick={handleUpdateClick}>
          <EditIcon />
        </IconButton>
        <IconButton
          color="error"
          sx={{ ml: 2 }}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <DeleteIcon />
        </IconButton>
      </DialogActions>
      <DeleteConfirmation
        open={deleteConfirmationOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      {task && (
        <UpdateTask
          open={openUpdate}
          task={task}
          onClose={handleCloseUpdateTask}
        />
      )}
    </Dialog>
  );
};

export default TaskDetail;
