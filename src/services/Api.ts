import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.BACKEND_URL || 'http://localhost:3000',
  withCredentials: true, // bật cho tất cả request
  headers: { 'Content-Type': 'application/json' },
});

export default api;
