import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/db.js';
import commerceRoutes from './routes/commerceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import './models/index.js';
import newsRoutes from './routes/newsRoutes.js';
import turismoRoutes from './routes/turismoRoutes.js';
import Tourism from './models/Tourism.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
// Permite peticiones de cualquier origen para evitar bloqueos en Render
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 👈 Servir imágenes almacenadas en la carpeta /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/comercios', commerceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/noticias', newsRoutes);
app.use('/api/turismo', turismoRoutes);

// Servir los archivos estáticos de la app compilada desde /frontend/dist
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Ruta de prueba para verificar conexión real a PostgreSQL
app.get('/api/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query('SELECT NOW()');
    res.json({ ok: true, mensaje: '¡Conexión exitosa a PostgreSQL!', horaBD: results[0] });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Fallback para React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

try {
  await sequelize.sync({ alter: true });
  console.log('✅ Base de datos conectada');
  
  app.listen(process.env.PORT || 3000, () => {
    console.log(`🚀 Servidor corriendo en puerto ${process.env.PORT || 3000}`);
  });
} catch (error) {
  console.error('❌ Error de conexión:', error);
}

