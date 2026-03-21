import { Box, CssBaseline, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import AppRoutes from './routers/AppRoutes';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fdfbf7' }}>
      <CssBaseline />

      <AppRoutes />

      {isAuthenticated && (
        <Fab
          variant="extended" // הופך את הכפתור לרחב עם טקסט
          onClick={() => navigate('/addReview')}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            bgcolor: '#004d40',
            color: 'white',
            px: 3,
            '&:hover': { bgcolor: '#00332c', transform: 'scale(1.05)' },
            transition: '0.3s',
            boxShadow: '0 8px 24px rgba(0,77,64,0.3)'
          }}
        >
          <AddIcon sx={{ mr: 1 }} />
          Share a Review
        </Fab>
      )}
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