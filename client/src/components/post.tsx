import React, { useEffect, useState } from 'react';
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
  Chip,
  Avatar
} from '@mui/material';
import likeService from '../services/likeService';

// Icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Favorite } from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import type { PostType } from '../types/post';
import { getImageUrl } from '../utils/imageUtils';
import CommentsSection from './PostComment/CommentSection';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [open, setOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Fetch the likes count and status when the component mounts
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const data = await likeService.getPostLikes(post._id);
        setLikesCount(data.count);
        setIsSaved(data.hasLiked);
      } catch (error) {
        console.error("Failed to fetch likes:", error);
      }
    };
    fetchLikes();
  }, [post._id]);

  const handleSavePost = async () => {
    setIsSaved(!isSaved);
    setLikesCount(prev => isSaved ? prev - 1 : prev + 1);

    try {
      await likeService.toggleLike(post._id, isSaved);
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setIsSaved(isSaved);
      setLikesCount(prev => isSaved ? prev + 1 : prev - 1);
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
  };

  const displayImage = getImageUrl(post.imagePath) || "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?_=20210521171500";

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

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <Avatar
                  src={(post.userId && typeof post.userId !== 'string' && post.userId.profileImageUrl) ? getImageUrl(post.userId.profileImageUrl) : undefined}
                  sx={{ width: 32, height: 32, bgcolor: '#004d40' }}
                >
                  {(post.userId && typeof post.userId !== 'string') ? post.userId.username?.charAt(0) : '?'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                    {(post.userId && typeof post.userId !== 'string') ? post.userId.username : 'Unknown User'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  startIcon={isSaved ? <Favorite color="error" /> : <FavoriteBorderIcon />}
                  sx={{
                    color: '#000',
                    textTransform: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '20px',
                    px: 2,
                    height: '32px',
                    fontSize: '0.8rem'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSavePost();
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
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  icon={<RestaurantIcon />}
                  label="Verified Review"
                  sx={{ bgcolor: '#f2fcf9', fontWeight: 'bold', fontSize: '0.9rem' }}
                />
              </Stack>

            </Box >
          </Grid >

          {/* Right Column: Image */}
          < Grid size={{ xs: 12, md: 5 }}>
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
          </Grid >
        </Grid >
      </Paper >

      {/* Popup / Modal */}
      < Dialog
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

        <CommentsSection postId={post._id} />

        {/* <DialogContent>
          <List>
            <ListItem alignItems="flex-start">
               <ListItemText 
                  primary={<Typography variant="subtitle2" color="text.secondary">No comments yet. Be the first to reply!</Typography>} 
               />
            </ListItem>
          </List>
        </DialogContent> */}
      </Dialog >
    </>
  );
};

export default Post;