import React from 'react';
import {
  Box,
  Container,
  Stack,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DiamondIcon from '@mui/icons-material/Diamond';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PetsIcon from '@mui/icons-material/Pets';

const Navbar: React.FC = () => {
  const filters = [
    { label: "Fine Dining", icon: <RestaurantIcon />, active: true },
    { label: "Informal Meals", icon: <LocalDiningIcon />, active: false },
    { label: "Hidden Gems", icon: <DiamondIcon />, active: false },
    { label: "Date Night", icon: <FavoriteBorderIcon />, active: false },
    { label: "Pet Friendly", icon: <PetsIcon />, active: false },
  ];

  return (
    <Box sx={{ py: 2, borderBottom: '1px solid #e0e0e0', mb: 2, bgcolor: 'white', zIndex: 10 }}>
      <Container maxWidth="lg">
        <Stack direction="row" spacing={2} alignItems="center" sx={{ overflowX: 'auto', pb: 1 }}>
          
          {/* Back Button */}
          <IconButton sx={{ border: '1px solid #ccc', color: '#000' }}>
            <ArrowBackIcon />
          </IconButton>

          {/* Filter Chips */}
          {filters.map((filter, index) => (
            <Chip
              key={index}
              icon={filter.icon}
              label={filter.label}
              clickable
              sx={{
                height: 40,
                px: 1,
                borderRadius: '20px',
                fontWeight: 600,
                backgroundColor: filter.active ? '#004d40' : 'transparent',
                color: filter.active ? '#fff' : '#000',
                border: filter.active ? 'none' : '1px solid #ccc',
                '& .MuiChip-icon': {
                  color: filter.active ? '#fff' : 'inherit',
                },
                '&:hover': {
                  backgroundColor: filter.active ? '#00382e' : '#f5f5f5',
                },
              }}
            />
          ))}

          <Box sx={{ flexGrow: 1 }} />

          {/* World/Region Selector */}
          {/* <Button 
            variant="outlined" 
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ 
              borderRadius: '20px', 
              color: 'black', 
              borderColor: '#ccc',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            World
          </Button> */}
        </Stack>
      </Container>
    </Box>
  );
};

export default Navbar;