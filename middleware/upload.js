import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Nos aseguramos de que la carpeta "uploads" exista en tu PC
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración de almacenamiento en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos en tu PC
  },
  filename: (req, file, cb) => {
    // Genera un nombre único con timestamp para evitar sobreescrituras
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

//cambios

export default upload;