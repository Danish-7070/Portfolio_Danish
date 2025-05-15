// import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/userContext';
import { useTeam } from '../context/teamContext';
import { useAdmin } from '../context/adminContext';

const PublicRoute = () => {
  const { customer, fetchingCustomer } = useUser();
  const { currTeam, isFetchingTeam } = useTeam();
  const { admin, fetchingAdmin } = useAdmin();

  // Show loading spinner while checking authentication
  if (fetchingCustomer || isFetchingTeam || fetchingAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  // Redirect authenticated users to appropriate pages
  if (admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  if (customer) {
    return <Navigate to="/" replace />;
  }
  
  if (currTeam) {
    return <Navigate to="/teams" replace />;
  }

  // If not authenticated, render the public route
  return <Outlet />;
};

export default PublicRoute;