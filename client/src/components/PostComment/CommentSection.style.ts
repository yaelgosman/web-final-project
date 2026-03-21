import { SxProps, Theme } from '@mui/material/styles';

export const dialogContentContent: SxProps<Theme> = {
  p: 0, 
  minHeight: '300px'
};

export const listContainer: SxProps<Theme> = {
  width: '100%'
};

// A quick function to handle the dynamic background color when editing
export const getListItemStyle = (isEditing: boolean): SxProps<Theme> => ({
  bgcolor: isEditing ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
});

export const usernameText: SxProps<Theme> = {
  fontWeight: 'bold'
};

export const dateText: SxProps<Theme> = {
  mt: 0.5
};

export const inputAreaContainer: SxProps<Theme> = {
  p: 2, 
  bgcolor: '#f8f9fa'
};

export const commentTextField: SxProps<Theme> = {
  bgcolor: 'white'
};

export const submitButton: SxProps<Theme> = {
  ml: 2, 
  px: 3, 
  borderRadius: '20px', 
  textTransform: 'none', 
  bgcolor: '#000', 
  '&:hover': { bgcolor: '#333' }
};

export const cancelButton: SxProps<Theme> = {
  color: '#666'
};