import { createTheme } from '@mui/material/styles';

const darkTechTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00E5FF', // Cyan eléctrico para acciones principales
    },
    secondary: {
      main: '#39FF14', // Verde Neón para acentos
    },
    background: {
      default: '#0A0A0A', // Casi negro para el fondo
      paper: '#141414',   // Gris super oscuro para las tarjetas
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#909090',
    },
    divider: 'rgba(0, 229, 255, 0.1)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '0.05em',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(0, 229, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
          fontWeight: 600,
          letterSpacing: '0.05em',
        },
        containedPrimary: {
          color: '#000', // Texto negro sobre botón cyan brilla más
          boxShadow: '0 0 10px rgba(0, 229, 255, 0.4)',
          '&:hover': {
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.8)',
            backgroundColor: '#33EEFF'
          }
        }
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: '0.1em',
          '&.Mui-selected': {
            textShadow: '0 0 10px rgba(0, 229, 255, 0.6)',
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: '"Consolas", "Fira Code", "Roboto Mono", monospace',
        }
      }
    }
  },
});

export default darkTechTheme;
