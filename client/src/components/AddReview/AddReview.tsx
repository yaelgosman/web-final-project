import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Rating, 
  Paper,
  IconButton
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import * as styles from './AddReview.style';
import postService from '../../services/postService';
import { PostType } from '../../types/post';
import { getImageUrl } from '../../utils/imageUtils';

interface AddReviewProps {
  userId: string;
  onPostSuccess?: () => void;
  initialData?: PostType;
}

const AddReview: React.FC<AddReviewProps> = ({ userId, onPostSuccess, initialData }) => {
  const [text, setText] = useState<string>(initialData?.text || '');
  const [rating, setRating] = useState<number | null>(initialData?.rating || 0);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imagePath ? getImageUrl(initialData?.imagePath) : null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [restaurantName, setRestaurantName] = useState<string>(initialData?.restaurant?.name || '');
  const [restaurantCity, setRestaurantCity] = useState<string>(initialData?.restaurant?.city || '');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  // If creating a new post, an Image is required, If Editing - the user might have kept the original image
  const isEditing = !!initialData;

  if (!text || !rating || (!isEditing && !image) || !restaurantName) {
    alert("Please fill out all fields, including restaurant details and an image!");
    return;
  }

  setIsSubmitting(true);

  try {

    // Edit mode
    if (isEditing && initialData) {
      if (image) {
        // The user uploaded a NEW image, so we must use FormData.

        const formData = new FormData();
        formData.append('text', text);
        formData.append('rating', rating.toString());
        formData.append('image', image);
        formData.append('userId', userId); 
        
        // Stringify For nested objects in FormData
        formData.append('restaurant', JSON.stringify({ 
          name: restaurantName, 
          city: 'Petach Tikva' // For now - ignores the city field // TODO: CHANGE LATER CITY NAME!
        }));

        const editRes = await postService.editPost(initialData._id, formData);
      } else {
        // The user only changed text fields and didnt upload a new image - so we can send a standard JSON payload
        const updateDate: Partial<PostType> = {
          text,
          rating,
          restaurant: {name: restaurantName, city: 'Petach Tikva'} // TODO: CHANGE LATER CITY NAME!
        };

        const editRes = await postService.editPost(initialData._id, updateDate);
      }
    } else {
      // Create a NEW post
      const formData = new FormData();
      formData.append('text', text);
      formData.append('rating', rating.toString());
      formData.append('image', image!);
      formData.append('userId', userId); 
      
      // Stringify For nested objects in FormData
      formData.append('restaurant', JSON.stringify({ 
        name: restaurantName, 
        city: 'Petach Tikva' // For now - ignores the city field // TODO: CHANGE LATER CITY NAME!
      }));


      const newPost = await postService.createPost(formData);
    }

    if (!isEditing) {
      // Reset all form fields
      setText('');
      setRating(0);
      setRestaurantName('');
      setRestaurantCity('');
      removeImage();
    }
    
    if (onPostSuccess) onPostSuccess();

  } catch (error) {
    console.error("Error submitting review:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Paper elevation={3} sx={styles.paperContainer}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Write a Review
      </Typography>

      <form onSubmit={handleSubmit}>

        <Box sx={{ mb: 3 }}>
          {!imagePreview ? (
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<PhotoCamera />}
              sx={styles.uploadButton}
            >
              Upload a Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          ) : (
            <Box sx={styles.imagePreviewContainer}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ width: '100%', height: 'auto', display: 'block' }} 
              />
              <IconButton onClick={removeImage} sx={styles.closeButton}>
                <CloseIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <TextField
          fullWidth
          multiline
          rows={1}
          variant="outlined"
          placeholder="Where did you eat?"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          sx={{ mb: 3 }}
        />  

        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="What did you think of the food and service?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mb: 3 }}
        />        

        <Box sx={styles.ratingContainer}>
          <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 500 }}>
            Your Rating:
          </Typography>
          <Rating
            name="restaurant-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
            sx={styles.ratingStars}
          />
        </Box>


        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          sx={styles.submitButton}
        >
          {isSubmitting ? 'Posting...' : 'Post Review'}
        </Button>
      </form>
    </Paper>
  );
};

export default AddReview;