import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import api from '../api';

const columns = [
  { field: 'fecha', headerName: 'Fecha', width: 130, editable: true },
  { field: 'conductor', headerName: 'Conductor', width: 150, editable: true },
  { field: 'cliente', headerName: 'Cliente', width: 150, editable: true },
  { field: 'origen', headerName: 'Origen', width: 150, editable: true },
  { field: 'destino', headerName: 'Destino', width: 150, editable: true },
  { field: 'peajes', headerName: 'Peajes ($)', width: 110, editable: true, type: 'number' },
  { field: 'otrosCostos', headerName: 'Otros Costos ($)', width: 130, editable: true, type: 'number' },
  { field: 'total', headerName: 'Total ($)', width: 110, editable: true, type: 'number' },
];

const Importacion = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ open: false, text: '', type: 'success' });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const formattedRows = jsonData.map((row, index) => ({
        id: index + 1,
        fecha: row.Fecha || row.fecha || '',
        conductor: row.Conductor || row.conductor || '',
        cliente: row.Cliente || row.cliente || '',
        origen: row.Origen || row.origen || '',
        destino: row.Destino || row.destino || '',
        peajes: parseFloat(row.Peajes || row.peajes || 0),
        otrosCostos: parseFloat(row['Otros Costos'] || row.otrosCostos || 0),
        total: parseFloat(row.Total || row.total || 0),
      }));

      setRows(formattedRows);
    };
    reader.readAsArrayBuffer(file);
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const dataToSave = rows.map(({ id, ...rest }) => rest);
      await api.post('/viajes/batch', dataToSave);
      setMessage({ open: true, text: '¡Viajes guardados exitosamente en la base de datos!', type: 'success' });
      setRows([]);
    } catch (error) {
      console.error(error);
      setMessage({ open: true, text: 'Error al guardar en la base de datos.', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Importar Excel Diario</Typography>
      <Typography variant="body1" color="textSecondary" mb={3}>
        Sube el archivo Excel, revisa que los montos sean correctos y haz doble clic en cualquier celda para corregirla antes de guardar.
      </Typography>

      <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2, background: '#e8f5e9' }}>
        <Button variant="contained" component="label" color="primary">
          Seleccionar Archivo Excel
          <input type="file" hidden accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
        </Button>
        <Typography variant="body2" color="textSecondary">Formatos soportados: .xlsx, .csv</Typography>
      </Paper>

      {rows.length > 0 && (
        <Paper sx={{ height: 500, width: '100%', mb: 3, p: 2 }}>
          <DataGrid 
            rows={rows} 
            columns={columns} 
            processRowUpdate={processRowUpdate}
            experimentalFeatures={{ newEditingApi: true }}
            disableRowSelectionOnClick
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="secondary" size="large" onClick={handleSave} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar en Base de Datos'}
            </Button>
          </Box>
        </Paper>
      )}

      <Snackbar open={message.open} autoHideDuration={6000} onClose={() => setMessage({ ...message, open: false })}>
        <Alert onClose={() => setMessage({ ...message, open: false })} severity={message.type} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Importacion;
