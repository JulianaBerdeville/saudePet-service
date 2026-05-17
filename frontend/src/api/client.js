import axios from 'axios';
import { API_URL } from '../utils/getBaseURL';

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
};

export const clearAuthToken = () => {
  authToken = null;
  delete client.defaults.headers.common.Authorization;
};

export default client;
