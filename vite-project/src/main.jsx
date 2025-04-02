  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import App from './App';
  import { GoogleOAuthProvider } from '@react-oauth/google';
  import { ThemeProvider, CssBaseline } from '@mui/material';
  import theme from './theme';
  import './i18n'; // ← טעינת התמיכה בשפות

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  console.log('✅ main.jsx loaded with clientId:', clientId);

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
