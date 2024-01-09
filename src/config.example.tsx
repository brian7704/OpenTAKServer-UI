const protocol = location.protocol;
const port = location.port;

export const config = {
  apiUrl: `${protocol}//example.com:${port}`,
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
  casevac: '/api/casevac'
};
