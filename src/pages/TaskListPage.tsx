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
  const { enqueueSnackbar } = useSnackbar();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const queryClient = useQueryClient();

  const [page, setPage] = useState("1");
  const [pageSize, setPageSize] = useState("5");
  const [query, setQuery] = useState("");
  const { data: tasks, isLoading } = useQuery(
    ["tasks", page, pageSize, query],
    () => getAllTasks(page, pageSize, query)
  );

  const { mutate: deleteTaskMutation, isLoading: isDeleting } = useMutation(
    deleteTask,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tasks");
        enqueueSnackbar("Task deleted successfully", { variant: "success" });
        setDeleteConfirmationOpen(false);
      },
      onError: () => {
        enqueueSnackbar("Failed to delete task", { variant: "error" });
        setDeleteConfirmationOpen(false);
      },
    }
  );
  const [openDetails, setOpenDetails] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const handlePageChange = (newPage: string) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(newPageSize);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const handleDeleteClick = (taskId: number) => {
    setDeleteTaskId(taskId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTaskId) {
      deleteTaskMutation(deleteTaskId);
    }
  };

  const handleCloseUpdateTask = () => {
    setOpenUpdate(false);
  };

  const handleUpdateClick = (task: Task) => {
    setSelectedTask(task);
    setOpenUpdate(true);
  };

  const handleCheckBoxChange = async (task: Task) => {
    setSelectedTask(task);
    try {
      await updateTaskMutation.mutateAsync(task);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const updateTaskMutation = useMutation(
    (task: Task) => updateTask(task.id, { completed: !task.completed }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tasks");
      },
      onError: () => {
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
      <TaskDetail
        open={openDetails}
        task={selectedTask}
        onClose={handleCloseDetails}
      />
      {selectedTask && (
        <UpdateTask
          open={openUpdate}
          task={selectedTask}
          onClose={handleCloseUpdateTask}
        />
      )}
      <DeleteConfirmation
        open={deleteConfirmationOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmationOpen(false)}
      />
    </div>
  );
};

export default TaskListPage;
