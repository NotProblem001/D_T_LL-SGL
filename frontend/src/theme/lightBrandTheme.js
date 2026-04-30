import { createTheme } from '@mui/material/styles';

const lightBrandTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#31547f', // Azul profundo
    },
    secondary: {
      main: '#68DFD5', // Turquesa
    },
    error: {
      main: '#ed6f32', // Naranjo (Acciones primarias, alertas)
    },
    warning: {
      main: '#FFC914', // Oro Real
    },
    background: {
      default: '#FAFAF7', // Blanco cálido
      paper: '#FFFFFF',   // Blanco puro
    },
    text: {
      primary: '#31547f', // Títulos y textos pesados en Azul profundo
      secondary: '#6E6E6B', // Gris medio para subtítulos y bordes
    },
    divider: '#6E6E6B',
  },
  typography: {
    fontFamily: '"Inter", "Source Sans 3", "DM Sans", sans-serif',
    h4: {
      fontWeight: 700, // Bold
      color: '#31547f',
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500, // Medium
      color: '#6E6E6B',
    },
    body1: {
      fontWeight: 400,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #6E6E6B',
          boxShadow: '0px 4px 12px rgba(49, 84, 127, 0.06)', // Sombra humana y suave
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 16px',
        },
        containedPrimary: {
          backgroundColor: '#ed6f32', // Naranjo para llamar a la acción
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#d85d26',
          }
        }
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          color: '#6E6E6B',
          '&.Mui-selected': {
            color: '#68DFD5', // Turquesa para destacar
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#68DFD5',
          height: 3,
        }
      }
    }
  },
});

export default lightBrandTheme;
