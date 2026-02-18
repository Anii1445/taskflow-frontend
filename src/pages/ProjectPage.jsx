import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Button, IconButton, Chip, Avatar, AvatarGroup,
  Skeleton, Tabs, Tab, useTheme, Tooltip,
} from '@mui/material';
import {
  AddRounded, PeopleRounded, SettingsRounded,
  ViewKanbanRounded, ListRounded, HistoryRounded,
} from '@mui/icons-material';
import { useProject } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import KanbanBoard from '../components/board/KanbanBoard';
import TaskListView from '../components/tasks/TaskListView';
import ActivityFeed from '../components/tasks/ActivityFeed';
import CreateTaskDialog from '../components/tasks/CreateTaskDialog';
import ProjectSettingsDialog from '../components/projects/ProjectSettingsDialog';
import useAuthStore from '../store/authStore';

const TABS = [
  { label: 'Board', icon: <ViewKanbanRounded fontSize="small" /> },
  { label: 'List', icon: <ListRounded fontSize="small" /> },
  { label: 'Activity', icon: <HistoryRounded fontSize="small" /> },
];

export default function ProjectPage() {
  const { projectId } = useParams();
  const theme = useTheme();
  const { user, isAdmin } = useAuthStore();
  const [tab, setTab] = React.useState(0);
  const [createTaskOpen, setCreateTaskOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const { data: projectData, isLoading: projectLoading } = useProject(projectId);
  const { data: tasksData, isLoading: tasksLoading } = useTasks(projectId, { limit: 200 });

  const project = projectData?.project;
  const tasks = tasksData?.tasks || [];

  const isOwner = project?.owner?._id === user?._id;
  const canManage = isAdmin() || isOwner;

  if (projectLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton height={40} width={300} sx={{ mb: 1 }} />
        <Skeleton height={20} width={200} sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} width={280} height={400} sx={{ borderRadius: 3 }} />
          ))}
        </Box>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">Project not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Project Header */}
      <Box sx={{
        p: '20px 24px 0',
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: project.color || 'primary.main' }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>{project.name}</Typography>
            <Chip
              label={project.status}
              size="small"
              sx={{
                height: 20, fontSize: 11, fontWeight: 700,
                bgcolor: project.status === 'active' ? 'rgba(67,233,123,0.15)' : 'rgba(255,255,255,0.08)',
                color: project.status === 'active' ? 'success.main' : 'text.secondary',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AvatarGroup max={5} sx={{ '& .MuiAvatar-root': { width: 30, height: 30, fontSize: 12, border: `2px solid ${theme.palette.background.paper}` } }}>
              {project.members?.map((m) => (
                <Tooltip key={m._id} title={m.name}>
                  <Avatar src={m.avatar} sx={{ bgcolor: 'primary.main' }}>{m.name?.[0]}</Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
            <Button variant="contained" size="small" startIcon={<AddRounded />} onClick={() => setCreateTaskOpen(true)} sx={{ borderRadius: 2 }}>
              Add Task
            </Button>
            {canManage && (
              <IconButton size="small" onClick={() => setSettingsOpen(true)} sx={{ color: 'text.secondary' }}>
                <SettingsRounded fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {project.description && (
          <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 1.5, maxWidth: 600 }}>{project.description}</Typography>
        )}

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 40, '& .MuiTab-root': { minHeight: 40, fontWeight: 600, fontSize: 13 } }}>
          {TABS.map((t, i) => (
            <Tab key={t.label} label={t.label} icon={t.icon} iconPosition="start" />
          ))}
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {tab === 0 && <KanbanBoard projectId={projectId} tasks={tasks} loading={tasksLoading} />}
        {tab === 1 && <TaskListView projectId={projectId} tasks={tasks} loading={tasksLoading} />}
        {tab === 2 && <ActivityFeed projectId={projectId} />}
      </Box>

      <CreateTaskDialog
        open={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        projectId={projectId}
        members={project.members || []}
      />
      <ProjectSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        project={project}
      />
    </Box>
  );
}
