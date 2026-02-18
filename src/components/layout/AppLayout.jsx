import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import useUIStore from '../../store/uiStore';

export default function AppLayout() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          overflow: 'auto',
          ml: sidebarOpen ? '260px' : '72px',
          transition: 'margin-left 0.3s ease',
          p: 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
