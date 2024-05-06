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
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { updateTask, Task } from "../api/TasksApi";
import { useSnackbar } from "notistack";

interface Props {
  open: boolean;
  task: Task;
  onClose: () => void;
}

const UpdateTask: React.FC<Props> = ({ open, task, onClose }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [updatedTask, setTask] = useState(task);

  const updateTaskMutation = useMutation(
    (task: Task) => updateTask(task.id, updatedTask),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tasks");
        onClose();
        enqueueSnackbar("Task updated successfully", { variant: "success" });
        navigate("/tasks");
      },
      onError: () => {
        enqueueSnackbar("Error updating task", { variant: "error" });
      },
    }
  );

  const handleSubmit = async () => {
    try {
      await updateTaskMutation.mutateAsync(task);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTask = { ...task, title: event.target.value };
    setTask(updatedTask);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedTask = { ...task, description: event.target.value };
    setTask(updatedTask);
  };

  const handleCompletedChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedTask = { ...task, completed: event.target.checked };
    setTask(updatedTask);
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
