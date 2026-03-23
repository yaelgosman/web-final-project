import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
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
import CircleIcon from '@mui/icons-material/Circle';
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
        elevation={2}
        sx={{
          p: 0,
          borderRadius: 4,
          overflow: 'hidden',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 30px rgba(0,0,0,0.12)',
          },
          bgcolor: '#fff',
          border: '1px solid #eee'
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Avatar
              src={(post.userId && typeof post.userId !== 'string' && post.userId.profileImageUrl) ? getImageUrl(post.userId.profileImageUrl) : undefined}
              sx={{ width: 40, height: 40, bgcolor: '#004d40', border: '2px solid #fff' }}
            >
              {(post.userId && typeof post.userId !== 'string') ? post.userId.username?.charAt(0) : '?'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: '#333' }}>
                {(post.userId && typeof post.userId !== 'string') ? post.userId.username : 'Unknown User'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#888', fontSize: '0.75rem' }}>
                {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </Typography>
            </Box>
          </Stack>

          {/* Title and Rating */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a', fontFamily: 'Inter, sans-serif' }}>
              {post.restaurant.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f0f9f6', px: 1, py: 0.5, borderRadius: 1.5 }}>
              <Rating
                value={post.rating}
                readOnly
                size="small"
                icon={<CircleIcon fontSize="inherit" />}
                emptyIcon={<CircleIcon fontSize="inherit" />}
                sx={{ color: '#00aa6c' }}
              />
              <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 'bold', color: '#00aa6c' }}>
                {post.rating}
              </Typography>
            </Box>
          </Stack>

          {/* Text Content */}
          <Typography variant="body1" sx={{ mt: 1.5, mb: 2, color: '#444', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.text}
          </Typography>
        </Box>

        {/* Image */}
        <Box 
          onClick={handleClickOpen}
          sx={{ 
            height: '240px', 
            width: '100%', 
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
              transition: 'transform 0.5s',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
        </Box>

        {/* Footer Actions */}
        <Stack direction="row" spacing={2} sx={{ p: 1.5, borderTop: '1px solid #f5f5f5' }} alignItems="center">
          <Button
            size="small"
            startIcon={isSaved ? <Favorite color="error" /> : <FavoriteBorderIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleSavePost();
            }}
            sx={{ 
              color: isSaved ? '#d32f2f' : '#666',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: isSaved ? 'rgba(211, 47, 47, 0.04)' : 'rgba(0,0,0,0.04)' }
            }}
          >
            {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
          </Button>

          <Button
            size="small"
            startIcon={<ChatBubbleOutlineIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleClickOpen();
            }}
            sx={{ 
              color: '#666',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
            }}
          >
            {commentsCount} {commentsCount === 1 ? 'Comment' : 'Comments'}
          </Button>

          <Box sx={{ flexGrow: 1 }} />
          
          <Chip
            size="small"
            icon={<RestaurantIcon sx={{ fontSize: '0.9rem !important' }} />}
            label="Verified"
            sx={{ bgcolor: '#f2fcf9', color: '#00aa6c', fontWeight: 'bold' }}
          />
        </Stack>
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
          postId={post._id} 
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