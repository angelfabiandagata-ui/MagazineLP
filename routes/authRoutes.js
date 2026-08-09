import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Commerce from '../models/Commerce.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_magazine_la_punta_2026';

// 🔑 CREDENCIALES DEL SUPERADMIN
const ADMIN_EMAIL = 'admin@magazinelapunta.com';
const ADMIN_PASSWORD = '99885522';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, direccion, tel, rubro } = req.body;

    const existe = await Commerce.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ mensaje: 'El email ya se encuentra registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoComercio = await Commerce.create({
      name,
      email,
      password: hashedPassword,
      direccion,
      tel,
      rubro
    });

    return res.status(201).json({
      mensaje: 'Comercio registrado con éxito',
      comercio: {
        id: nuevoComercio.id,
        name: nuevoComercio.name,
        email: nuevoComercio.email
      }
    });

  } catch (error) {
    console.error('Error al registrar comercio:', error);
    return res.status(500).json({ mensaje: 'Error interno al crear el comercio.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Por favor, ingresá email y contraseña.' });
    }

    // 1. VALIDACIÓN DE SUPERADMIN
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { id: 'admin', email: ADMIN_EMAIL, esAdmin: true },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        mensaje: 'Inicio de sesión como Administrador exitoso',
        token,
        esAdmin: true
      });
    }

    // 2. BUSCAR COMERCIO EN BASE DE DATOS
    const comercio = await Commerce.findOne({ where: { email } });
    if (!comercio) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas. El usuario no existe.' });
    }

    // 3. COMPARAR CONTRASEÑA
    const esValida = await bcrypt.compare(password, comercio.password);
    if (!esValida) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas. Contraseña incorrecta.' });
    }

    // 4. GENERAR TOKEN PARA COMERCIO (esAdmin: false)
    const token = jwt.sign(
      { id: comercio.id, email: comercio.email, esAdmin: false },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. RESPONDER AL FRONTEND
    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      esAdmin: false,
      comercio: {
        id: comercio.id,
        name: comercio.name,
        email: comercio.email,
        description: comercio.description,
        direccion: comercio.direccion,
        tel: comercio.tel,
        rubro: comercio.rubro,
        redSocial: comercio.redSocial
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ mensaje: 'Error al procesar el inicio de sesión.' });
  }
});

export default router;