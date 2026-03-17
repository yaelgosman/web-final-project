import React from 'react';
import { PostType } from '../../types/post';
import * as styles from './UserPost.style'
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

interface UserPostProps {
  post: PostType;
  getImageUrl: (path: string) => string;
  // TODO: add implementation to these action hooks for the dynamic buttons later
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

const UserPost: React.FC<UserPostProps> = ({ post, getImageUrl, onEdit, onDelete }) => {

    // Stop propagation so clicking the button doesn't click the whole post card
    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) onEdit(post._id);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) onDelete(post._id);
    };

  return (
    <div style={styles.postContainer}>
      {post.imagePath ? (
        <img 
          src={getImageUrl(post.imagePath)} 
          alt={post.restaurant.name} 
          style={styles.reviewImage} 
        />
      ) : (
        <div style={styles.noImagePlaceholder}>
          <p>No Image Provided</p>
        </div>
      )}

      {/* Action Buttons */}
      <div style={styles.actionsContainer}>
        {onEdit && (
          <IconButton size="small" onClick={handleEditClick} sx={styles.iconButtonSx}>
            <EditIcon fontSize="small" />
          </IconButton>
        )}
        {onDelete && (
          <IconButton size="small" onClick={handleDeleteClick} sx={styles.iconButtonSx}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </div>
      
      <div style={styles.reviewOverlay}>
        <span style={styles.rating}>
          {'🟢'.repeat(post.rating)}{'⚪'.repeat(5 - post.rating)}
        </span>
        <p style={styles.restaurantName}>{post.restaurant.name}</p>
        <p style={styles.restaurantCity}>{post.restaurant.city}</p>
      </div>
    </div>
  );
};

export default UserPost;