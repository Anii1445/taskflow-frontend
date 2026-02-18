import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box, Typography, Avatar, Chip, IconButton, Tooltip, useTheme,
} from '@mui/material';
import {
  AttachFileRounded, CommentRounded, FlagRounded,
  CalendarTodayRounded,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import TaskDetailDialog from '../tasks/TaskDetailDialog';

const PRIORITY_CONFIG = {
  low:      { color: '#8080aa', label: 'Low' },
  medium:   { color: '#61dafb', label: 'Medium' },
  high:     { color: '#f7971e', label: 'High' },
  critical: { color: '#ff6584', label: 'Critical' },
};

export default function TaskCard({ task, projectId, isDragging }) {
  const theme = useTheme();
  const [detailOpen, setDetailOpen] = React.useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSorting } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSorting ? 0.5 : 1,
  };

  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isOverdue = task.dueDate && dayjs(task.dueDate).isBefore(dayjs()) && task.status !== 'done';

  const handleClick = (e) => {
    if (!isDragging) setDetailOpen(true);
  };

  return (
    <>
      <Box
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleClick}
        sx={{
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: isDragging ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: 1.5,
          cursor: 'grab',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: '0 2px 8px rgba(108,99,255,0.15)',
          },
          '&:active': { cursor: 'grabbing' },
        }}
      >
        {/* Priority & Labels */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1, flexWrap: 'wrap' }}>
          <Tooltip title={`${priority.label} priority`}>
            <FlagRounded sx={{ fontSize: 14, color: priority.color, flexShrink: 0 }} />
          </Tooltip>
          {task.labels?.slice(0, 2).map((label) => (
            <Chip
              key={label}
              label={label}
              size="small"
              sx={{ height: 16, fontSize: 10, fontWeight: 700, borderRadius: 1, px: 0.5 }}
            />
          ))}
        </Box>

        {/* Title */}
        <Typography sx={{
          fontSize: 13, fontWeight: 600, color: 'text.primary',
          lineHeight: 1.4, mb: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {task.title}
        </Typography>

        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {task.dueDate && (
              <Tooltip title={`Due ${dayjs(task.dueDate).format('MMM D')}`}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayRounded sx={{ fontSize: 12, color: isOverdue ? 'error.main' : 'text.secondary' }} />
                  <Typography sx={{ fontSize: 11, color: isOverdue ? 'error.main' : 'text.secondary', fontWeight: 600 }}>
                    {dayjs(task.dueDate).format('MMM D')}
                  </Typography>
                </Box>
              </Tooltip>
            )}
            {task.commentCount > 0 && (
              <Tooltip title={`${task.commentCount} comments`}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CommentRounded sx={{ fontSize: 12, color: 'text.secondary' }} />
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{task.commentCount}</Typography>
                </Box>
              </Tooltip>
            )}
            {task.attachments?.length > 0 && (
              <Tooltip title={`${task.attachments.length} files`}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AttachFileRounded sx={{ fontSize: 12, color: 'text.secondary' }} />
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{task.attachments.length}</Typography>
                </Box>
              </Tooltip>
            )}
          </Box>

          {task.assignee && (
            <Tooltip title={task.assignee.name}>
              <Avatar
                src={task.assignee.avatar}
                alt={task.assignee.name}
                sx={{ width: 22, height: 22, fontSize: 11, bgcolor: 'primary.main' }}
              >
                {task.assignee.name?.[0]}
              </Avatar>
            </Tooltip>
          )}
        </Box>
      </Box>

      <TaskDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        taskId={task._id}
        projectId={projectId}
      />
    </>
  );
}
