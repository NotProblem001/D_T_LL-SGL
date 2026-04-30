import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🚕 DTLL Gestión
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ fontWeight: location.pathname === '/' ? 'bold' : 'normal', opacity: location.pathname === '/' ? 1 : 0.7 }}
          >
            Importar Diario
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/historial')}
            sx={{ fontWeight: location.pathname === '/historial' ? 'bold' : 'normal', opacity: location.pathname === '/historial' ? 1 : 0.7 }}
          >
            Historial
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
