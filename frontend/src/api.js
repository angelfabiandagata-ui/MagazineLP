import axios from 'axios';

// Forzamos la URL directa del servidor de Express
const API = axios.create({
  baseURL: 'https://magazinelp.onrender.com/api'
});

export default API;