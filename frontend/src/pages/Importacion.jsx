import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, Snackbar, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import api from '../api';

const columnsCostos = [
  { field: 'fecha', headerName: 'Fecha', width: 130, editable: true },
  { field: 'conductor', headerName: 'Conductor', width: 150, editable: true },
  { field: 'cliente', headerName: 'Cliente', width: 150, editable: true },
  { field: 'origen', headerName: 'Origen', width: 150, editable: true },
  { field: 'destino', headerName: 'Destino', width: 150, editable: true },
  { field: 'peajes', headerName: 'Peajes ($)', width: 110, editable: true, type: 'number' },
  { field: 'otrosCostos', headerName: 'Otros Costos ($)', width: 130, editable: true, type: 'number' },
  { field: 'total', headerName: 'Total ($)', width: 110, editable: true, type: 'number' },
];

const columnsPasajeros = [
  { field: 'turno', headerName: 'Turno', width: 120, editable: false },
  { field: 'area', headerName: 'Área', width: 180, editable: true },
  { field: 'cargo', headerName: 'Cargo', width: 180, editable: true },
  { field: 'nombre', headerName: 'Nombre', width: 200, editable: true },
  { field: 'telefono', headerName: 'Teléfono', width: 120, editable: true },
  { field: 'direccion', headerName: 'Dirección', width: 200, editable: true },
];

const Importacion = () => {
  const [importType, setImportType] = useState('pasajeros'); // 'pasajeros' o 'costos'
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
      
      let formattedRows = [];
      let globalId = 1;

      if (importType === 'pasajeros') {
        // Lógica Avanzada para Planilla de Pasajeros con celdas basura y múltiples filas de cabecera
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          // Opción { header: 1 } nos devuelve un Array 2D (matrices de filas x columnas), ideal para Excels "sucios"
          const rows2D = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // 1. Omitir las primeras 4 filas (índices 0, 1, 2, 3). Empezamos desde la 5 (índice 4).
          for (let i = 4; i < rows2D.length; i++) {
            const row = rows2D[i];
            if (!row || row.length === 0) continue; // Saltar filas completamente vacías

            const area = row[0]; // Columna A
            const cargo = row[1]; // Columna B
            const nombreManana = row[2]; // Columna C
            const nombreTarde = row[3]; // Columna D
            const nombreNoche = row[4]; // Columna E

            // 7. FILTRO IMPORTANTE DE PARADA
            if (typeof area === 'string') {
              const areaUpper = area.toUpperCase();
              if (
                areaUpper.includes('LICENCIA MEDICA') ||
                areaUpper.includes('VACACIONES') ||
                areaUpper.includes('CENTRO DE COSTO')
              ) {
                // Detenemos la extracción de esta hoja al encontrar la zona "basura"
                break;
              }
            }

            // Helpers para limpiar espacios e identificar si la celda tiene valor real
            const cleanStr = (val) => (val ? String(val).trim() : '');

            // 3. Evaluar turno MAÑANA (Columna C)
            if (cleanStr(nombreManana) !== '') {
              formattedRows.push({
                id: globalId++,
                turno: "MAÑANA",
                area: cleanStr(area),
                cargo: cleanStr(cargo),
                nombre: cleanStr(nombreManana),
                telefono: '', // Campos extra listos para ser editados manualmentte
                direccion: ''
              });
            }

            // 4. Evaluar turno TARDE (Columna D)
            if (cleanStr(nombreTarde) !== '') {
              formattedRows.push({
                id: globalId++,
                turno: "TARDE",
                area: cleanStr(area),
                cargo: cleanStr(cargo),
                nombre: cleanStr(nombreTarde),
                telefono: '',
                direccion: ''
              });
            }

            // 5. Evaluar turno NOCHE (Columna E)
            if (cleanStr(nombreNoche) !== '') {
              formattedRows.push({
                id: globalId++,
                turno: "NOCHE",
                area: cleanStr(area),
                cargo: cleanStr(cargo),
                nombre: cleanStr(nombreNoche),
                telefono: '',
                direccion: ''
              });
            }
          }
        });
      } else {
        // Lógica para Reporte de Costos (Lee la primera pestaña)
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        formattedRows = jsonData.map((row) => ({
          id: globalId++,
          fecha: row.Fecha || row.fecha || '',
          conductor: row.Conductor || row.conductor || '',
          cliente: row.Cliente || row.cliente || '',
          origen: row.Origen || row.origen || '',
          destino: row.Destino || row.destino || '',
          peajes: parseFloat(row.Peajes || row.peajes || 0),
          otrosCostos: parseFloat(row['Otros Costos'] || row.otrosCostos || 0),
          total: parseFloat(row.Total || row.total || 0),
        }));
      }

      setRows(formattedRows);
    };
    reader.readAsArrayBuffer(file);
    
    // Reset input
    e.target.value = null;
  };

  // Esta función es vital: permite al usuario hacer doble clic en celdas vacías o erróneas en el DataGrid
  // y corregirlas manualmente. El DataGrid devuelve la nueva fila (newRow) actualizada.
  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Removemos el ID temporal del Frontend antes de enviar a Spring Boot
      const dataToSave = rows.map(({ id, ...rest }) => rest);
      
      const endpoint = importType === 'pasajeros' ? '/pasajeros/batch' : '/viajes/batch';
      await api.post(endpoint, dataToSave);
      
      setMessage({ open: true, text: '¡Datos importados y guardados correctamente!', type: 'success' });
      setRows([]);
    } catch (error) {
      console.error(error);
      setMessage({ open: true, text: 'Error de comunicación con el servidor local.', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Importación Dinámica de Datos</Typography>
      
      <Paper sx={{ p: 3, mb: 3, background: '#f8f9fa', border: '1px solid #e0e0e0' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ fontWeight: 'bold', color: '#333' }}>1. Selecciona el Tipo de Documento Excel a importar:</FormLabel>
          <RadioGroup 
            row 
            value={importType} 
            onChange={(e) => {
              setImportType(e.target.value);
              setRows([]); // Limpiamos la tabla si cambia el tipo
            }}
            sx={{ mt: 1 }}
          >
            <FormControlLabel value="pasajeros" control={<Radio color="primary" />} label="Planilla de Pasajeros/Turnos" />
            <FormControlLabel value="costos" control={<Radio color="primary" />} label="Reporte de Costos de Viaje" />
          </RadioGroup>
        </FormControl>
      </Paper>

      <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2, background: importType === 'pasajeros' ? '#e3f2fd' : '#e8f5e9' }}>
        <Button variant="contained" component="label" color={importType === 'pasajeros' ? 'secondary' : 'primary'}>
          Subir Excel ({importType === 'pasajeros' ? 'Pasajeros' : 'Costos'})
          <input type="file" hidden accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
        </Button>
        <Typography variant="body2" color="textSecondary">
          Si hay celdas vacías, haz doble clic en la tabla inferior para rellenarlas antes de guardar.
        </Typography>
      </Paper>

      {rows.length > 0 && (
        <Paper sx={{ height: 500, width: '100%', mb: 3, p: 2 }}>
          <DataGrid 
            rows={rows} 
            columns={importType === 'pasajeros' ? columnsPasajeros : columnsCostos} 
            processRowUpdate={processRowUpdate}
            experimentalFeatures={{ newEditingApi: true }}
            disableRowSelectionOnClick
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" size="large" onClick={handleSave} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Datos en Base Local'}
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
