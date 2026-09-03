import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import SharedLayout from './SharedLayout';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';

const AdminLayout = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== ROLES.ADMIN) {
    return <Navigate to="/access-denied" replace />;
  }

  return <SharedLayout />;
};

export default AdminLayout;