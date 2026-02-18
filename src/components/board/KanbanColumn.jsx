import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Box, Typography, Skeleton, IconButton, Tooltip } from '@mui/material';
import { AddRounded } from '@mui/icons-material';
import TaskCard from './TaskCard';
import CreateTaskDialog from '../tasks/CreateTaskDialog';

export default function KanbanColumn({ column, tasks, projectId, loading }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [createOpen, setCreateOpen] = React.useState(false);

  return (
    <>
      <Box
        sx={{
          width: 280,
          minWidth: 280,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: isOver ? column.color : 'divider',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: isOver ? `0 0 0 2px ${column.color}40` : 'none',
        }}
      >
        {/* Column Header */}
        <Box sx={{
          p: '12px 14px 10px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid', borderColor: 'divider',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: column.color }} />
            <Typography sx={{ fontWeight: 700, fontSize: 13, color: 'text.primary' }}>
              {column.label}
            </Typography>
            <Box sx={{
              minWidth: 20, height: 20, borderRadius: 1, px: 0.75,
              bgcolor: `${column.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: column.color }}>
                {loading ? '…' : tasks.length}
              </Typography>
            </Box>
          </Box>
          <Tooltip title={`Add task to ${column.label}`}>
            <IconButton size="small" onClick={() => setCreateOpen(true)} sx={{ color: 'text.secondary', p: 0.5, '&:hover': { color: column.color } }}>
              <AddRounded sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Tasks */}
        <Box
          ref={setNodeRef}
          sx={{
            flex: 1, overflowY: 'auto', p: 1.5,
            display: 'flex', flexDirection: 'column', gap: 1.5,
            minHeight: 80,
          }}
        >
          {loading
            ? [...Array(2)].map((_, i) => <Skeleton key={i} height={100} sx={{ borderRadius: 2 }} />)
            : tasks.map((task) => (
                <TaskCard key={task._id} task={task} projectId={projectId} />
              ))
          }
        </Box>
      </Box>

      <CreateTaskDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        projectId={projectId}
        defaultStatus={column.id}
      />
    </>
  );
}
