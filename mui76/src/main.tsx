import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ThemeController from './theme/ThemeController';
import App from './App';
import './fonts.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeController>
      <App />
    </ThemeController>
  </StrictMode>,
);
