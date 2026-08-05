import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

export default API; // 👈 Esta línea es la que faltaba o estaba escrita diferente