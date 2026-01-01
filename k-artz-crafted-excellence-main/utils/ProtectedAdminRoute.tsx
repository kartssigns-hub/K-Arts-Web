// src/components/ProtectedAdminRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute: React.FC = () => {
 
  const adminToken = localStorage.getItem('adminToken');

  
  if (!adminToken) {
   
    return <Navigate to="/admin/login" replace />;
  }

  
  return <Outlet />;
};

export default ProtectedAdminRoute;