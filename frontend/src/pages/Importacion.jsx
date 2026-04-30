import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, Snackbar, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import api from '../api';

const columnsMaestro = [
  { field: 'nombre', headerName: 'Nombre', width: 250, editable: true },
  { field: 'telefono', headerName: 'Teléfono', width: 150, editable: true },
  { field: 'direccion', headerName: 'Dirección', width: 300, editable: true },
  { field: 'comuna', headerName: 'Comuna', width: 150, editable: true },
];

const columnsTurnosListos = [
  { field: 'turno', headerName: 'Turno / Pestaña', width: 150 },
  { field: 'nombreExcel', headerName: 'Pasajero', width: 250 },
  { field: 'estado', headerName: 'Estado', width: 150, renderCell: () => <Chip label="Vinculado a BDD" color="success" size="small" /> },
];

const Importacion = () => {
  const [importType, setImportType] = useState('maestro'); // 'maestro' o 'turnos'

  const [maestroRows, setMaestroRows] = useState([]); // Datos cuando se sube BDD

  const [turnosListos, setTurnosListos] = useState([]); // Turnos que hicieron match perfecto
  const [conflictos, setConflictos] = useState([]); // Turnos con discrepancias
  const [pasajerosNuevos, setPasajerosNuevos] = useState([]); // Turnos sin match en BDD

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ open: false, text: '', type: 'success' });

  // -------- PARSEADORES --------
  const parsearMaestroPasajeros = (workbook) => {
    let rows = [];
    let globalId = 1;
    let sheetName = workbook.SheetNames.find(s => s.toUpperCase().includes('BDD'));

    // Los archivos .CSV no tienen "pestañas" con nombre, SheetJS les asigna "Sheet1" por defecto.
    // Si no encuentra 'BDD', asume que la primera pestaña (única en CSV) es la que se desea subir.
    if (!sheetName) {
      sheetName = workbook.SheetNames[0];
    }

    const rows2D = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    for (let i = 1; i < rows2D.length; i++) {
      const row = rows2D[i];
      if (!row || row.length === 0) continue;

      const nombre = row[0];
      const nombreStr = typeof nombre === 'string' ? nombre.trim() : String(nombre || '').trim();

      if (nombreStr === '' || nombreStr.toUpperCase() === 'NO UTILIZA EL SERVICIO') continue;

      rows.push({
        id: globalId++,
        nombre: nombreStr,
        telefono: row[1] ? String(row[1]).trim() : '',
        direccion: row[2] ? String(row[2]).trim() : '',
        comuna: row[3] ? String(row[3]).trim() : ''
      });
    }
    return rows;
  };

  const parsearTurnosSemanales = (workbook) => {
    let rows = [];
    let globalId = 1;

    workbook.SheetNames.forEach(sheetName => {
      const sheetUpper = sheetName.toUpperCase().trim();
      if (sheetUpper !== 'BDD' && !sheetUpper.includes('INSTRUCCIONES')) {
        const rows2D = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        for (let i = 1; i < rows2D.length; i++) {
          const row = rows2D[i];
          if (!row || row.length === 0) continue;

          const nombre = row[0];
          const nombreStr = typeof nombre === 'string' ? nombre.trim() : String(nombre || '').trim();
          if (nombreStr === '' || nombreStr.toUpperCase() === 'SIN DATO') continue;

          rows.push({
            id: globalId++,
            turno: sheetName,
            nombreExcel: nombreStr,
            telefonoExcel: row[1] ? String(row[1]).trim() : '',
            direccionExcel: row[2] ? String(row[2]).trim() : ''
          });
        }
      }
    });
    return rows;
  };

  // -------- MANEJO DE ARCHIVO --------
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        if (importType === 'maestro') {
          const parsed = parsearMaestroPasajeros(workbook);
          setMaestroRows(parsed);
          setTurnosListos([]);
          setConflictos([]);
          setPasajerosNuevos([]);
        } else {
          // Lógica de Planificación Semanal
          const parsedTurnos = parsearTurnosSemanales(workbook);

          // 1. Obtener Maestro de la BDD para hacer Match
          let bddPasajeros = [];
          try {
            const res = await api.get('/pasajeros');
            bddPasajeros = res.data;
          } catch (err) {
            console.error("No se pudo obtener la BDD de pasajeros", err);
          }

          const conf = [];
          const listos = [];
          const nuevos = [];

          // 2. Cruce de Datos
          parsedTurnos.forEach(filaExcel => {
            const pasajeroMatch = bddPasajeros.find(p => p.nombre.toUpperCase() === filaExcel.nombreExcel.toUpperCase());

            if (pasajeroMatch) {
              // Validar diferencias (solo si el excel trae datos y difieren)
              const telDiff = filaExcel.telefonoExcel && filaExcel.telefonoExcel !== pasajeroMatch.telefono;
              const dirDiff = filaExcel.direccionExcel && filaExcel.direccionExcel !== pasajeroMatch.direccion;

              if (telDiff || dirDiff) {
                conf.push({
                  ...filaExcel,
                  telefonoBDD: pasajeroMatch.telefono || 'Vacío',
                  direccionBDD: pasajeroMatch.direccion || 'Vacío',
                  pasajeroId: pasajeroMatch.id,
                  objPasajeroBase: pasajeroMatch // Guardamos para actualizar después
                });
              } else {
                listos.push({ ...filaExcel, pasajeroId: pasajeroMatch.id });
              }
            } else {
              nuevos.push(filaExcel);
            }
          });

          setTurnosListos(listos);
          setConflictos(conf);
          setPasajerosNuevos(nuevos);
          setMaestroRows([]);

          if (conf.length > 0 || nuevos.length > 0) {
            setMessage({ open: true, text: 'Atención: Se encontraron conflictos o pasajeros nuevos.', type: 'warning' });
          } else {
            setMessage({ open: true, text: 'Lectura perfecta. Todos los turnos cruzaron con el maestro.', type: 'success' });
          }
        }
      } catch (err) {
        console.error(err);
        setMessage({ open: true, text: err.message || 'Error al procesar el Excel.', type: 'error' });
      }
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = ''; // Reset input
  };

  // -------- GUARDAR MAESTRO (BDD) --------
  const handleSaveMaestro = async () => {
    setLoading(true);
    try {
      const dataToSave = maestroRows.map(({ id, ...rest }) => rest);
      await api.post('/pasajeros/batch', dataToSave);
      setMessage({ open: true, text: '¡Base de Datos Maestra actualizada exitosamente!', type: 'success' });
      setMaestroRows([]);
    } catch (error) {
      setMessage({ open: true, text: 'Error al guardar Maestro.', type: 'error' });
    }
    setLoading(false);
  };

  // -------- RESOLVER CONFLICTOS EN PANTALLA --------
  const resolverConflicto = async (row, accion) => {
    if (accion === 'ACTUALIZAR_BDD') {
      // Usamos el Endpoint batch de Spring Boot para sobreescribir los datos
      const pasajeroActualizado = {
        ...row.objPasajeroBase,
        telefono: row.telefonoExcel || row.objPasajeroBase.telefono,
        direccion: row.direccionExcel || row.objPasajeroBase.direccion
      };
      try {
        await api.post('/pasajeros/batch', [pasajeroActualizado]);
        setMessage({ open: true, text: `Maestro actualizado para ${row.nombreExcel}`, type: 'success' });
      } catch (e) {
        console.error(e);
        setMessage({ open: true, text: 'Error al actualizar base local', type: 'error' });
      }
    }

    // De cualquier forma (Actualizar o Ignorar), el turno ya está resuelto y pasa a la lista verde
    setTurnosListos([...turnosListos, { ...row }]);
    setConflictos(conflictos.filter(c => c.id !== row.id));
  };

  // Columnas para la tabla naranja de conflictos
  const columnsConflictos = [
    { field: 'nombreExcel', headerName: 'Pasajero', width: 200 },
    { field: 'telefonoExcel', headerName: 'Tel Excel', width: 130 },
    { field: 'telefonoBDD', headerName: 'Tel Maestro', width: 130 },
    { field: 'direccionExcel', headerName: 'Dir Excel', width: 200 },
    { field: 'direccionBDD', headerName: 'Dir Maestro', width: 200 },
    {
      field: 'acciones',
      headerName: 'Resolución de Discrepancia',
      width: 350,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="contained" color="warning" onClick={() => resolverConflicto(params.row, 'ACTUALIZAR_BDD')}>
            Sobrescribir Maestro
          </Button>
          <Button size="small" variant="outlined" color="primary" onClick={() => resolverConflicto(params.row, 'IGNORAR_EXCEL')}>
            Ignorar Excel
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Importación Inteligente</Typography>

      <Paper sx={{ p: 3, mb: 3, background: '#f8f9fa' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>1. Selecciona qué estás importando:</FormLabel>
          <RadioGroup row value={importType} onChange={(e) => {
            setImportType(e.target.value);
            setMaestroRows([]); setTurnosListos([]); setConflictos([]); setPasajerosNuevos([]);
          }}>
            <FormControlLabel value="maestro" control={<Radio color="primary" />} label="Base de Pasajeros (BDD)" />
            <FormControlLabel value="turnos" control={<Radio color="secondary" />} label="Planificación Semanal (Turnos)" />
          </RadioGroup>
        </FormControl>
      </Paper>

      <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2, background: importType === 'maestro' ? '#e8f5e9' : '#f3e5f5' }}>
        <Button variant="contained" component="label" color={importType === 'maestro' ? 'primary' : 'secondary'}>
          Subir Excel ({importType === 'maestro' ? 'BDD' : 'Turnos'})
          <input type="file" hidden accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
        </Button>
      </Paper>

      {/* RENDERIZADO 1: MAESTRO BDD */}
      {maestroRows.length > 0 && (
        <Paper sx={{ height: 500, width: '100%', mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>Vista Previa de la Base de Datos Maestra</Typography>
          <DataGrid rows={maestroRows} columns={columnsMaestro} disableRowSelectionOnClick />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" onClick={handleSaveMaestro} disabled={loading}>Guardar Maestro en Base Local</Button>
          </Box>
        </Paper>
      )}

      {/* RENDERIZADO 2: CONFLICTOS AL SUBIR TURNOS */}
      {conflictos.length > 0 && (
        <Paper sx={{ height: 400, width: '100%', mb: 3, p: 2, border: '2px solid orange' }}>
          <Typography variant="h6" color="warning.main" gutterBottom>⚠️ Discrepancias Detectadas (Excel vs Maestro)</Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>Estos pasajeros tienen un teléfono o dirección distinto en el Excel. Elige qué hacer.</Typography>
          <DataGrid rows={conflictos} columns={columnsConflictos} disableRowSelectionOnClick />
        </Paper>
      )}

      {/* RENDERIZADO 3: PASAJEROS INEXISTENTES EN EL MAESTRO */}
      {pasajerosNuevos.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Hay {pasajerosNuevos.length} pasajero(s) en la Planificación que NO existen en el Maestro. Debes agregarlos a la pestaña "BDD" y volver a importarla primero.
          Ejemplo: "{pasajerosNuevos[0].nombreExcel}"
        </Alert>
      )}

      {/* RENDERIZADO 4: TURNOS QUE HICIERON MATCH PERFECTO O QUE FUERON RESUELTOS */}
      {turnosListos.length > 0 && (
        <Paper sx={{ height: 400, width: '100%', mb: 3, p: 2 }}>
          <Typography variant="h6" color="success.main" gutterBottom>✅ Turnos Validados (Listos para crear la Semana)</Typography>
          <DataGrid rows={turnosListos} columns={columnsTurnosListos} disableRowSelectionOnClick />
          {conflictos.length === 0 && pasajerosNuevos.length === 0 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="secondary" onClick={() => alert('Falta conectar este Endpoint final!')}>Generar Horario Semanal Definitivo</Button>
            </Box>
          )}
        </Paper>
      )}

      <Snackbar open={message.open} autoHideDuration={6000} onClose={() => setMessage({ ...message, open: false })}>
        <Alert onClose={() => setMessage({ ...message, open: false })} severity={message.type} sx={{ width: '100%' }}>{message.text}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Importacion;
