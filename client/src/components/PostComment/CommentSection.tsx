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

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  useEffect(() => {
    // TODO: commentService.getCommentsByPost(postId)
    console.log(`Fetching comments for post: ${postId}`);
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    if (editingCommentId) {
      console.log(`Editing comment ${editingCommentId} to: ${commentText}`);
      setEditingCommentId(null);
    } else {
      console.log(`Adding new comment to post ${postId}: ${commentText}`);
    }
    setCommentText("");
  };

  const handleEditClick = (comment: CommentType) => {
    setEditingCommentId(comment._id);
    setCommentText(comment.text);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Delete this comment?")) return;
    console.log(`Deleting comment ${commentId}`);
  };

  return (
    <>
      <DialogContent dividers sx={styles.dialogContentContent}>
        <List sx={styles.listContainer}>
          {comments.length === 0 ? (
            <ListItem alignItems="flex-start">
              <ListItemText primary={<Typography variant="subtitle2" color="text.secondary">No comments yet. Be the first to reply!</Typography>} />
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