import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import system76 from './theme/system76';
import App from './App';
import './fonts.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={system76}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
