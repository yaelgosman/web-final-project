// categories.ts
import type { ReactNode } from 'react';

export interface Category {
  id: string;
  label: string;
  icon: string | ReactNode;
}

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', icon: '🍽️' },
  { id: 'italian', label: "Italian", icon: '🍕' },
  { id: 'asian', label: "Asian", icon: '🥢' },
  { id: 'middle_eastern', label: "Middle Eastern", icon: '🥙' },
  { id: 'street_food', label: "Street Food", icon: '🍔' },
  { id: 'bakery', label: "Bakery & Desserts", icon: '🍰' },
  { id: 'healthy', label: "Healthy & Vegan", icon: '🥗' },
];