// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check for the token in localStorage
  const token = localStorage.getItem('token');

  // If no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If there is a token, render the child components (the actual page)
  return children;
};

export default ProtectedRoute;