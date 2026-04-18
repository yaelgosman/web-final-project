import React, { useState, useEffect } from 'react';
import {
  Typography,
  Stack,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  DialogContent,
  DialogActions
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../contexts/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';
import * as styles from './CommentSection.style';
import { CommentType } from '../../types/comment';
import commentService from '../../services/commentService';
import { PostType } from '../../types/post';

interface CommentsSectionProps {
  post: PostType;
  onCommentCountChange?: (newCount: number) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ post, onCommentCountChange }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await commentService.getCommentsByPost(post._id);
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };
    fetchComments();
  }, [post._id]);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    try {
      if (editingCommentId) {
        // Edit
        const updatedComment = await commentService.editComment(editingCommentId, commentText);
        
        // Update local state by replacing the old comment with the new one
        setComments((prev) => 
          prev.map((c) => (c._id === editingCommentId ? updatedComment : c))
        );
        setEditingCommentId(null);

      } else {
        // Create
        const newComment = await commentService.createComment(post._id, commentText);
        
        // Adds the new comment to the bottom of the list instantly
        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        
        if (onCommentCountChange) {
          onCommentCountChange(updatedComments.length);
        }
      }
      setCommentText("");
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Something went wrong while posting your comment.");
    }
  };

  const handleEditClick = (comment: CommentType) => {
    setEditingCommentId(comment._id);
    setCommentText(comment.text);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Delete this comment?")) return;
    
    try {
      await commentService.deleteComment(commentId);
      
      // Remove it from the UI instantly
      const updatedComments = comments.filter((c) => c._id !== commentId);
      setComments(updatedComments);

      if (onCommentCountChange) {
        onCommentCountChange(updatedComments.length);
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <>
      <DialogContent dividers sx={styles.dialogContentContent}>
        <List sx={styles.listContainer}>
          {comments.length === 0 ? (
            <ListItem alignItems="flex-start" sx={{ py: 3, textAlign: 'center' }}>
              <ListItemText primary={<Typography variant="body2" color="text.secondary" sx={{ width: '100%', textAlign: 'center' }}>No comments yet. Be the first to reply!</Typography>} />
            </ListItem>
          ) : (
            comments.map((comment) => (
              <ListItem 
                key={comment._id} 
                alignItems="flex-start"
                sx={styles.getListItemStyle(editingCommentId === comment._id)}
                secondaryAction={
                  user?._id === comment.userId._id && (
                    <Stack direction="row" spacing={0}>
                      <IconButton edge="end" size="small" onClick={() => handleEditClick(comment)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton edge="end" size="small" color="error" onClick={() => handleDeleteComment(comment._id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar src={getImageUrl(comment.userId.profileImageUrl)} alt={comment.userId.username}>
                    {comment.userId.username.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle2" sx={styles.usernameText}>{comment.userId.username}</Typography>}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="text.primary">{comment.text}</Typography>
                      <Typography variant="caption" display="block" color="text.secondary" sx={styles.dateText}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>

      <DialogActions sx={styles.inputAreaContainer}>
        <TextField
          fullWidth
          size="small"
          placeholder={editingCommentId ? "Edit your comment..." : "Add a comment..."}
          variant="outlined"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmitComment();
            }
          }}
          sx={styles.commentTextField}
        />
        <Button 
          variant="contained" 
          onClick={handleSubmitComment}
          disabled={!commentText.trim()}
          endIcon={<SendIcon />}
          sx={styles.submitButton}
        >
          {editingCommentId ? "Update" : "Post"}
        </Button>
        {editingCommentId && (
          <Button size="small" onClick={() => { setEditingCommentId(null); setCommentText(""); }} sx={styles.cancelButton}>
            Cancel
          </Button>
        )}
      </DialogActions>
    </>
  );
};

export default CommentsSection;