import { Box, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routers/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';

const AppContent = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fdfbf7' }}>
      <CssBaseline />

      <AppRoutes />
    </Box>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}