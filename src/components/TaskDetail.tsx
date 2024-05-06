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
  open: boolean; // Indicates whether the dialog is open
  task: Task | null; // The task to display details for
  onClose: () => void; // Callback function to close the dialog
}

const TaskDetail: React.FC<Props> = ({ open, task, onClose }) => {
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // State to manage the delete confirmation dialog
  const queryClient = useQueryClient(); // Query client hook for managing data fetching and caching
  const { enqueueSnackbar } = useSnackbar(); // Snackbar hook for displaying notifications
  const [openUpdate, setOpenUpdate] = useState(false); // State to manage the update task dialog

  // Mutation hook for deleting a task
  const { mutate: deleteTaskMutation, isLoading: isDeleting } = useMutation(
    deleteTask,
    {
      // Action to perform on successful mutation
      onSuccess: () => {
        queryClient.invalidateQueries("tasks"); // Invalidate the "tasks" query to refetch data and update UI
        onClose();
        enqueueSnackbar("Task deleted successfully", { variant: "success" });
      },
      // Action to perform on error during mutation
      onError: () => {
        enqueueSnackbar("Error deleting task", { variant: "error" });
      },
    }
  );

  // Function to handle opening the delete confirmation dialog
  const handleDelete = () => {
    setDeleteConfirmationOpen(true);
  };

  // Function to handle confirming task deletion
  const handleConfirmDelete = () => {
    deleteTaskMutation(task?.id || 0);
    setDeleteConfirmationOpen(false);
  };

  // Function to handle cancelling task deletion
  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  // Function to handle opening the update task dialog
  const handleUpdateClick = () => {
    setOpenUpdate(true);
  };

  // Function to handle closing the update task dialog
  const handleCloseUpdateTask = () => {
    setOpenUpdate(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Dialog title section */}
      <DialogTitle className="text-center">
        <Typography>{task?.title}</Typography> {/* Task title */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 0, top: 0 }}
        >
          <CloseIcon /> {/* Close button */}
        </IconButton>
      </DialogTitle>
      {/* Dialog content section */}
      <DialogContent>
        {/* Task description */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="subtitle1">Description:</Typography>
          <Typography sx={{ ml: 1 }}>{task?.description}</Typography>
        </Box>
        {/* Task completion status */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle1">Completed:</Typography>
          <Typography sx={{ ml: 1 }}>
            {task?.completed ? "Yes" : "No"}
          </Typography>
        </Box>
      </DialogContent>
      {/* Dialog actions section */}
      <DialogActions sx={{ justifyContent: "center" }}>
        {/* Button to open update task dialog */}
        <IconButton color="primary" sx={{ mr: 2 }} onClick={handleUpdateClick}>
          <EditIcon />
        </IconButton>
        {/* Button to delete task */}
        <IconButton
          color="error"
          sx={{ ml: 2 }}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <DeleteIcon />
        </IconButton>
      </DialogActions>
      {/* Delete confirmation dialog */}
      <DeleteConfirmation
        open={deleteConfirmationOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      {/* Update task dialog */}
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
