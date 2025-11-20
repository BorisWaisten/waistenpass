import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5A67D8',
      light: '#7F9CF5',
      dark: '#3C378C'
    },
    secondary: {
      main: '#F6AD55'
    },
    background: {
      default: '#F7FAFC',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#1A202C',
      secondary: '#4A5568'
    }
  },
  typography: {
    fontFamily: 'var(--font-primary, "Poppins", "Inter", sans-serif)',
    h1: {
      fontWeight: 700
    },
    h2: {
      fontWeight: 600
    },
    h3: {
      fontWeight: 600
    },
    body1: {
      color: '#4A5568'
    },
    body2: {
      color: '#4A5568'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 600
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0px 20px 45px rgba(90, 103, 216, 0.08)'
        }
      }
    }
  }
});

export default theme;
