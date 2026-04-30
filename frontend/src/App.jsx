import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Tema y Contexto
import lightBrandTheme from './theme/lightBrandTheme';
import { TenantProvider } from './context/TenantContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Páginas
import Dashboard from './pages/Dashboard';
import Importacion from './pages/Importacion'; 
import Historial from './pages/Historial';
import PlanificacionView from './pages/PlanificacionView';

function App() {
  return (
    <TenantProvider>
      <ThemeProvider theme={lightBrandTheme}>
        <CssBaseline />
        <Router>
          <MainLayout>
            <Routes>
              {/* Rutas de Navegación */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/bdd" element={<Importacion />} />
              <Route path="/planificacion" element={<PlanificacionView />} />
              <Route path="/historial" element={<Historial />} />
            </Routes>
          </MainLayout>
        </Router>
      </ThemeProvider>
    </TenantProvider>
  );
}

export default App;
