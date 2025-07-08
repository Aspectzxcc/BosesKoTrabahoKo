import { createTheme } from '@mui/material/styles';

// Define the custom color palette based on the design specifications
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#2980b9', // Primary Blue (Belize Hole)
      light: '#e6f2fa', // Primary Light (Very Light Blue)
      dark: '#1f6396',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#e67e22', // Accent Orange (Carrot)
      light: '#f39c49',
      dark: '#d35400',
      contrastText: '#ffffff'
    },
    success: {
      main: '#27ae60', // Success Green (Nephritis)
      light: '#58d68d',
      dark: '#1e8449'
    },
    text: {
      primary: '#2c3e50', // Neutral Dark (Midnight Blue)
      secondary: '#7f8c8d', // Neutral Medium (Asbestos)
    },
    background: {
      default: '#e6f2fa', // Primary Light
      paper: '#ffffff',
      neutral: '#ecf0f1' // Neutral Light (Clouds)
    },
    divider: '#ecf0f1',
    grey: {
      50: '#ecf0f1',
      100: '#d5dbdb',
      200: '#bdc3c7',
      300: '#95a5a6',
      400: '#7f8c8d',
      500: '#7f8c8d',
      600: '#6c7b7d',
      700: '#566667',
      800: '#434b4d',
      900: '#2c3e50'
    }
  },
  typography: {
    fontFamily: '"Inter", "Poppins", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.2rem',
      lineHeight: 1.1,
      color: '#2980b9'
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      color: '#2980b9'
    },
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
      color: '#2980b9'
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      color: '#2c3e50'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: '#2c3e50'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
      lineHeight: 1.4,
      color: '#2c3e50'
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#2c3e50'
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.4,
      color: '#7f8c8d'
    },
    caption: {
      fontWeight: 300,
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#7f8c8d'
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      borderRadius: '12px'
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    // Button customizations
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight: 600,
          textTransform: 'none',
          padding: '12px 24px',
          fontSize: '1rem'
        },
        contained: {
          boxShadow: '0 4px 16px rgba(41, 128, 185, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(41, 128, 185, 0.4)',
            transform: 'translateY(-2px)'
          }
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px'
          }
        }
      }
    },
    // Card customizations
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(41, 128, 185, 0.1)'
        }
      }
    },
    // Input field customizations
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: '#ecf0f1',
            '& fieldset': {
              borderColor: '#7f8c8d'
            },
            '&:hover fieldset': {
              borderColor: '#2980b9'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2980b9',
              borderWidth: '2px'
            }
          }
        }
      }
    },
    // Chip/Tag customizations
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          backgroundColor: '#ecf0f1',
          color: '#7f8c8d',
          border: '1px solid #7f8c8d',
          '&.MuiChip-clickable:hover': {
            backgroundColor: '#2980b9',
            color: '#ffffff'
          }
        },
        filled: {
          backgroundColor: '#2980b9',
          color: '#ffffff'
        }
      }
    },
    // Progress indicator customizations
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '3px',
          backgroundColor: '#ecf0f1'
        },
        bar: {
          borderRadius: '3px',
          backgroundColor: '#2980b9'
        }
      }
    }
  }
});

export default customTheme;
