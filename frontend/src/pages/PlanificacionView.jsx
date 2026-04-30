import React, { useState, useContext } from 'react';
import { Box, Typography, Paper, Tabs, Tab, TextField, Autocomplete, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { TenantContext } from '../context/TenantContext';

const turnos = ["MAÑANA", "TARDE", "NOCHE"];
const comunasDummy = ["Todas", "Quilicura", "Lampa", "Santiago Centro", "Maipú", "Pudahuel"];
const tablasSemanalesDummy = ["Semana 17 (20 al 25 Abril)", "Semana 18 (27 al 02 Mayo)", "Semana 19 (04 al 09 Mayo)"];

const PlanificacionView = () => {
  const { empresaActiva } = useContext(TenantContext);
  const [tabValue, setTabValue] = useState(0);
  const [comunaFiltro, setComunaFiltro] = useState("Todas");
  const [tablaActiva, setTablaActiva] = useState(tablasSemanalesDummy[0]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Función para Descargar el Excel
  const descargarSemana = () => {
    const wb = XLSX.utils.book_new();

    // Creamos una pestaña por cada turno
    turnos.forEach(turno => {
      // En un caso real, aquí filtras 'rows' donde r.turno === turno
      const datosTurno = rows.map(r => ({
        Nombre: r.nombre,
        Telefono: r.telefono,
        Dirección: r.direccion,
        Comuna: r.comuna
      }));
      
      const ws = XLSX.utils.json_to_sheet(datosTurno);
      XLSX.utils.book_append_sheet(wb, ws, turno);
    });

    XLSX.writeFile(wb, `Planificacion_${empresaActiva}_${tablaActiva}.xlsx`);
  };

  // Datos visuales falsos para el MVP
  const columns = [
    { field: 'nombre', headerName: 'Nombre Pasajero', width: 250 },
    { field: 'telefono', headerName: 'Teléfono', width: 150 },
    { field: 'direccion', headerName: 'Dirección', width: 300 },
    { field: 'comuna', headerName: 'Comuna', width: 150 },
    { field: 'estado', headerName: 'Estado', width: 150, renderCell: () => <Typography color="secondary.main" fontWeight="bold">Confirmado</Typography> },
  ];

  const rows = [
    { id: 1, nombre: 'Juan Pérez', telefono: '+56912345678', direccion: 'Calle Falsa 123', comuna: 'Quilicura' },
    { id: 2, nombre: 'Ana Gómez', telefono: '+56987654321', direccion: 'Avenida Siempre Viva 742', comuna: 'Lampa' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Planificación de Viajes ({empresaActiva})
          </Typography>
          <Typography variant="subtitle1">
            Organiza los recorridos de la semana por turno y zona.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="primary" onClick={descargarSemana}>
            📥 Descargar Semana (Excel)
          </Button>
          <Button variant="contained" color="primary">
            + Nueva Semana
          </Button>
        </Box>
      </Box>

      {/* Controles: Selector de Tabla y Filtros */}
      <Paper elevation={0} sx={{ mb: 3, overflow: 'hidden', border: 'none', backgroundColor: 'transparent' }}>
        
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          {/* Selector de la "Tabla Base de Datos / Semana" */}
          <Autocomplete
            options={tablasSemanalesDummy}
            value={tablaActiva}
            onChange={(e, newValue) => setTablaActiva(newValue)}
            disableClearable
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Seleccionar Semana de Trabajo" 
                variant="outlined" 
                sx={{ width: 350, backgroundColor: '#FFFFFF', borderRadius: 1 }}
              />
            )}
          />

          {/* Filtro por Comuna */}
          <Autocomplete
            options={comunasDummy}
            value={comunaFiltro}
            onChange={(e, newValue) => setComunaFiltro(newValue || "Todas")}
            disableClearable
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Filtrar por Comuna" 
                variant="outlined" 
                sx={{ width: 250, backgroundColor: '#FFFFFF', borderRadius: 1 }}
              />
            )}
          />
        </Box>

        {/* Pestañas de Turnos */}
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{ 
            backgroundColor: '#FFFFFF',
            border: '1px solid #6E6E6B',
            borderRadius: 2,
          }}
        >
          {turnos.map((turno, idx) => (
            <Tab key={idx} label={`TURNO ${turno}`} sx={{ fontSize: '1rem', py: 2 }} />
          ))}
        </Tabs>
      </Paper>

      {/* Contenedor Principal de la Tabla (MVP) */}
      <Paper 
        sx={{ 
          height: 500, 
          width: '100%', 
          p: 2, 
          backgroundColor: '#FFFFFF',
          border: '1px solid #6E6E6B',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: '#31547f' }}>
          Pasajeros - {turnos[tabValue]} ({tablaActiva})
        </Typography>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          disableRowSelectionOnClick
          sx={{ border: 'none' }}
        />
      </Paper>

    </Box>
  );
};

export default PlanificacionView;
