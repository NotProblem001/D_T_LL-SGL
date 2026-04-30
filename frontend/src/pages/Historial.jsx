import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import api from '../api';

const Historial = () => {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedViaje, setSelectedViaje] = useState(null);
  const [adjuntos, setAdjuntos] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchViajes();
  }, []);

  const fetchViajes = async () => {
    try {
      const response = await api.get('/viajes');
      setViajes(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(viajes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Viajes");
    XLSX.writeFile(workbook, "Reporte_Viajes_DTLL.xlsx");
  };

  const handleOpenAdjuntos = async (viajeId) => {
    setSelectedViaje(viajeId);
    setOpenModal(true);
    try {
      const response = await api.get(`/viajes/${viajeId}/adjuntos`);
      setAdjuntos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadAdjunto = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedViaje) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post(`/viajes/${selectedViaje}/adjuntos`, formData);
      handleOpenAdjuntos(selectedViaje);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadAdjunto = (adjuntoId) => {
    window.open(`http://localhost:8080/api/viajes/adjuntos/${adjuntoId}/download`, '_blank');
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'fecha', headerName: 'Fecha', width: 130 },
    { field: 'conductor', headerName: 'Conductor', width: 150 },
    { field: 'cliente', headerName: 'Cliente', width: 150 },
    { field: 'total', headerName: 'Total ($)', width: 110 },
    {
      field: 'acciones',
      headerName: 'Facturas',
      width: 150,
      renderCell: (params) => (
        <Button size="small" variant="outlined" onClick={() => handleOpenAdjuntos(params.row.id)}>
          📎 Adjuntos
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Historial de Viajes</Typography>
        <Button variant="contained" color="primary" onClick={handleExportExcel}>
          📥 Exportar a Excel
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%', p: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid rows={viajes} columns={columns} disableRowSelectionOnClick />
        )}
      </Paper>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Documentos Adjuntos (Viaje #{selectedViaje})</DialogTitle>
        <DialogContent dividers>
          {adjuntos.length === 0 ? (
            <Typography variant="body2" color="textSecondary">No hay facturas adjuntas a este viaje.</Typography>
          ) : (
            <Box sx={{ mb: 3 }}>
              {adjuntos.map((doc) => (
                <Box key={doc.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body2">{doc.nombreArchivo}</Typography>
                  <Button size="small" onClick={() => handleDownloadAdjunto(doc.id)}>Ver / Descargar</Button>
                </Box>
              ))}
            </Box>
          )}

          <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
            Subir Nueva Factura (PDF/JPG)
            <input type="file" hidden onChange={handleUploadAdjunto} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Historial;
