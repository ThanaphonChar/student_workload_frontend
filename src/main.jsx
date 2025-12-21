/**
 * Application Entry Point
 * 
 * Hierarchy:
 * StrictMode → ThemeProvider (MUI) → AuthProvider (Context) → App
 * 
 * ThemeProvider ครอบทั้งแอป เพื่อให้:
 * - ทุก MUI component ใช้ font "ขวานทอง" โดยอัตโนมัติ
 * - ไม่ต้องกำหนด font ใน component แต่ละตัว
 * - Consistent typography ทั่วทั้งโปรเจค
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { theme } from './theme';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      {/* CssBaseline: Reset CSS และใช้ baseline styles ของ MUI */}
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
