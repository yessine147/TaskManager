import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, TextField, IconButton } from '@mui/material';
import { Task } from '../api/TasksApi';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  open: boolean;
  task: Task | null;
  onClose: () => void;
}

const TaskDetail: React.FC<Props> = ({ open, task, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="text-center">
        <Typography variant="h5">{task?.title}</Typography>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 0, top: 0 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">Description:</Typography>
          <Typography sx={{ ml: 1 }}>{task?.description}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1">Completed:</Typography>
          <Typography sx={{ ml: 1 }}>{task?.completed ? 'Yes' : 'No'}</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <IconButton color="primary" sx={{ mr: 2 }}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" sx={{ ml: 2 }}>
          <DeleteIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetail;
