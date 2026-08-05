import axios from 'axios';

// Asegura que la URL base tome la variable de Render o fallback al localhost
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://magazinelp.onrender.com/api'
});

export default API;