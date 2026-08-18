import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configuración con las credenciales de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del almacenamiento en la nube con optimización automática
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'magazine_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    // 🚀 Reducción de peso y optimización automática
    transformation: [
      { width: 1920, height: 1080, crop: 'limit' }, // Si supera 1080p la reduce, si es menor la mantiene
      { quality: 'auto' },                          // Comprime el peso inteligente sin perder nitidez
      { fetch_format: 'auto' }                      // Convierte automáticamente al formato web más liviano
    ],
  },
});

// Opcional: Límite de tamaño máximo del archivo para proteger el servidor (ej: 10 MB)
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB máximo por subida
});

export default upload;