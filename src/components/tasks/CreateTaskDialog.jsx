import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Chip, IconButton, Typography,
} from '@mui/material';
import { CloseRounded, AddRounded } from '@mui/icons-material';
import { useCreateTask } from '../../hooks/useTasks';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: '#8080aa' },
  { value: 'medium', label: 'Medium', color: '#61dafb' },
  { value: 'high', label: 'High', color: '#f7971e' },
  { value: 'critical', label: 'Critical', color: '#ff6584' },
];

export default function CreateTaskDialog({ open, onClose, projectId, members = [], defaultStatus = 'todo' }) {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: { title: '', description: '', priority: 'medium', status: defaultStatus, assignee: '', dueDate: '', labels: [] },
  });
  const [labelInput, setLabelInput] = React.useState('');
  const [labels, setLabels] = React.useState([]);

  const createTask = useCreateTask(projectId);

  const onSubmit = (data) => {
    createTask.mutate({ ...data, labels, assignee: data.assignee || null }, {
      onSuccess: () => { reset(); setLabels([]); onClose(); },
    });
  };

  const addLabel = () => {
    if (labelInput.trim() && !labels.includes(labelInput.trim())) {
      setLabels([...labels, labelInput.trim()]);
      setLabelInput('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Create New Task</Typography>
        <IconButton size="small" onClick={onClose}><CloseRounded fontSize="small" /></IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Task Title *"
              fullWidth
              size="small"
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register('title', { required: 'Title is required' })}
            />

            <TextField
              label="Description"
              fullWidth
              size="small"
              multiline
              rows={3}
              {...register('description')}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl size="small" fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      {STATUS_OPTIONS.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <FormControl size="small" fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select {...field} label="Priority">
                      {PRIORITY_OPTIONS.map((p) => (
                        <MenuItem key={p.value} value={p.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: p.color }} />
                            {p.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {members.length > 0 && (
                <Controller
                  name="assignee"
                  control={control}
                  render={({ field }) => (
                    <FormControl size="small" fullWidth>
                      <InputLabel>Assignee</InputLabel>
                      <Select {...field} label="Assignee">
                        <MenuItem value=""><em>Unassigned</em></MenuItem>
                        {members.map((m) => (
                          <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              )}
              <TextField
                label="Due Date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register('dueDate')}
              />
            </Box>

            {/* Labels */}
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label="Add Label"
                  size="small"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLabel(); } }}
                  sx={{ flex: 1 }}
                />
                <IconButton size="small" onClick={addLabel} color="primary">
                  <AddRounded />
                </IconButton>
              </Box>
              {labels.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {labels.map((l) => (
                    <Chip key={l} label={l} size="small" onDelete={() => setLabels(labels.filter((x) => x !== l))} />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={createTask.isPending}>
            {createTask.isPending ? 'Creating…' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
