import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae 'TOKEN' de 'Bearer TOKEN'

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    const usuarioDecodificado = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'clave_secreta_jwt'
    );
    
    // Guardamos los datos decodificados en req.usuario y req.user por compatibilidad
    req.usuario = usuarioDecodificado; 
    req.user = usuarioDecodificado;
    
    next();
  } catch (error) {
    // 🔍 Imprime la causa exacta en la terminal/logs de Render
    console.error('Error al verificar JWT:', error.message);
    return res.status(403).json({ 
      mensaje: 'Token inválido o expirado.', 
      error: error.message 
    });
  }
};