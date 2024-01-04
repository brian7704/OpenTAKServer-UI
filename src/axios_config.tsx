import axios from 'axios';
import { config } from './config';

export default axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  withXSRFToken: true,
  maxRedirects: 0,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
