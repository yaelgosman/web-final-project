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
import { CATEGORIES } from '../constants/categories';


interface NavbarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <Box sx={{ py: 2, borderBottom: '1px solid #e0e0e0', mb: 2, bgcolor: 'white', zIndex: 10 }}>
      <Container maxWidth="md">
        <Stack direction="row" spacing={2} alignItems="center" sx={{ overflowX: 'auto', pb: 1 }}>
          
          {/* This is for the future if the categories will overflow the navbar width - to be able to scroll between them */}
          {/* <IconButton sx={{ border: '1px solid #ccc', color: '#000' }}>
            <ArrowBackIcon />
          </IconButton> */}

          {CATEGORIES.map((cat) => {
            const isActive = cat.id === selectedCategory;

            return (
              <Chip
                key={cat.id}
                icon={cat.icon}
                label={cat.label}
                clickable
                onClick={() => onSelectCategory(cat.id)} // Pass the ID back to parent
                sx={{
                  height: 40,
                  px: 1,
                  borderRadius: '20px',
                  fontWeight: 600,
                  backgroundColor: isActive ? '#004d40' : 'transparent',
                  color: isActive ? '#fff' : '#000',
                  border: isActive ? 'none' : '1px solid #ccc',
                  '& .MuiChip-icon': {
                    color: isActive ? '#fff' : 'inherit',
                  },
                  '&:hover': {
                    backgroundColor: isActive ? '#00382e' : '#f5f5f5',
                  },
                }}
              />
            );
          })}

          <Box sx={{ flexGrow: 1 }} />

          {/* <Button 
            variant="outlined" 
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ borderRadius: '20px', color: 'black', borderColor: '#ccc', textTransform: 'none', fontWeight: 600 }}
          >
            World
          </Button> */}
        </Stack>
      </Container>
    </Box>
  );
};

export default Navbar;