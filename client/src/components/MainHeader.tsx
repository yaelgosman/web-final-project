import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  InputBase,
  Container,
  Stack,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit'; // For "Review"
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CookingReviewLogo from './CookingLogo';

const MainHeader: React.FC = () => {
  return (
    <AppBar position="static" color="inherit" elevation={1} sx={{ borderBottom: '1px solid #e0e0e0' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '64px', justifyContent: 'space-between' }}>
          
          <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }}>
            <CookingReviewLogo />
          </Stack>

          <Box 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '24px',
              px: 2,
              py: 0.5,
              width: '400px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
            }}
          >
            <SearchIcon sx={{ color: '#666', mr: 1 }} />
            <InputBase
              placeholder="Search"
              sx={{ flex: 1, fontSize: '0.95rem' }}
            />
          </Box>

          {/* 3. Navigation Actions */}
          <Stack direction="row" alignItems="center" spacing={1}>
            
            <Button color="inherit" sx={{ textTransform: 'none', fontWeight: 600, display: { xs: 'none', md: 'flex' } }}>
              Discover
            </Button>

            <Button color="inherit" sx={{ textTransform: 'none', fontWeight: 600, display: { xs: 'none', md: 'flex' } }}>
              Review
            </Button>
            
            <Stack direction="row" spacing={0.5}>
               <IconButton><NotificationsNoneIcon /></IconButton>
            </Stack>

            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#000', 
                color: '#fff', 
                borderRadius: '20px', 
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3,
                '&:hover': { bgcolor: '#333' }
              }}
            >
              Sign in
            </Button>
          </Stack>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainHeader;