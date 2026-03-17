import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AddReview from '../components/AddReview/AddReview';

const AddReviewPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate(); 

  if (!isAuthenticated || !user || !user._id) {
    return <Navigate to="/Login" replace />;
  }

  // TODO: add an indication for the user for "Successful upload / error in upload"
  return (
    <AddReview 
      userId={user._id} 
      onPostSuccess={() => navigate("/")}
    />
  );
};

export default AddReviewPage;