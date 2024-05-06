import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { updateTask, Task } from "../api/TasksApi";
import { useSnackbar } from "notistack";

interface Props {
  open: boolean; // Indicates whether the dialog is open
  task: Task; // The task to be updated
  onClose: () => void; // Callback function to close the dialog
}

const UpdateTask: React.FC<Props> = ({ open, task, onClose }) => {
  // Query client hook for managing data fetching and caching
  const queryClient = useQueryClient();

  // Snackbar hook for displaying notifications
  const { enqueueSnackbar } = useSnackbar();

  // State variable to store the updated task
  const [updatedTask, setTask] = useState(task);

  // Mutation hook for updating a task
  const updateTaskMutation = useMutation(
    // Function to execute when updating the task
    (task: Task) => updateTask(task.id, updatedTask),
    // Configuration object for the mutation
    {
      // Action to perform on successful mutation
      onSuccess: () => {
        // Invalidate the "tasks" query to refetch data and update UI
        queryClient.invalidateQueries("tasks");

        // Close the dialog
        onClose();

        // Show success notification
        enqueueSnackbar("Task updated successfully", { variant: "success" });
      },
      // Action to perform on error during mutation
      onError: () => {
        // Show error notification
        enqueueSnackbar("Error updating task", { variant: "error" });
      },
    }
  );

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Execute the update task mutation asynchronously
      await updateTaskMutation.mutateAsync(task);
    } catch (error) {
      // Log and handle errors
      console.error("Error updating task:", error);
    }
  };

  // Function to handle title change
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTask = { ...task, title: event.target.value };
    setTask(updatedTask);
  };

  // Function to handle description change
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedTask = { ...task, description: event.target.value };
    setTask(updatedTask);
  };

  // Function to handle completed status change
  const handleCompletedChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedTask = { ...task, completed: event.target.checked };
    setTask(updatedTask);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Task</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          value={updatedTask.title}
          onChange={handleTitleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={updatedTask.description}
          onChange={handleDescriptionChange}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={updatedTask.completed}
              onChange={handleCompletedChange}
            />
          }
          label="Completed"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateTask;
