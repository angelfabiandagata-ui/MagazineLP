import fs from 'fs';
import path from 'path';

/**
 * Recibe una URL relativa (ej: "/uploads/fondo-12345.jpg") 
 * y elimina el archivo del disco del servidor si existe.
 */
export const borrarArchivoFisico = (urlRelativa) => {
  if (!urlRelativa) return;

  try {
    // Si la URL arranca con '/', se lo sacamos para armar la ruta bien
    const rutaLimpia = urlRelativa.startsWith('/') ? urlRelativa.slice(1) : urlRelativa;
    
    // Armamos la ruta absoluta del sistema de archivos
    const rutaAbsoluta = path.join(process.cwd(), rutaLimpia);

    // Verificamos si el archivo existe y lo borramos
    if (fs.existsSync(rutaAbsoluta)) {
      fs.unlinkSync(rutaAbsoluta);
      console.log(`🗑️ Archivo borrado exitosamente: ${rutaLimpia}`);
    }
  } catch (error) {
    console.error(`⚠️ Error al intentar borrar archivo (${urlRelativa}):`, error.message);
  }
};