import React from 'react';
import {
  Dialog, DialogContent, Box, Typography, IconButton, Avatar, Chip,
  TextField, Button, Divider, Select, MenuItem, FormControl, InputLabel,
  Tooltip, CircularProgress, useTheme,
} from '@mui/material';
import {
  CloseRounded, FlagRounded, CalendarTodayRounded, PersonRounded,
  AttachFileRounded, SendRounded, DeleteRounded, EditRounded,
  LabelRounded,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTask, useUpdateTask, useDeleteTask } from '../../hooks/useTasks';
import { useComments, useAddComment, useDeleteComment } from '../../hooks/useComments';
import useAuthStore from '../../store/authStore';

dayjs.extend(relativeTime);

const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'critical'];
const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'done', label: 'Done' },
];
const PRIORITY_COLORS = { low: '#8080aa', medium: '#61dafb', high: '#f7971e', critical: '#ff6584' };

export default function TaskDetailDialog({ open, onClose, taskId, projectId }) {
  const theme = useTheme();
  const { user, isAdmin } = useAuthStore();
  const [comment, setComment] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState('');
  const [editDesc, setEditDesc] = React.useState('');

  const { data, isLoading } = useTask(projectId, taskId);
  const { data: commentsData } = useComments(taskId);
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);
  const addComment = useAddComment(taskId);
  const deleteComment = useDeleteComment(taskId);

  const task = data?.task;
  const comments = commentsData?.comments || [];

  React.useEffect(() => {
    if (task) {
      setEditTitle(task.title);
      setEditDesc(task.description || '');
    }
  }, [task]);

  const handleStatusChange = (status) => {
    updateTask.mutate({ taskId, status });
  };

  const handlePriorityChange = (priority) => {
    updateTask.mutate({ taskId, priority });
  };

  const handleSaveEdit = () => {
    updateTask.mutate({ taskId, title: editTitle, description: editDesc });
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    addComment.mutate({ content: comment });
    setComment('');
  };

  const handleDelete = () => {
    if (window.confirm('Delete this task?')) {
      deleteTask.mutate(taskId);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, maxHeight: '90vh' } }}>
      <DialogContent sx={{ p: 0 }}>
        {isLoading || !task ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', height: '80vh', overflow: 'hidden' }}>
            {/* Main Content */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 3, borderRight: `1px solid ${theme.palette.divider}` }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  {isEditing ? (
                    <TextField
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      fullWidth variant="standard"
                      sx={{ '& input': { fontSize: 20, fontWeight: 700 } }}
                    />
                  ) : (
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>{task.title}</Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)} sx={{ color: isEditing ? 'success.main' : 'text.secondary' }}>
                      <EditRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {(isAdmin() || task.createdBy?._id === user?._id) && (
                    <Tooltip title="Delete task">
                      <IconButton size="small" onClick={handleDelete} sx={{ color: 'error.main' }}>
                        <DeleteRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
                    <CloseRounded fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Description */}
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                Description
              </Typography>
              {isEditing ? (
                <TextField
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  fullWidth multiline rows={4} size="small" sx={{ mb: 3 }}
                  placeholder="Add a description..."
                />
              ) : (
                <Typography sx={{ fontSize: 14, color: task.description ? 'text.primary' : 'text.secondary', mb: 3, lineHeight: 1.7 }}>
                  {task.description || 'No description provided.'}
                </Typography>
              )}

              {isEditing && (
                <Button variant="contained" size="small" onClick={handleSaveEdit} sx={{ mb: 3 }}>Save Changes</Button>
              )}

              {/* Attachments */}
              {task.attachments?.length > 0 && (
                <>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Attachments ({task.attachments.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {task.attachments.map((att) => (
                      <Chip
                        key={att._id}
                        icon={<AttachFileRounded />}
                        label={att.name}
                        size="small"
                        onClick={() => window.open(att.url, '_blank')}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </>
              )}

              <Divider sx={{ mb: 3 }} />

              {/* Comments */}
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                Comments ({comments.length})
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                {comments.map((c) => (
                  <Box key={c._id} sx={{ display: 'flex', gap: 1.5 }}>
                    <Avatar src={c.author?.avatar} sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.main', flexShrink: 0 }}>
                      {c.author?.name?.[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{c.author?.name}</Typography>
                        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{dayjs(c.createdAt).fromNow()}</Typography>
                        {c.isEdited && <Typography sx={{ fontSize: 10, color: 'text.secondary', fontStyle: 'italic' }}>(edited)</Typography>}
                        {(c.author?._id === user?._id || isAdmin()) && (
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => deleteComment.mutate(c._id)} sx={{ color: 'text.secondary', p: 0.25 }}>
                              <DeleteRounded sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                      <Typography sx={{ fontSize: 13, color: 'text.primary', lineHeight: 1.6 }}>{c.content}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Add Comment */}
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Avatar src={user?.avatar} sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.main', flexShrink: 0 }}>
                  {user?.name?.[0]}
                </Avatar>
                <TextField
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  size="small"
                  fullWidth
                  multiline
                  maxRows={4}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                  InputProps={{
                    endAdornment: (
                      <IconButton size="small" onClick={handleAddComment} disabled={!comment.trim()} sx={{ color: 'primary.main' }}>
                        <SendRounded fontSize="small" />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
            </Box>

            {/* Sidebar */}
            <Box sx={{ width: 220, p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>Status</Typography>
                <FormControl size="small" fullWidth>
                  <Select value={task.status} onChange={(e) => handleStatusChange(e.target.value)}>
                    {STATUS_OPTIONS.map((s) => <MenuItem key={s.value} value={s.value} sx={{ fontSize: 13 }}>{s.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>Priority</Typography>
                <FormControl size="small" fullWidth>
                  <Select value={task.priority} onChange={(e) => handlePriorityChange(e.target.value)}>
                    {PRIORITY_OPTIONS.map((p) => (
                      <MenuItem key={p} value={p} sx={{ fontSize: 13 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FlagRounded sx={{ fontSize: 14, color: PRIORITY_COLORS[p] }} />
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>Assignee</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {task.assignee ? (
                    <>
                      <Avatar src={task.assignee.avatar} sx={{ width: 24, height: 24, fontSize: 11, bgcolor: 'primary.main' }}>
                        {task.assignee.name?.[0]}
                      </Avatar>
                      <Typography sx={{ fontSize: 13 }}>{task.assignee.name}</Typography>
                    </>
                  ) : (
                    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Unassigned</Typography>
                  )}
                </Box>
              </Box>

              {task.dueDate && (
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>Due Date</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <CalendarTodayRounded sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography sx={{ fontSize: 13 }}>{dayjs(task.dueDate).format('MMM D, YYYY')}</Typography>
                  </Box>
                </Box>
              )}

              {task.labels?.length > 0 && (
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>Labels</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {task.labels.map((l) => (
                      <Chip key={l} label={l} size="small" icon={<LabelRounded />} sx={{ height: 22, fontSize: 11 }} />
                    ))}
                  </Box>
                </Box>
              )}

              <Box>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', mb: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>Created by</Typography>
                <Typography sx={{ fontSize: 13 }}>{task.createdBy?.name}</Typography>
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{dayjs(task.createdAt).fromNow()}</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
