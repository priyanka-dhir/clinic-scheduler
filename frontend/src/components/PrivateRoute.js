import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getUserRole } from '../utils/auth';

const PrivateRoute = ({ children, roles }) => {
  const token = getToken();
  const userRole = getUserRole();

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(userRole)) {
    // Logged in but role not allowed
    // Redirect to their dashboard
    switch (userRole) {
      case 'ADMIN':
        return <Navigate to="/admin" replace />;
      case 'PROVIDER':
        return <Navigate to="/provider" replace />;
      case 'PATIENT':
        return <Navigate to="/patient" replace />;
      case 'SCHEDULER':
        return <Navigate to="/scheduler" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
