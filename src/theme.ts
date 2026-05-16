import { createTheme, alpha } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e',
      dark: '#115e59',
      light: '#5eead4',
    },
    secondary: {
      main: '#d97706',
    },
    background: {
      default: '#f4f7f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    divider: alpha('#0f172a', 0.1),
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: '"Segoe UI", "Trebuchet MS", sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h4: {
      fontWeight: 750,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 750,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          overflowY: 'scroll',
          scrollbarGutter: 'stable',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});