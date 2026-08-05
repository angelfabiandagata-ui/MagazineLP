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
app.use(cors());
app.use(express.json());

// 👈 Servir imágenes almacenadas en la carpeta /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/comercios', commerceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/noticias', newsRoutes);
app.use('/api/turismo', turismoRoutes);

try {
  await sequelize.sync({ alter: true });
  console.log('✅ Base de datos conectada');
  
  app.listen(process.env.PORT || 3000, () => {
    console.log(`🚀 Servidor corriendo en puerto ${process.env.PORT || 3000}`);
  });
} catch (error) {
  console.error('❌ Error de conexión:', error);
}