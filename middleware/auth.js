import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae 'TOKEN' de 'Bearer TOKEN'

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    const usuarioDecodificado = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_jwt');
    req.usuario = usuarioDecodificado; // Guardamos los datos del token en req.usuario
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
  }
};