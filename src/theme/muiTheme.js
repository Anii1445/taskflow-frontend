import { createTheme } from '@mui/material/styles';

const baseTheme = {
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 10 },
};

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary:   { main: '#6c63ff', light: '#9d98ff', dark: '#4b44cc', contrastText: '#fff' },
    secondary: { main: '#ff6584', light: '#ff8fa3', dark: '#cc3d5c', contrastText: '#fff' },
    success:   { main: '#43e97b', light: '#6ef29b', dark: '#2bb55d' },
    warning:   { main: '#f7971e', light: '#fab455', dark: '#c97108' },
    error:     { main: '#f05454', light: '#f47c7c', dark: '#c02020' },
    info:      { main: '#61dafb', light: '#8ce5fc', dark: '#26b3e0' },
    background: { default: '#0d0d14', paper: '#13131e' },
    divider: 'rgba(255,255,255,0.08)',
    text: { primary: '#e8e8f2', secondary: '#8080aa' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.07)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          '&:hover': { borderColor: 'rgba(108,99,255,0.3)' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 20px' },
        contained: { boxShadow: '0 4px 14px rgba(108,99,255,0.3)', '&:hover': { boxShadow: '0 6px 20px rgba(108,99,255,0.4)' } },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600 } },
    },
    MuiTextField: {
      styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 8 } } },
    },
    MuiDialog: {
      styleOverrides: { paper: { backgroundImage: 'none', border: '1px solid rgba(255,255,255,0.1)' } },
    },
    MuiTooltip: {
      styleOverrides: { tooltip: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '0.75rem' } },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*': { scrollbarWidth: 'thin', scrollbarColor: '#3a3a5c #0d0d14' },
        '*::-webkit-scrollbar': { width: '6px', height: '6px' },
        '*::-webkit-scrollbar-track': { background: '#0d0d14' },
        '*::-webkit-scrollbar-thumb': { background: '#3a3a5c', borderRadius: '3px', '&:hover': { background: '#5a5a8c' } },
      },
    },
  },
});

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary:   { main: '#6c63ff', light: '#9d98ff', dark: '#4b44cc', contrastText: '#fff' },
    secondary: { main: '#ff6584', light: '#ff8fa3', dark: '#cc3d5c', contrastText: '#fff' },
    success:   { main: '#2bb55d', light: '#43e97b', dark: '#1d8044' },
    warning:   { main: '#c97108', light: '#f7971e', dark: '#a05a06' },
    error:     { main: '#c02020', light: '#f05454', dark: '#8a0f0f' },
    background: { default: '#f4f4f8', paper: '#ffffff' },
    divider: 'rgba(0,0,0,0.08)',
    text: { primary: '#1a1a2e', secondary: '#60608a' },
  },
});
