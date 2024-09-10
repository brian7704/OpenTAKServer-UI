export const apiRoutes = {
  login: '/api/login?include_auth_token',
  logout: '/api/logout',
  eud: '/api/eud',
  users: '/api/users',
  alerts: '/api/alerts',
  me: '/api/me',
  create_user: '/api/user/create',
  video_streams: '/api/video_streams',
  generate_certificate: '/api/certificate',
  data_packages: '/api/data_packages',
  download_data_packages: '/api/data_packages/download',
  assign_eud_to_user: '/api/user/assign_eud',
  status: '/api/status',
  casevac: '/api/casevac',
  deleteDataPackage: '/api/data_packages',
  addVideoStream: '/api/mediamtx/stream/add',
  deleteVideoStream: '/api/mediamtx/stream/delete',
  updateVideoStream: '/api/mediamtx/stream/update',
  addUser: '/api/user/add',
  changeRole: '/api/user/role',
  deactivateUser: '/api/user/deactivate',
  activateUser: '/api/user/activate',
  deleteUser: '/api/user/delete',
  adminResetPassword: '/api/user/password/reset', //Allows admins to change any user's password
  register: '/api/register',
  tfValidate: '/api/tf-validate',
  tfSetup: '/api/tf-setup',
  resetPassword: '/api/password/reset', //Allows users to reset their own password if they forgot it
  mapState: '/api/map_state',
  getScheduledJobs: '/api/scheduler/jobs',
  runJob: '/api/scheduler/job/run',
  resumeJob: '/api/scheduler/job/resume',
  pauseJob: '/api/scheduler/job/pause',
  getRecording: '/api/videos/recording',
  getRecordings: '/api/videos/recordings',
  deleteRecording: '/api/videos/recording',
  adminSettings: '/api/config',
  modifyJob: '/api/scheduler/job/modify',
  startSSL: '/api/ssl/start',
  stopSSL: '/api/ssl/stop',
  startTCP: '/api/tcp/start',
  stopTCP: '/api/tcp/stop',
  itakQrString: '/api/itak_qr_string',
  meshtasticChannels: '/api/meshtastic/channel',
  generateMeshtasticPsk: '/api/meshtastic/generate_psk',
  pluginPackage: '/api/packages',
};
