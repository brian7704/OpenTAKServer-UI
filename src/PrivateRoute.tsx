import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const loggedIn = JSON.parse(String(localStorage.getItem('loggedIn'))) === true;

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
