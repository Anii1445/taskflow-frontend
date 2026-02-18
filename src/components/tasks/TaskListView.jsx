import React from 'react';
import {
  Box, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  Chip, Avatar, IconButton, Tooltip, Skeleton, TableContainer,
  TextField, Select, MenuItem, FormControl, InputAdornment,
} from '@mui/material';
import { SearchRounded, FlagRounded, DeleteRounded } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useDeleteTask } from '../../hooks/useTasks';
import TaskDetailDialog from './TaskDetailDialog';
import useAuthStore from '../../store/authStore';

const STATUS_COLORS = {
  todo:        { bg: 'rgba(128,128,170,0.15)', color: '#8080aa', label: 'To Do' },
  in_progress: { bg: 'rgba(108,99,255,0.15)',  color: '#6c63ff', label: 'In Progress' },
  in_review:   { bg: 'rgba(247,151,30,0.15)',  color: '#f7971e', label: 'In Review' },
  done:        { bg: 'rgba(67,233,123,0.15)',   color: '#43e97b', label: 'Done' },
};

const PRIORITY_COLORS = { low: '#8080aa', medium: '#61dafb', high: '#f7971e', critical: '#ff6584' };

export default function TaskListView({ projectId, tasks, loading }) {
  const { user, isAdmin } = useAuthStore();
  const deleteTask = useDeleteTask(projectId);
  const [selectedTaskId, setSelectedTaskId] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [priorityFilter, setPriorityFilter] = React.useState('all');

  const filtered = tasks.filter((t) => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search tasks…"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, maxWidth: 300 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} displayEmpty>
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="in_review">In Review</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} displayEmpty>
            <MenuItem value="all">All Priorities</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </Select>
        </FormControl>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', alignSelf: 'center' }}>
          {filtered.length} task{filtered.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 700, fontSize: 12, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 } }}>
              <TableCell>Task</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Labels</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(7)].map((_, j) => <TableCell key={j}><Skeleton height={20} /></TableCell>)}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((task) => {
                const statusConfig = STATUS_COLORS[task.status];
                const isOverdue = task.dueDate && dayjs(task.dueDate).isBefore(dayjs()) && task.status !== 'done';
                return (
                  <TableRow
                    key={task._id}
                    hover
                    sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}
                    onClick={() => setSelectedTaskId(task._id)}
                  >
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {task.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusConfig?.label || task.status}
                        size="small"
                        sx={{ height: 22, fontSize: 11, fontWeight: 700, bgcolor: statusConfig?.bg, color: statusConfig?.color, borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <FlagRounded sx={{ fontSize: 14, color: PRIORITY_COLORS[task.priority] }} />
                        <Typography sx={{ fontSize: 12, color: PRIORITY_COLORS[task.priority], fontWeight: 600, textTransform: 'capitalize' }}>
                          {task.priority}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {task.assignee ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Avatar src={task.assignee.avatar} sx={{ width: 22, height: 22, fontSize: 11, bgcolor: 'primary.main' }}>
                            {task.assignee.name?.[0]}
                          </Avatar>
                          <Typography sx={{ fontSize: 12 }}>{task.assignee.name}</Typography>
                        </Box>
                      ) : (
                        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>—</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {task.dueDate ? (
                        <Typography sx={{ fontSize: 12, color: isOverdue ? 'error.main' : 'text.primary', fontWeight: isOverdue ? 700 : 400 }}>
                          {dayjs(task.dueDate).format('MMM D, YYYY')}
                        </Typography>
                      ) : (
                        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>—</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {task.labels?.slice(0, 2).map((l) => (
                          <Chip key={l} label={l} size="small" sx={{ height: 18, fontSize: 10, borderRadius: 1 }} />
                        ))}
                        {task.labels?.length > 2 && (
                          <Typography sx={{ fontSize: 11, color: 'text.secondary', alignSelf: 'center' }}>+{task.labels.length - 2}</Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {(isAdmin() || task.createdBy?._id === user?._id) && (
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete task?')) deleteTask.mutate(task._id); }}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteRounded sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedTaskId && (
        <TaskDetailDialog
          open={!!selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          taskId={selectedTaskId}
          projectId={projectId}
        />
      )}
    </Box>
  );
}
