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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const createTaskMutation = useMutation(createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
      navigate("/tasks");
      enqueueSnackbar("Task created successfully", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Error creating task", { variant: "error" });
    },
  });

  const handleSubmit = async () => {
    try {
      await createTaskMutation.mutateAsync({ title, description, completed });
    } catch (error) {
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
            disabled={createTaskMutation.isLoading}
          >
            {createTaskMutation.isLoading ? "Creating..." : "Create Task"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateTaskPage;
