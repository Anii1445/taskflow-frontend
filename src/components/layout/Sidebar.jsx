import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box, Typography, IconButton, Avatar, Tooltip,
  Divider, Button, useTheme, Chip,
} from '@mui/material';
import {
  DashboardRounded, FolderRounded, SettingsRounded,
  ChevronLeftRounded, ChevronRightRounded, LogoutRounded,
  LightModeRounded, DarkModeRounded, AddRounded, PeopleRounded
} from '@mui/icons-material';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import { useProjects } from '../../hooks/useProjects';
import { useLogout } from '../../hooks/useAuth';
import CreateProjectDialog from '../projects/CreateProjectDialog';

export default function Sidebar() {
  const theme = useTheme();
  const { user, isAdmin } = useAuthStore();
  const { sidebarOpen, toggleSidebar, darkMode, toggleDarkMode } = useUIStore();
  const { data: projectsData } = useProjects();
  const logoutMutation = useLogout();
  const [createOpen, setCreateOpen] = React.useState(false);

  const projects = projectsData?.projects || [];

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    borderRadius: 8,
    textDecoration: 'none',
    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
    background: isActive ? `${theme.palette.primary.main}18` : 'transparent',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontWeight: 600,
    fontSize: 14,
    transition: 'all 0.15s',
    '&:hover': { background: `${theme.palette.primary.main}12`, color: theme.palette.primary.main },
  });

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: sidebarOpen ? 260 : 72,
          bgcolor: 'background.paper',
          borderRight: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          zIndex: 1200,
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 64 }}>
          {sidebarOpen && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 32, height: 32, borderRadius: 2,
                background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>T</Typography>
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px', color: 'text.primary', whiteSpace: 'nowrap' }}>
                TaskFlow
              </Typography>
            </Box>
          )}
          {!sidebarOpen && (
            <Box sx={{
              width: 32, height: 32, borderRadius: 2,
              background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto',
            }}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>T</Typography>
            </Box>
          )}
          {sidebarOpen && (
            <IconButton size="small" onClick={toggleSidebar} sx={{ color: 'text.secondary' }}>
              <ChevronLeftRounded />
            </IconButton>
          )}
        </Box>

        <Divider />

        {/* Main Nav */}
        <Box sx={{ p: 1.5, flex: 1, overflow: 'auto' }}>
          {!sidebarOpen && (
            <Tooltip title="Expand" placement="right">
              <IconButton size="small" onClick={toggleSidebar} sx={{ color: 'text.secondary', mb: 1, mx: 'auto', display: 'flex' }}>
                <ChevronRightRounded />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title={!sidebarOpen ? 'Dashboard' : ''} placement="right">
            <NavLink to="/dashboard" style={navLinkStyle} end>
              <DashboardRounded fontSize="small" sx={{ flexShrink: 0 }} />
              {sidebarOpen && 'Dashboard'}
            </NavLink>
          </Tooltip>

           {isAdmin() && (
                      <Tooltip title={!sidebarOpen ? 'Members' : ''} placement="right">
                        <NavLink to="/members" style={navLinkStyle}>
                          <PeopleRounded fontSize="small" sx={{ flexShrink: 0 }} />
                          {sidebarOpen && 'Members'}
                        </NavLink>
                      </Tooltip>
                    )}

          <Tooltip title={!sidebarOpen ? 'Settings' : ''} placement="right">
            <NavLink to="/settings" style={navLinkStyle}>
              <SettingsRounded fontSize="small" sx={{ flexShrink: 0 }} />
              {sidebarOpen && 'Settings'}
            </NavLink>
          </Tooltip>

          {sidebarOpen && (
            <Box sx={{ mt: 3, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 1, textTransform: 'uppercase' }}>
                Projects
              </Typography>
              {isAdmin() && (
                <Tooltip title="New Project">
                  <IconButton size="small" onClick={() => setCreateOpen(true)} sx={{ color: 'primary.main', p: 0.5 }}>
                    <AddRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}

          {!sidebarOpen && isAdmin() && (
            <Tooltip title="New Project" placement="right">
              <IconButton size="small" onClick={() => setCreateOpen(true)} sx={{ color: 'primary.main', mb: 1, mx: 'auto', display: 'flex' }}>
                <AddRounded />
              </IconButton>
            </Tooltip>
          )}

          {projects.slice(0, 10).map((project) => (
            <Tooltip key={project._id} title={!sidebarOpen ? project.name : ''} placement="right">
              <NavLink to={`/projects/${project._id}`} style={navLinkStyle}>
                <Box sx={{
                  width: 8, height: 8, borderRadius: '50%',
                  bgcolor: project.color || 'primary.main', flexShrink: 0,
                }} />
                {sidebarOpen && (
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'inherit', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {project.name}
                  </Typography>
                )}
              </NavLink>
            </Tooltip>
          ))}
        </Box>

        <Divider />

        {/* User footer */}
        <Box sx={{ p: 1.5 }}>
          <Tooltip title={!sidebarOpen ? `${darkMode ? 'Light' : 'Dark'} mode` : ''} placement="right">
            <IconButton size="small" onClick={toggleDarkMode} sx={{ color: 'text.secondary', mb: 0.5, ...(sidebarOpen ? {} : { mx: 'auto', display: 'flex' }) }}>
              {darkMode ? <LightModeRounded fontSize="small" /> : <DarkModeRounded fontSize="small" />}
            </IconButton>
          </Tooltip>

          {sidebarOpen ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderRadius: 2, bgcolor: 'background.default' }}>
              <Avatar
                src={user?.avatar}
                alt={user?.name}
                sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}
              >
                {user?.name?.[0]}
              </Avatar>
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name}
                </Typography>
                <Chip
                  label={user?.role}
                  size="small"
                  sx={{
                    height: 16, fontSize: 10, fontWeight: 700,
                    bgcolor: user?.role === 'admin' ? 'rgba(108,99,255,0.15)' : 'rgba(67,233,123,0.15)',
                    color: user?.role === 'admin' ? 'primary.main' : 'success.main',
                    borderRadius: 1,
                  }}
                />
              </Box>
              <Tooltip title="Logout">
                <IconButton size="small" onClick={() => logoutMutation.mutate()} sx={{ color: 'text.secondary' }}>
                  <LogoutRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Tooltip title={`${user?.name} — Logout`} placement="right">
              <IconButton onClick={() => logoutMutation.mutate()} sx={{ p: 0.5, mx: 'auto', display: 'flex' }}>
                <Avatar src={user?.avatar} sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13 }}>
                  {user?.name?.[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <CreateProjectDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
