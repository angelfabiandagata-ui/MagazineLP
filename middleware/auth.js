import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer TOKEN'

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token de autenticación.' });
  }

  try {
    const usuarioDecodificado = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_jwt');
    req.usuario = usuarioDecodificado; // Guardamos id y datos del usuario en la request
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
  }
};