import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem, FormControl } from '@mui/material';
import { TenantContext } from '../../context/TenantContext';

const GlobalTopbar = ({ drawerWidth }) => {
  const { empresaActiva, setEmpresaActiva } = useContext(TenantContext);

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        width: `calc(100% - ${drawerWidth}px)`, 
        ml: `${drawerWidth}px`,
        backgroundColor: '#FAFAF7', // Blanco cálido
        color: '#31547f', // Texto Azul profundo
        boxShadow: '0px 2px 10px rgba(49, 84, 127, 0.05)', // Sombra humana y profesional
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight="bold">
          Gestión Operativa
        </Typography>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 250 }}>
          <Select
            value={empresaActiva}
            onChange={(e) => setEmpresaActiva(e.target.value)}
            sx={{
              color: '#31547f',
              fontWeight: 600,
              backgroundColor: '#FFFFFF',
              borderRadius: 2,
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: '#6E6E6B', // Borde gris medio
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#31547f',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#68DFD5', // Hover en Turquesa
              },
              '.MuiSvgIcon-root ': {
                fill: '#31547f',
              }
            }}
          >
            <MenuItem value="Transportes DTLL">Transportes DTLL</MenuItem>
            <MenuItem value="Logistica Alpha">Logística Alpha</MenuItem>
            <MenuItem value="Servicios Sur">Servicios Sur</MenuItem>
          </Select>
        </FormControl>
      </Toolbar>
    </AppBar>
  );
};

export default GlobalTopbar;
