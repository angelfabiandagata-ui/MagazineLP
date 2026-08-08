import axios from 'axios';

const API = axios.create({
  baseURL: 'https://magazinelp.onrender.com/api'
});

// Interceptor para enviar el token JWT en TODAS las peticiones (JSON o FormData)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;