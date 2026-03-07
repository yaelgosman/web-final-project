import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routers/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
          <CssBaseline />
          <AppRoutes />
        </Box>
      </BrowserRouter>
    </AuthProvider>
  );
}