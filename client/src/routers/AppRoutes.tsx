import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import PostPage from '../pages/PostsPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { UserProfile } from '../pages/UserProfile/UserProfilePage';
import AddReviewPage from '../pages/AddReviewPage';

// --- Protected Layout Component ---
const ProtectedLayout = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <MainHeader />
      <Outlet />
    </>
  );
};

// --- Routes Configuration ---
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<PostPage />} />
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/profile/:id" element={<UserProfile/>} />
        {/* by adding the :id part we make the path dynamic. and the regular /Profile is for the logged-in user */}
        <Route path="/AddReview" element={<AddReviewPage/>} />
        {/* Add more protected routes here later */}
      </Route>

      {/* Catch all - redirect to home (which will redirect to login if needed) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;