import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';

export const postContainer: React.CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  width: '100%',  
  height: '100%', 
  display: 'flex',
  flexDirection: 'column'
};

export const reviewImage: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block'
};

export const noImagePlaceholder: React.CSSProperties = {
  width: '100%',
  height: '200px', 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f0f0f0',
  color: '#888'
};

export const reviewOverlay: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '10px',
  background: 'rgba(0, 0, 0, 0.6)', 
  color: 'white'
};

export const rating: React.CSSProperties = {
  fontSize: '14px',
  marginBottom: '4px',
  display: 'block'
};

export const restaurantName: React.CSSProperties = {
  margin: 0,
  fontWeight: 'bold',
  fontSize: '16px'
};

export const restaurantCity: React.CSSProperties = {
  margin: 0,
  fontSize: '12px',
  opacity: 0.9
};

export const actionsContainer: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  display: 'flex',
  gap: '8px',
  zIndex: 10 // Ensures buttons sit above the image
};

export const iconButtonSx: SxProps<Theme> = {
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: 'white',
  '&:hover': { 
    backgroundColor: 'rgba(0, 0, 0, 0.8)' 
  }
};