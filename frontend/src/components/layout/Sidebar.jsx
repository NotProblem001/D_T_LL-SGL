import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ drawerWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Inicio', icon: '📊', path: '/' },
    { text: 'Base de Datos', icon: '🗃️', path: '/bdd' },
    { text: 'Planificación', icon: '🗺️', path: '/planificacion' },
    { text: 'Facturación', icon: '💲', path: '/historial' },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#31547f', // Azul profundo
          color: '#FFFFFF',
          borderRight: 'none',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#FFFFFF', letterSpacing: 1 }}>
          DTLL
        </Typography>
      </Box>

      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path; 
          return (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => navigate(item.path)}
              sx={{
                mb: 1,
                mx: 1,
                width: 'calc(100% - 16px)',
                borderRadius: 2,
                backgroundColor: isActive ? 'rgba(104, 223, 213, 0.15)' : 'transparent',
                color: isActive ? '#68DFD5' : '#FFFFFF',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(104, 223, 213, 0.1)',
                  color: '#68DFD5',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, fontSize: '1.2rem', color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: isActive ? 600 : 400,
                }} 
              />
            </ListItem>
          )
        })}
      </List>
      
      <Box sx={{ mt: 'auto', p: 3 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', textAlign: 'center' }}>
          Donde Te Llevo © 2026
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
