import React from 'react';

const Login = React.lazy(() => import('./pages/Login/Login.tsx').then());
const Error404 = React.lazy(() => import('./pages/Errors/Error404.tsx').then());
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard.tsx').then());
const Map = React.lazy(() => import('./pages/Map/Map.tsx').then());
const EUDs = React.lazy(() => import('./pages/EUDs.tsx').then());
const Casevac = React.lazy(() => import('./pages/Casevac.tsx').then());
const DataPackages = React.lazy(() => import('./pages/DataPackages.tsx').then());
const VideoStreams = React.lazy(() => import('./pages/VideoStreams.tsx').then());
const Users = React.lazy(() => import('./pages/Users.tsx').then());
const TFASetup = React.lazy(() => import('./pages/TFASetup.tsx').then());
const Alerts = React.lazy(() => import('./pages/Alerts.tsx').then());
const PasswordReset = React.lazy(() => import('./pages/PasswordReset.tsx').then());
const ScheduledJobs = React.lazy(() => import('./pages/ScheduledJobs.tsx').then());
const VideoRecordings = React.lazy(() => import('./pages/VideoRecordings.tsx').then());
const Meshtastic = React.lazy(() => import('./pages/Meshtastic.tsx').then());
const PluginUpdates = React.lazy(() => import('./pages/PluginUpdates.tsx').then());
const DeviceProfiles = React.lazy(() => import('./pages/DeviceProfiles.tsx').then());
const Missions = React.lazy(() => import('./pages/Missions.tsx').then())
const Groups = React.lazy(() => import('./pages/Groups.tsx').then())
const EUDStats = React.lazy(() => import('./pages/EUDStats.tsx').then());
const Plugin = React.lazy(() => import('./pages/Plugin.tsx').then());
const ServerPluginManager = React.lazy(() => import('./pages/ServerPluginManager.tsx').then());
const LinkTAKGovAccount = React.lazy(() => import('./pages/LinkTakGov.tsx').then());
const UserProfile = React.lazy(() => import('./pages/UserProfile.tsx').then());

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
  { path: '/link_account', name: 'Link TAK.gov Account', element: LinkTAKGovAccount },
  { path: '/profile/', name: 'User Profile', element: UserProfile },
  { path: '/profile/:username', name: 'User Profile', element: UserProfile },
];

export default routes;
