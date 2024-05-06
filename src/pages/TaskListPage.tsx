import React, { useState } from "react";
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";
import { getAllTasks, Task, updateTask } from "../api/TasksApi";
import {
  Pagination,
  Typography,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmation from "../components/DeleteConfirmation";
import { useMutation, useQueryClient } from "react-query";
import { deleteTask } from "../api/TasksApi";
import TaskDetail from "../components/TaskDetail";
import UpdateTask from "../components/UpdateTask";

const TaskListPage: React.FC = () => {
  // Snackbar hook for displaying notifications
  const { enqueueSnackbar } = useSnackbar();

  // State for handling delete confirmation dialog
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);

  // State for managing selected task
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // State for update dialogs visibility
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  // Query client for managing query cache
  const queryClient = useQueryClient();

  // State for pagination and search query
  const [page, setPage] = useState("1");
  const [pageSize, setPageSize] = useState("5");
  const [query, setQuery] = useState("");

  // Query to fetch tasks from the server
  const { data: tasks, isLoading } = useQuery(
    ["tasks", page, pageSize, query],
    () => getAllTasks(page, pageSize, query),
    {
      onError: () => {
        // Show error notification
        enqueueSnackbar("Failed to load tasks", { variant: "error" });
      },
    }
  );

  // Mutation for deleting tasks
  const { mutate: deleteTaskMutation, isLoading: isDeleting } = useMutation(
    deleteTask,
    {
      onSuccess: () => {
        // Invalidate the tasks query to trigger a refetch
        queryClient.invalidateQueries("tasks");
        // Show success notification
        enqueueSnackbar("Task deleted successfully", { variant: "success" });
        // Close delete confirmation dialog
        setDeleteConfirmationOpen(false);
      },
      onError: () => {
        // Show error notification
        enqueueSnackbar("Failed to delete task", { variant: "error" });
        // Close delete confirmation dialog
        setDeleteConfirmationOpen(false);
      },
    }
  );

  // Function to handle page change in pagination
  const handlePageChange = (newPage: string) => {
    setPage(newPage);
  };

  // Function to handle page size change in pagination
  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(newPageSize);
  };

  // Function to handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  // Function to handle row click and open task details
  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
    setOpenDetails(true);
  };

  // Function to close task details dialog
  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  // Function to handle delete button click and open delete confirmation dialog
  const handleDeleteClick = (taskId: number) => {
    setDeleteTaskId(taskId);
    setDeleteConfirmationOpen(true);
  };

  // Function to handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteTaskId) {
      deleteTaskMutation(deleteTaskId);
    }
  };

  // Function to close update task dialog
  const handleCloseUpdateTask = () => {
    setOpenUpdate(false);
  };

  // Function to handle update button click and open update task dialog
  const handleUpdateClick = (task: Task) => {
    setSelectedTask(task);
    setOpenUpdate(true);
  };

  // Function to handle checkbox change and update task completion status
  const handleCheckBoxChange = async (task: Task) => {
    setSelectedTask(task);
    try {
      await updateTaskMutation.mutateAsync(task);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Mutation for updating task completion status
  const updateTaskMutation = useMutation(
    // Update task completion status by toggling it
    (task: Task) => updateTask(task.id, { completed: !task.completed }),
    {
      onSuccess: () => {
        // Invalidate the tasks query to trigger a refetch
        queryClient.invalidateQueries("tasks");
      },
      onError: () => {
        // Show error notification
        enqueueSnackbar("Error updating task", { variant: "error" });
      },
    }
  );

  return (
    <div>
      <Typography variant="h4">Task List</Typography>
      <div style={{ marginBottom: "16px" }}>
        <TextField
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search by title"
          variant="outlined"
          size="small"
          fullWidth
        />
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="center" width="15%">
                Completed
              </TableCell>
              <TableCell align="center" width="15%">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks?.content?.map((task: Task) => (
              <TableRow key={task.id}>
                <TableCell
                  onClick={() => handleRowClick(task)}
                  style={{ cursor: "pointer" }}
                >
                  {task.title}
                </TableCell>
                <TableCell>
                  <Box display="flex" justifyContent="center">
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleCheckBoxChange(task)}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" justifyContent="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleUpdateClick(task)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(task.id)}
                      disabled={isDeleting}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}
      >
        <Pagination
          count={tasks?.totalPages}
          page={parseInt(page)}
          onChange={(event, value) => handlePageChange(value.toString())}
          variant="outlined"
          shape="rounded"
        />
      </div>
      <div
        style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}
      >
        <Select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="5">5 per page</MenuItem>
          <MenuItem value="10">10 per page</MenuItem>
          <MenuItem value="20">20 per page</MenuItem>
        </Select>
      </div>
      {/* Task detail dialog */}
      <TaskDetail
        open={openDetails}
        task={selectedTask}
        onClose={handleCloseDetails}
      />
      {/* Update task dialog */}
      {selectedTask && (
        <UpdateTask
          open={openUpdate}
          task={selectedTask}
          onClose={handleCloseUpdateTask}
        />
      )}
      {/* Delete confirmation dialog */}
      <DeleteConfirmation
        open={deleteConfirmationOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmationOpen(false)}
      />
    </div>
  );
};

export default TaskListPage;
