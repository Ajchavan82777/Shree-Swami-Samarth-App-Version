import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('sss_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sss_token');
      localStorage.removeItem('sss_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;

export const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
export const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
