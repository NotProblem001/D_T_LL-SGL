import React from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import GlobalTopbar from './GlobalTopbar';
import Sidebar from './Sidebar';

const drawerWidth = 260;

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <CssBaseline />
      <GlobalTopbar drawerWidth={drawerWidth} />
      <Sidebar drawerWidth={drawerWidth} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 4, pt: 5 }}>
        <Toolbar /> {/* Spacer invisible para que el contenido no quede debajo del Topbar */}
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
