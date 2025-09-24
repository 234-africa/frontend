import axios from 'axios';

const API_URL = 'https://event-ticket-backend-yx81.onrender.com  /api/';

let headers = {};

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Add response interceptor to handle expired/invalid tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 🔒 Token is invalid or expired
      localStorage.removeItem('token');

      // Optionally: clear user state if using Vuex or Pinia
      // store.commit('setUser', null);

      // ✅ Optionally redirect to login
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
