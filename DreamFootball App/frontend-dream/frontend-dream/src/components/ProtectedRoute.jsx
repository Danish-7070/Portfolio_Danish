import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/userContext';
import { useTeam } from '../context/teamContext';
import { useAdmin } from '../context/adminContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { customer, fetchingCustomer, errorFetchingCustomer } = useUser();
  const { currTeam, isFetchingTeam, teamFetchingError } = useTeam();
  const { admin, fetchingAdmin, errorFetchingAdmin } = useAdmin();
  
  // Check loading states based on required role
  if (
    (requiredRole === 'admin' && fetchingAdmin) || 
    (requiredRole === 'customer' && fetchingCustomer) || 
    (requiredRole === 'team' && isFetchingTeam)
  ) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  // Check authentication based on required role
  const isAuthenticated = () => {
    if (requiredRole === 'admin' && admin) return true;
    if (requiredRole === 'customer' && customer) return true;
    if (requiredRole === 'team' && currTeam) return true;
    return false;
  };

  // Get redirect path based on role
  const getRedirectPath = () => {
    if (requiredRole === 'admin') return '/admin/login';
    if (requiredRole === 'customer') return '/customer/login';
    if (requiredRole === 'team') return '/customer/login?role=team';
    return '/';
  };

  // Check for authentication errors
  const hasAuthError = () => {
    if (requiredRole === 'admin' && errorFetchingAdmin) return true;
    if (requiredRole === 'customer' && errorFetchingCustomer) return true;
    if (requiredRole === 'team' && teamFetchingError) return true;
    return false;
  };

  // Redirect if authentication error or not authenticated
  if (hasAuthError() || !isAuthenticated()) {
    return <Navigate to={getRedirectPath()} replace />;
  }

  // Render the protected route
  return <Outlet />;
};

export default ProtectedRoute;