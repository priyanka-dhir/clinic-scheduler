import axios from 'axios';

console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);  // <-- Add this line

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, // Use environment variable
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
