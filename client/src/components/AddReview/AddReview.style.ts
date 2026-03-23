import { SxProps, Theme } from '@mui/material/styles';

export const paperContainer: SxProps<Theme> = {
  p: 3, 
  maxWidth: 600, 
  mx: 'auto', 
  mt: 4, 
  borderRadius: 2 
};

export const ratingContainer: SxProps<Theme> = {
  display: 'flex', 
  alignItems: 'center', 
  mb: 3 
};

export const ratingStars: SxProps<Theme> = {
  color: '#00a680'
};

export const uploadButton: SxProps<Theme> = {
  height: 150,
  borderStyle: 'dashed',
  borderColor: 'grey.400',
  color: 'grey.600',
  '&:hover': { borderStyle: 'dashed', borderColor: 'grey.600' }
};

export const imagePreviewContainer: SxProps<Theme> = {
  position: 'relative', 
  width: '100%', 
  maxHeight: 400, 
  overflow: 'hidden', 
  borderRadius: 2 
};

export const closeButton: SxProps<Theme> = {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(0,0,0,0.6)',
  color: 'white',
  '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
};

export const submitButton: SxProps<Theme> = {
  py: 1.5,
  backgroundColor: '#000',
  color: '#fff',
  fontWeight: 'bold',
  '&:hover': { backgroundColor: '#333' }
};