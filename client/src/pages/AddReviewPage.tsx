import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AddReview from '../components/AddReview/AddReview';

const AddReviewPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user || !user._id) {
    return <Navigate to="/Login" replace />;
  }

  return (
    <AddReview 
      userId={user._id} 
      onPostSuccess={() => console.log("Post successful!")} 
    />
  );
};

export default AddReviewPage;