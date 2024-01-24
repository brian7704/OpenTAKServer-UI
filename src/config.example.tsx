const { protocol } = location;
const { port } = location;

export const server_address = 'example.com';

export const config = {
  apiUrl: `${protocol}//${server_address}:${port}`,
};

export const apiRoutes = {
  login: '/api/login',
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
  deleteDataPackage: '/api/data_packages/delete',
  downloadDataPackage: '/api/data_packages/download',
  addVideoStream: '/api/mediamtx/stream/add',
  deleteVideoStream: '/api/mediamtx/stream/delete',
  updateVideoStream: '/api/mediamtx/stream/update',
  addUser: '/api/user/add',
  changeRole: '/api/user/role',
  deactivateUser: '/api/user/deactivate',
  activateUser: '/api/user/activate',
  adminResetPassword: '/api/user/password/reset', //Allows admins to change any user's password
  register: '/api/register',
  tfValidate: '/api/tf-validate',
  tfSetup: '/api/tf-setup',
  resetPassword: '/api/password/reset', //Allows users to reset their own password if they forgot it
  mapState: '/api/map_state',
};
