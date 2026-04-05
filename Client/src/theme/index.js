// theme.js
import { createTheme } from "@mui/material/styles";

export const getTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: '#ff7f11', // bright orange
              contrastText: '#ffffff',
            },
            secondary: {
              main: '#ff4da6', // pink
              contrastText: '#ffffff',
            },
            error: {
              main: '#e63946', // red-ish error
              contrastText: '#fff',
            },
            background: {
              default: '#fff7f0', // light orange background
              paper: '#ffffff',
            },
            text: {
              primary: '#1a1a1a',
              secondary: '#555555',
            },
            grey: {
              100: '#fdf2f2',
              200: '#fde8e8',
              300: '#fbd5d5',
              400: '#f8a5a5',
              500: '#f06c6c',
              600: '#d64545',
            },
          }
        : {
            primary: {
              main: '#ff944d', // darker orange
              contrastText: '#ffffff',
            },
            secondary: {
              main: '#ff66b3', // darker pink
            },
            error: {
              main: '#f28b82',
              contrastText: '#fff',
            },
            background: {
              default: '#1a0e0b',
              paper: '#2a1f1a',
            },
            text: {
              primary: '#ffffff',
              secondary: '#ffccd5',
            },
          }),
    },

    typography: {
      fontFamily: `"Poppins", "Inter", "Roboto", "Arial", sans-serif`,
      h1: { fontSize: '2.2rem', fontWeight: 700 },
      h2: { fontSize: '1.75rem', fontWeight: 700 },
      h3: { fontSize: '1.5rem', fontWeight: 600 },
      h4: { fontSize: '1.25rem', fontWeight: 600 },
      h5: { fontSize: '1rem', fontWeight: 600 },
      h6: { fontSize: '0.95rem', fontWeight: 500 },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
      text: {
        primary: '#1a1a1a',
        secondary: '#555555',
      },
    },

    shape: {
      borderRadius: 14,
    },

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: 'none',
            boxShadow: 'none',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: mode === 'light' ? '#ff944d' : '#ff7f11',
              color: '#fff',
              transform: 'scale(1.02)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            },
            '&:active': {
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.08)',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#e63946' : '#f28b82',
            },
            '&.Mui-focused.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#e63946' : '#f28b82',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === 'light'
                ? '0 2px 6px rgba(0,0,0,0.05)'
                : '0 1px 4px rgba(0,0,0,0.6)',
            backgroundColor: mode === 'light' ? '#fff' : '#2a1f1a',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              mode === 'light'
                ? '0 4px 12px rgba(0,0,0,0.05)'
                : '0 4px 12px rgba(0,0,0,0.2)',
            backgroundColor: mode === 'light' ? '#fff' : '#2a1f1a',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow:
                mode === 'light'
                  ? '0 6px 16px rgba(0,0,0,0.08)'
                  : '0 6px 16px rgba(0,0,0,0.25)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: 12,
            borderRadius: 8,
            backgroundColor: mode === 'light' ? '#ff944d' : '#ff66b3',
            color: '#fff',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: mode === 'light' ? '#fff' : '#2c1f1a',
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            fontFamily: '"Inter", "Poppins", "Roboto", sans-serif',
            backgroundColor: mode === 'light' ? '#fff' : '#2a1f1a',
            color: mode === 'light' ? '#1a1a1a' : '#fff',
          },
          columnHeader: {
            backgroundColor: mode === 'light' ? '#ffe6d5' : '#442b21',
            color: mode === 'light' ? '#1a1a1a' : '#fddde6',
            fontWeight: 600,
            fontSize: '0.875rem',
            borderBottom: `1px solid ${mode === 'light' ? '#ffd8a6' : '#3f3f46'}`,
          },
          cell: {
            color: mode === 'light' ? '#1a1a1a' : '#fddde6',
            fontSize: '0.85rem',
          },
          row: {
            '&:hover': {
              backgroundColor: mode === 'light' ? '#fff2e6' : '#3a2419',
            },
          },
          footerContainer: {
            backgroundColor: mode === 'light' ? '#fff2e6' : '#3a2419',
            borderTop: `1px solid ${mode === 'light' ? '#ffd8a6' : '#3a2419'}`,
          },
          columnSeparator: {
            color: mode === 'light' ? '#ffc699' : '#552f23',
          },
          virtualScroller: {
            backgroundColor: mode === 'light' ? '#fff' : '#2a1f1a',
          },
        },
      },
    },
  });