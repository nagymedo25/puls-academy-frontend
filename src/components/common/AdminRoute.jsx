// src/components/common/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  // If the user is authenticated AND is an admin, allow access.
  // Otherwise, redirect to the login page.
  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
