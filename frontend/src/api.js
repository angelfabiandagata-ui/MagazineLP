import axios from 'axios';

// Forzamos la URL directa del servidor de Express
const API = axios.create({
  baseURL: 'https://magazinelp.onrender.com/api'
});

// Interceptor para adjuntar automáticamente el token en todas las peticiones
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;