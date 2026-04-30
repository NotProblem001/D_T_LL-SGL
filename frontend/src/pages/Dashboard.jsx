import React, { useContext } from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TenantContext } from '../context/TenantContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { empresaActiva } = useContext(TenantContext);

  const modules = [
    {
      title: 'Maestro de Pasajeros',
      description: 'Sube y actualiza la base de datos central (Direcciones, Comunas, Teléfonos).',
      icon: '🗃️',
      path: '/bdd',
      color: '#31547f' // Azul profundo
    },
    {
      title: 'Planificación Semanal',
      description: 'Crea rutas semanales, filtra por turnos (Mañana/Tarde/Noche) y agrupa por comunas.',
      icon: '🗺️',
      path: '/planificacion',
      color: '#ed6f32' // Naranjo
    },
    {
      title: 'Costos y Facturación',
      description: 'Visualiza el historial de viajes realizados y exporta reportes de cobro.',
      icon: '💲',
      path: '/historial',
      color: '#68DFD5' // Turquesa
    }
  ];

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Resumen Operativo
        </Typography>
        <Typography variant="subtitle1" sx={{ fontSize: '1.1rem' }}>
          Gestionando logística para: <strong style={{ color: '#ed6f32' }}>{empresaActiva}</strong>
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {modules.map((mod, idx) => (
          <Grid item xs={12} md={4} key={idx}>
            <Paper 
              sx={{ 
                p: 5, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center',
                borderTop: `6px solid ${mod.color}`,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0px 12px 24px rgba(49, 84, 127, 0.12)',
                }
              }}
              onClick={() => navigate(mod.path)}
            >
              <Typography sx={{ fontSize: '4rem', mb: 2 }}>{mod.icon}</Typography>
              <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                {mod.title}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 4, flexGrow: 1 }}>
                {mod.description}
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ 
                  color: mod.color, 
                  borderColor: mod.color,
                  '&:hover': {
                    backgroundColor: `${mod.color}15`,
                    borderColor: mod.color
                  }
                }}
              >
                Ingresar al Módulo
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
