import axios, { AxiosInstance } from 'axios';

// You can create an axios configuration for specific remote APIs with baseline
// configuration options
// These can generally be overridden when sending individual requests

console.log(process.env.REACT_APP_ENVIRONMENT);

const trmsClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_ENVIRONMENT === 'local' ? 'http://localhost:3001' : process.env.REACT_APP_TRMS_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default trmsClient;