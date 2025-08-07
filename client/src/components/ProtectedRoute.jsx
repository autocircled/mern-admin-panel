import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  roles = [], 
  permissions = [] 
}) => {
  const { user, loading, hasRole, hasPermission } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check roles if specified
  if (roles.length > 0 && !roles.some(role => hasRole(role))) {
    return <Navigate to="/" replace />;
  }

  // Check permissions if specified
  if (permissions.length > 0 && !permissions.some(perm => hasPermission(perm))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;