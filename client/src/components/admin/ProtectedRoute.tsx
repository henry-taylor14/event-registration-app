// client/src/components/admin/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user || !isAdmin) {
    return <Navigate to={`/admin/login?redirect=${location.pathname}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

