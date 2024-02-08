import React from 'react';

const Login = React.lazy(() => import('./pages/Login/Login'));
const Error404 = React.lazy(() => import('./pages/Errors/Error404'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const Map = React.lazy(() => import('./pages/Map/Map'));
const EUDs = React.lazy(() => import('./pages/EUDs'));
const Casevac = React.lazy(() => import('./pages/Casevac'));
const DataPackages = React.lazy(() => import('./pages/DataPackages'));
const VideoStreams = React.lazy(() => import('./pages/VideoStreams'));
const Users = React.lazy(() => import('./pages/Users'));
const TFASetup = React.lazy(() => import('./pages/TFASetup'));
const Alerts = React.lazy(() => import('./pages/Alerts'));
const PasswordReset = React.lazy(() => import('./pages/PasswordReset'));
const ScheduledJobs = React.lazy(() => import('./pages/ScheduledJobs'));
const VideoRecordings = React.lazy(() => import('./pages/VideoRecordings'));
const AdminSettings = React.lazy(() => import('./pages/AdminSettings'));

const routes = [
  { path: '/', exact: true, name: 'Home', element: Dashboard },
  { path: '/login', name: 'Login', element: Login },
  { path: '/404', name: '404', element: Error404 },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/euds', name: 'EUDs', element: EUDs },
  { path: '/map', name: 'Map', element: Map },
  { path: '/alerts', name: 'Alerts', element: Alerts },
  { path: '/casevac', name: 'Casevac', element: Casevac },
  { path: '/data_packages', name: 'DataPackages', element: DataPackages },
  { path: '/video_streams', name: 'VideoStreams', element: VideoStreams },
  { path: '/users', name: 'Users', element: Users },
  { path: '/tfa_setup', name: '2FA Setup', element: TFASetup },
  { path: '/reset', name: 'Password Reset', element: PasswordReset },
  { path: '/jobs', name: 'Scheduled Jobs', element: ScheduledJobs },
  { path: '/video_recordings', name: 'Video Recordings', element: VideoRecordings },
  { path: '/settings', name: 'Settings', element: AdminSettings },
];

export default routes;
