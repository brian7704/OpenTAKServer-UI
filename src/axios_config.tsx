import axios from 'axios';

export default axios.create({
  withCredentials: true,
  withXSRFToken: true,
  maxRedirects: 0,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
