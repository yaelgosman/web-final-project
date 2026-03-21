// categories.ts
import type { ReactNode } from 'react';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DiamondIcon from '@mui/icons-material/Diamond';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PetsIcon from '@mui/icons-material/Pets';

export interface Category {
  id: string;
  label: string;
  icon: ReactNode;
}

export const CATEGORIES = [
  { id: 'all', label: 'All', icon: <RestaurantIcon /> },
  { id: 'fine_dining', label: "Fine Dining", icon: <RestaurantIcon /> },
  { id: 'informal', label: "Informal Meals", icon: <LocalDiningIcon /> },
  { id: 'hidden_gems', label: "Hidden Gems", icon: <DiamondIcon /> },
  { id: 'date_night', label: "Date Night", icon: <FavoriteBorderIcon /> },
  { id: 'pet_friendly', label: "Pet Friendly", icon: <PetsIcon /> },
];