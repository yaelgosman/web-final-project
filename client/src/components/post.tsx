import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Rating,
  Dialog,
  DialogTitle,
  IconButton,
  Divider,
  Paper,
  Avatar
} from '@mui/material';
import likeService from '../services/likeService';

// Icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Favorite } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import type { PostType } from '../types/post';
import { getImageUrl } from '../utils/imageUtils';
import CommentsSection from './PostComment/CommentSection';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import commentService from '../services/commentService';
import { useAuth } from '../contexts/AuthContext';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isSaved, setIsSaved] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  // Fetch the likes count and status when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const likesData = await likeService.getPostLikes(post._id);
        setLikesCount(likesData.count);
        setIsSaved(likesData.hasLiked);

        // Also refresh comments count just in case it changed elsewhere
        const comments = await commentService.getCommentsByPost(post._id);
        setCommentsCount(comments.length);
      } catch (error) {
        console.error("Failed to fetch post stats:", error);
      }
    };
    fetchData();
  }, [post._id, user]);

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
        sx={{
          p: 0,
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'box-shadow 0.2s',
          '&:hover': {
            boxShadow: '0px 12px 36px rgba(0,0,0,0.08)',
          },
          bgcolor: '#fff',
          border: '1px solid #eaeaea',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          mb: 4
        }}
      >
        {/* Image Box */}
        <Box
          onClick={handleClickOpen}
          sx={{
            width: { xs: '100%', sm: 300, md: 340 },
            height: { xs: 240, sm: 'auto' },
            minHeight: { sm: 260 },
            flexShrink: 0,
            overflow: 'hidden',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <Box
            component="img"
            src={displayImage}
            alt={post.restaurant.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
              '&:hover': {
                transform: 'scale(1.04)'
              }
            }}
          />
        </Box>

        {/* Content Box */}
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a', fontFamily: 'Inter, sans-serif' }}>
              {post.restaurant.name}
            </Typography>
            <Button
              size="small"
              onClick={(e) => { e.stopPropagation(); handleSavePost(); }}
              startIcon={isSaved ? <Favorite color="error" /> : <FavoriteBorderIcon />}
              sx={{ mt: -0.5, mr: -1, color: isSaved ? '#d32f2f' : '#666', textTransform: 'none', fontWeight: 'bold' }}
            >
              {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
            </Button>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
            <Rating value={post.rating} readOnly size="small" sx={{ color: '#00aa6c' }} />
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#333' }}>{post.rating}</Typography>
          </Stack>

          <Typography variant="body2" sx={{ color: '#555', mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <RestaurantIcon fontSize="small" sx={{ color: '#888' }} />
            {post.category ? post.category.charAt(0).toUpperCase() + post.category.slice(1).replace('_', ' ') : 'Italian'} • {post.restaurant.city}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* User Review Excerpt */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
            <Avatar
              src={(post.userId && typeof post.userId !== 'string' && post.userId.profileImageUrl) ? getImageUrl(post.userId.profileImageUrl) : undefined}
              sx={{ width: 28, height: 28, border: '1px solid #eee' }}
            >
              {(post.userId && typeof post.userId !== 'string') ? post.userId.username?.charAt(0) : '?'}
            </Avatar>
            <Typography variant="body2" sx={{ color: '#444', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              "{post.text}"
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="outlined"
              size="small"
              sx={{ textTransform: 'none', borderRadius: 2, color: '#333', borderColor: '#ccc', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}
              startIcon={<ChatBubbleOutlineIcon />}
              onClick={handleClickOpen}
            >
              Read Comments ({commentsCount})
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Popup / Modal */}
      < Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0px 10px 40px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 800,
          pb: 1,
          fontFamily: 'Inter, sans-serif'
        }}>
          Comments on this review
          <IconButton onClick={handleClose} size="small" sx={{ color: '#999' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider />

        <CommentsSection
          post={post}
          onCommentCountChange={(newCount) => setCommentsCount(newCount)}
        />

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