import React from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AddReview from '../components/AddReview/AddReview';
import { PostType } from '../types/post';

const EditReviewPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the post passed via navigate state
  const post = location.state?.postToEdit as PostType | undefined;

  // Protect the route
  if (!isAuthenticated || !user || !user._id) {
    return <Navigate to="/Login" replace />;
  }

  // If a user types /editReview directly into the URL, they won't have state. 
  // Send them back to their profile.
  if (!post) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <AddReview
      userId={user._id}
      initialData={post}
      onPostSuccess={() => navigate('/profile')}
      onCancel={() => navigate(-1)}
    />
  );
};

export default EditReviewPage;