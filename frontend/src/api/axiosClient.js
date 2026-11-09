import axios from 'axios';

// Resolve API Base URL robustly (handles root origins like https://app.onrender.com as well as /api)
const resolveBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';

  const cleanUrl = envUrl.trim().replace(/\/+$/, '');
  if (!cleanUrl.endsWith('/api')) {
    return `${cleanUrl}/api`;
  }
  return cleanUrl;
};

const API_BASE_URL = resolveBaseUrl();

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT bearer token from localStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agri_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format errors and handle 401 unauth
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected server error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };

    if (error.response?.status === 401) {
      // If token expired, clear token
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/register')
      ) {
        localStorage.removeItem('agri_token');
        localStorage.removeItem('agri_user');
      }
    }

    return Promise.reject(customError);
  }
);

export default axiosClient;

