import React from 'react';
import { Box, Typography, Avatar, Skeleton, useTheme } from '@mui/material';
import {
  AddTaskRounded, EditRounded, DeleteRounded, SwapHorizRounded,
  CommentRounded, AttachFileRounded, PersonAddRounded, PersonRemoveRounded,
  FolderRounded,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useProjectActivity } from '../../hooks/useProjects';

dayjs.extend(relativeTime);

const ACTION_CONFIG = {
  created_task:    { icon: <AddTaskRounded />, color: '#43e97b', text: (m) => `created task "${m.taskTitle}"` },
  updated_task:    { icon: <EditRounded />,    color: '#61dafb', text: (m) => `updated task "${m.taskTitle}"` },
  deleted_task:    { icon: <DeleteRounded />,  color: '#ff6584', text: (m) => `deleted task "${m.taskTitle}"` },
  changed_status:  { icon: <SwapHorizRounded />, color: '#f7971e', text: (m) => `moved "${m.taskTitle}" from ${m.from?.replace('_', ' ')} → ${m.to?.replace('_', ' ')}` },
  added_comment:   { icon: <CommentRounded />, color: '#6c63ff', text: (m) => `commented on "${m.taskTitle}"` },
  uploaded_file:   { icon: <AttachFileRounded />, color: '#bd34fe', text: (m) => `uploaded "${m.fileName}" to "${m.taskTitle}"` },
  added_member:    { icon: <PersonAddRounded />, color: '#43e97b', text: (m) => `added ${m.memberName} to the project` },
  removed_member:  { icon: <PersonRemoveRounded />, color: '#ff6584', text: (m) => `removed a member from the project` },
  created_project: { icon: <FolderRounded />,  color: '#f7971e', text: (m) => `created project "${m.projectName}"` },
  updated_project: { icon: <EditRounded />,    color: '#61dafb', text: (m) => `updated project settings` },
};

export default function ActivityFeed({ projectId }) {
  const theme = useTheme();
  const { data, isLoading } = useProjectActivity(projectId, { limit: 50 });
  const logs = data?.logs || [];

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        {[...Array(6)].map((_, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Skeleton variant="circular" width={36} height={36} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="60%" height={20} />
              <Skeleton width="30%" height={16} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (logs.length === 0) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">No activity yet</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 700 }}>
      <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 3 }}>Activity Log</Typography>
      <Box sx={{ position: 'relative' }}>
        {/* Timeline line */}
        <Box sx={{
          position: 'absolute', left: 17, top: 0, bottom: 0, width: 2,
          bgcolor: 'divider', borderRadius: 1,
        }} />

        {logs.map((log, i) => {
          const config = ACTION_CONFIG[log.action];
          if (!config) return null;

          return (
            <Box key={log._id} sx={{ display: 'flex', gap: 2, mb: 3, position: 'relative' }}>
              {/* Icon */}
              <Box sx={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                bgcolor: `${config.color}20`, border: `2px solid ${config.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1,
              }}>
                {React.cloneElement(config.icon, { sx: { fontSize: 16, color: config.color } })}
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, pt: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Avatar src={log.user?.avatar} sx={{ width: 20, height: 20, fontSize: 10, bgcolor: 'primary.main' }}>
                      {log.user?.name?.[0]}
                    </Avatar>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{log.user?.name}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                    {config.text(log.meta)}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5 }}>
                  {dayjs(log.createdAt).fromNow()}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
