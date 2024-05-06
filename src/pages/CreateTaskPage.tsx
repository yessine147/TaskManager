import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { createTask } from "../api/TasksApi";
import { useSnackbar } from "notistack";

const CreateTaskPage: React.FC = () => {
  // State variables to store form data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  // Hook for navigation
  const navigate = useNavigate();

  // Query client hook for managing data fetching and caching
  const queryClient = useQueryClient();

  // Snackbar hook for displaying notifications
  const { enqueueSnackbar } = useSnackbar();

  // Mutation hook for creating a task
  const createTaskMutation = useMutation(createTask, {
    // Action to perform on successful mutation
    onSuccess: () => {
      // Invalidate the "tasks" query to refetch data and update UI
      queryClient.invalidateQueries("tasks");

      // Navigate to the tasks page
      navigate("/tasks");

      // Show success notification
      enqueueSnackbar("Task created successfully", { variant: "success" });
    },
    // Action to perform on error during mutation
    onError: () => {
      // Show error notification
      enqueueSnackbar("Error creating task", { variant: "error" });
    },
  });

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Execute the create task mutation asynchronously
      await createTaskMutation.mutateAsync({ title, description, completed });
    } catch (error) {
      // Log and handle errors
      console.error("Error creating task:", error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <Typography variant="h4" align="center">
        Create Task
      </Typography>
      <Box sx={{ mt: 2 }}>
        <TextField
          label="Title"
          value={title}
          onChange={(e: any) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
          }
          label="Completed"
        />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={createTaskMutation.isLoading} // Disable button while mutation is in progress
          >
            {createTaskMutation.isLoading ? "Creating..." : "Create Task"}{" "}
            {/* Change button text based on mutation loading state */}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateTaskPage;
