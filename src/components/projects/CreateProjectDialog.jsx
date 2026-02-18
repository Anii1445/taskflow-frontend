import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, TextField, Button, IconButton, Typography,
} from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import { useCreateProject } from '../../hooks/useProjects';

const PALETTE = ['#6c63ff', '#ff6584', '#43e97b', '#f7971e', '#61dafb', '#ff8c94', '#bd34fe', '#ff4757'];

export default function CreateProjectDialog({ open, onClose }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [color, setColor] = React.useState('#6c63ff');
  const createProject = useCreateProject();

  const onSubmit = (data) => {
    createProject.mutate({ ...data, color }, {
      onSuccess: () => { reset(); setColor('#6c63ff'); onClose(); },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Create New Project</Typography>
        <IconButton size="small" onClick={onClose}><CloseRounded fontSize="small" /></IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Project Name *"
              fullWidth
              size="small"
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name', { required: 'Project name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
            />
            <TextField
              label="Description"
              fullWidth
              size="small"
              multiline
              rows={3}
              placeholder="What is this project about?"
              {...register('description')}
            />
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1, color: 'text.secondary' }}>Project Color</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {PALETTE.map((c) => (
                  <Box
                    key={c}
                    onClick={() => setColor(c)}
                    sx={{
                      width: 28, height: 28, borderRadius: '50%', bgcolor: c, cursor: 'pointer',
                      border: color === c ? '3px solid white' : '3px solid transparent',
                      boxShadow: color === c ? `0 0 0 2px ${c}` : 'none',
                      transition: 'all 0.15s',
                      '&:hover': { transform: 'scale(1.15)' },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={createProject.isPending}>
            {createProject.isPending ? 'Creating…' : 'Create Project'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
