import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getAllTasks, Task } from '../api/TasksApi';
import { Pagination, Typography, TextField, Button, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const TaskList: React.FC = () => {
  const [page, setPage] = useState('1');
  const [pageSize, setPageSize] = useState('10');
  const [query, setQuery] = useState('');
  const { data: tasks, isLoading } = useQuery(['tasks', page, pageSize, query], () =>
    getAllTasks(page, pageSize, query)
  );

  const handlePageChange = (newPage: string) => {
    console.log("newPage",newPage);
    
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(newPageSize);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  // if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Typography variant="h4">Task List</Typography>
      <div style={{ marginBottom: '16px' }}>
        <TextField
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search tasks..."
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
              <TableCell>Description</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks?.content?.map((task: Task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.completed ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={tasks?.totalPages}
          page={parseInt(page)}
          onChange={(event, value) => handlePageChange(value.toString())}
          variant="outlined"
          shape="rounded"
        />
      </div>
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
        <Select value={pageSize} onChange={(e) => handlePageSizeChange(e.target.value)} variant="outlined">
          <MenuItem value="5">5 per page</MenuItem>
          <MenuItem value="10">10 per page</MenuItem>
          <MenuItem value="20">20 per page</MenuItem>
        </Select>
      </div>
    </div>
  );
  
};

export default TaskList;
