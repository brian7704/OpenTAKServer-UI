import React from 'react';

const Login = React.lazy(() => import('./pages/Login/Login'));
const Error404 = React.lazy(() => import('./pages/Errors/Error404'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const Map = React.lazy(() => import('./pages/Map/Map'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/login', name: 'Login', element: Login },
  { path: '/404', name: '404', element: Error404 },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/euds', name: 'EUDs', element: Error404 },
  { path: '/map', name: 'Map', element: Map },
];

export default routes;
