import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import PostPage from '../pages/Posts';
import Login from '../pages/Login';
import Register from '../pages/Register';

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
        {/* Add more protected routes here later */}
      </Route>

      {/* Catch all - redirect to home (which will redirect to login if needed) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;