// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl', // Set right-to-left for Arabic
  palette: {
    primary: {
      main: '#F91C45', // Pulse Academy - Main Red
      light: '#FF6F8E', // A lighter shade of the main red
      dark: '#b80226ff',  // A darker shade for contrast
    },
    secondary: {
      main: '#FFFFFF', // Pulse Academy - White
    },
    background: {
      default: '#F5F5F5', // A light grey for the page background
      paper: '#FFFFFF',   // White for cards and surfaces
    },
    text: {
      primary: '#212121', // Dark grey for main text
      secondary: '#757575', // Lighter grey for secondary text
    },
    success: {
      main: '#4CAF50', // Green for success messages
    },
    warning: {
      main: '#FF9800', // Orange for warnings
    },
    error: {
      main: '#F91C45', // Using the brand's main red for errors
    },
  },
  typography: {
    fontFamily: 'Cairo, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default theme;