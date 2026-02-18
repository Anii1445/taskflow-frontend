import React from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  Avatar, AvatarGroup, Chip, LinearProgress, Skeleton,
  useTheme,
} from '@mui/material';
import {
  AddRounded, FolderRounded, CheckCircleRounded,
  HourglassEmptyRounded, BarChartRounded,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import useAuthStore from '../store/authStore';
import { useProjects } from '../hooks/useProjects';
import CreateProjectDialog from '../components/projects/CreateProjectDialog';
import dayjs from 'dayjs';

const StatCard = ({ icon, label, value, color, loading }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
      <Box sx={{
        width: 48, height: 48, borderRadius: 2.5,
        bgcolor: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {React.cloneElement(icon, { sx: { color, fontSize: 22 } })}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 500 }}>{label}</Typography>
        {loading
          ? <Skeleton width={40} height={32} />
          : <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>{value}</Typography>
        }
      </Box>
    </CardContent>
  </Card>
);

const COLORS = ['#6c63ff', '#43e97b', '#f7971e', '#ff6584'];
const STATUS_LABELS = { todo: 'To Do', in_progress: 'In Progress', in_review: 'In Review', done: 'Done' };

export default function DashboardPage() {
  const theme = useTheme();
  const { user, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = React.useState(false);

  const { data: projectsData, isLoading } = useProjects();
  const projects = projectsData?.projects || [];

  // Stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'active').length;

  // Chart data (mock per project)
  const barData = projects.slice(0, 6).map((p) => ({
    name: p.name.length > 10 ? p.name.slice(0, 10) + '…' : p.name,
    tasks: p.taskCount || 0,
  }));

  const pieData = [
    { name: 'Active', value: activeProjects },
    { name: 'Archived', value: totalProjects - activeProjects },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>{user?.name?.split(' ')[0]}</Box> 👋
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
            {dayjs().format('dddd, MMMM D, YYYY')}
          </Typography>
        </Box>
        {isAdmin() && (
          <Button variant="contained" startIcon={<AddRounded />} onClick={() => setCreateOpen(true)} sx={{ borderRadius: 2 }}>
            New Project
          </Button>
        )}
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<FolderRounded />} label="Total Projects" value={totalProjects} color="#6c63ff" loading={isLoading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<CheckCircleRounded />} label="Active Projects" value={activeProjects} color="#43e97b" loading={isLoading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<HourglassEmptyRounded />} label="Archived" value={totalProjects - activeProjects} color="#f7971e" loading={isLoading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<BarChartRounded />} label="Team Members" value={user?.role === 'admin' ? '—' : '—'} color="#ff6584" loading={isLoading} />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        {/* Projects List */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2.5 }}>Your Projects</Typography>
              {isLoading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} height={72} sx={{ mb: 1, borderRadius: 2 }} />)
              ) : projects.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <FolderRounded sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.4 }} />
                  <Typography sx={{ color: 'text.secondary' }}>No projects yet</Typography>
                  {isAdmin() && (
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => setCreateOpen(true)}>
                      Create your first project
                    </Button>
                  )}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {projects.map((project) => (
                    <Box
                      key={project._id}
                      onClick={() => navigate(`/projects/${project._id}`)}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 2, p: 2,
                        borderRadius: 2, border: '1px solid', borderColor: 'divider',
                        cursor: 'pointer', transition: 'all 0.15s',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(108,99,255,0.04)' },
                      }}
                    >
                      <Box sx={{ width: 10, height: 40, borderRadius: 1, bgcolor: project.color || 'primary.main', flexShrink: 0 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {project.name}
                          </Typography>
                          <Chip
                            label={project.status}
                            size="small"
                            sx={{
                              height: 18, fontSize: 10, fontWeight: 700,
                              bgcolor: project.status === 'active' ? 'rgba(67,233,123,0.15)' : 'rgba(255,255,255,0.08)',
                              color: project.status === 'active' ? 'success.main' : 'text.secondary',
                              borderRadius: 1,
                            }}
                          />
                        </Box>
                        <Typography sx={{ fontSize: 12, color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {project.description || 'No description'}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                        <Typography sx={{ fontSize: 18, fontWeight: 800, color: 'primary.main' }}>{project.taskCount || 0}</Typography>
                        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>tasks</Typography>
                      </Box>
                      <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 26, height: 26, fontSize: 11 } }}>
                        {project.members?.map((m) => (
                          <Avatar key={m._id} src={m.avatar} alt={m.name} sx={{ bgcolor: 'primary.main' }}>
                            {m.name?.[0]}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>Tasks per Project</Typography>
              {isLoading ? <Skeleton height={160} /> : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                    <ReTooltip contentStyle={{ background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} />
                    <Bar dataKey="tasks" fill="#6c63ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>Project Status</Typography>
              {isLoading ? <Skeleton height={120} variant="circular" sx={{ mx: 'auto' }} /> : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ResponsiveContainer width={120} height={120}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value">
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <Box>
                    {pieData.map((item, i) => (
                      <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[i] }} />
                        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{item.name}</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{item.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <CreateProjectDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  );
}
