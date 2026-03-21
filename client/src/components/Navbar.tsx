import React from 'react';
import {
  Box,
  Container,
  Stack,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import { CATEGORIES } from '../constants/categories';


interface NavbarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <Box sx={{
      position: 'sticky',
      top: 64,
      zIndex: 1000,
      bgcolor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #f0f0f0',
      py: 1.5
    }}>
      <Container maxWidth="lg">
        <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', '::-webkit-scrollbar': { display: 'none' } }}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.label}
              onClick={() => onSelectCategory(cat.id)}
              sx={{
                px: 1,
                height: 40,
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                bgcolor: selectedCategory === cat.id ? '#004d40' : '#f5f5f5',
                color: selectedCategory === cat.id ? '#fff' : '#666',
                border: 'none',
                transition: '0.2s',
                '&:hover': { bgcolor: selectedCategory === cat.id ? '#00332c' : '#e0e0e0' }
              }}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default Navbar;