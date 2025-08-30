// src/components/common/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../../services/authService'; // Assuming you have a way to check role

const AdminRoute = () => {
  // This is a simplified role check. In a real app, you'd decode the JWT
  // or have a user object in a global state (like Context API or Redux).
  const getUser = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      // Decode JWT payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (e) {
      console.error("Failed to decode token", e);
      return null;
    }
  };

  const user = getUser();
  const isAdmin = user && user.role === 'admin';

  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;