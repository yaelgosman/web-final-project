import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Grid,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Chip
} from '@mui/material';

// Icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import type { PostType } from '../types/post';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
  };

  const displayImage = post.imagePath || "https://via.placeholder.com/600x400?text=No+Image";

  return (
    <>
      <Paper
        elevation={0}
        onClick={handleClickOpen}
        sx={{
          cursor: 'pointer',
          p: 0,
          borderRadius: 2,
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Grid container spacing={4}>
          
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ position: 'relative', p: 1 }}>
              
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography variant="caption" sx={{ color: '#999', fontSize: '0.9rem' }}>
                  Posted: {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
                <Button
                  startIcon={<FavoriteBorderIcon />}
                  sx={{ 
                    color: '#000', 
                    textTransform: 'none', 
                    border: '1px solid #ccc', 
                    borderRadius: '20px',
                    px: 2
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Saved to favorites!");
                  }}
                >
                  Save
                </Button>
              </Stack>

              <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mt: 1, fontFamily: 'serif' }}>
                {post.restaurant.name}
              </Typography>

              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1, color: '#004d40', textDecoration: 'underline' }}>
                <LocationOnIcon fontSize="small" />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {post.restaurant.city}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                <Rating
                  value={post.rating}
                  readOnly
                  icon={<CircleIcon fontSize="inherit" />}
                  emptyIcon={<CircleIcon fontSize="inherit" />}
                  sx={{ color: '#00aa6c', fontSize: '1.2rem' }}
                />
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  User Rating
                </Typography>
              </Stack>

              <Typography variant="body1" sx={{ mt: 3, mb: 3, color: '#444', lineHeight: 1.6 }}>
                "{post.text}"
                {/* <Box component="span" sx={{ fontWeight: 'bold', cursor: 'pointer', ml: 1, textDecoration: 'underline' }}>
                  Read more
                </Box> */}
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Details
              </Typography>
              
              <Stack direction="row" spacing={2} alignItems="center">
                 <Chip 
                  icon={<RestaurantIcon />}
                  label="Verified Review" 
                  sx={{ bgcolor: '#f2fcf9', fontWeight: 'bold', fontSize: '0.9rem' }} 
                />
              </Stack>

            </Box>
          </Grid>

          {/* Right Column: Image */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'relative', height: '100%', minHeight: '300px' }}>
               <Box
                component="img"
                src={displayImage}
                alt={post.restaurant.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Popup / Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        scroll="paper"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Comments on this review
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <List>
            <ListItem alignItems="flex-start">
               <ListItemText 
                  primary={<Typography variant="subtitle2" color="text.secondary">No comments yet. Be the first to reply!</Typography>} 
               />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Post;