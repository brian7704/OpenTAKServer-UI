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
const Meshtastic = React.lazy(() => import('./pages/Meshtastic'));
const PluginUpdates = React.lazy(() => import('./pages/PluginUpdates'));
const DeviceProfiles = React.lazy(() => import('./pages/DeviceProfiles'));
const Missions = React.lazy(() => import('./pages/Missions'))
const Groups = React.lazy(() => import('./pages/Groups'))
const EUDStats = React.lazy(() => import('./pages/EUDStats'));
const Plugin = React.lazy(() => import('./pages/Plugin'));
const ServerPluginManager = React.lazy(() => import('./pages/ServerPluginManager.tsx'));
const Federation = React.lazy(() => import('./pages/Federation'));

const routes = [
  { path: '/', exact: true, name: 'Home', element: Dashboard },
  { path: '/login', name: 'Login', element: Login },
  { path: '/404', name: '404', element: Error404 },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/euds', name: 'EUDs', element: EUDs },
  { path: '/map', name: 'Map', element: Map },
  { path: '/alerts', name: 'Alerts', element: Alerts },
  { path: '/casevac', name: 'CasEvac', element: Casevac },
  { path: '/data_packages', name: 'DataPackages', element: DataPackages },
  { path: '/video_streams', name: 'VideoStreams', element: VideoStreams },
  { path: '/users', name: 'Users', element: Users },
  { path: '/tfa_setup', name: '2FA Setup', element: TFASetup },
  { path: '/reset', name: 'Password Reset', element: PasswordReset },
  { path: '/jobs', name: 'Scheduled Jobs', element: ScheduledJobs },
  { path: '/video_recordings', name: 'Video Recordings', element: VideoRecordings },
  { path: '/meshtastic', name: 'Meshtastic', element: Meshtastic },
  { path: '/plugin_updates', name: 'PluginUpdates', element: PluginUpdates },
  { path: '/device_profiles', name: 'DeviceProfiles', element: DeviceProfiles },
  { path: '/missions', name: 'Missions', element: Missions },
  { path: '/groups', name: 'Groups', element: Groups },
  { path: '/eud_stats', name: 'EUDStats', element: EUDStats },
  { path: '/plugin', name: 'Plugins', element: Plugin },
  { path: '/server_plugin_manager', name:'Server Plugin Manager', element: ServerPluginManager },
  { path: '/federation', name: 'Federation', element: Federation },
];

export default routes;
