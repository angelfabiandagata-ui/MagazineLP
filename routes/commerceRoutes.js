import express from 'express';
import Commerce from '../models/Commerce.js';
import Label from '../models/Label.js';
import Image from '../models/Image.js';
import upload from '../middleware/upload.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

const uploadFields = upload.fields([
  { name: 'imagenFondo', maxCount: 1 },
  { name: 'promo1', maxCount: 1 },
  { name: 'promo2', maxCount: 1 }
]);

// GET /api/comercios (Público)
router.get('/', async (req, res) => {
  try {
    const comercios = await Commerce.findAll({
      include: [
        { model: Label, through: { attributes: [] } },
        { model: Image, as: 'images' }
      ],
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(Array.isArray(comercios) ? comercios : []);
  } catch (error) {
    console.error('Error al obtener comercios:', error);
    return res.status(500).json([]);
  }
});

// GET /api/comercios/:id (Público)
router.get('/:id', async (req, res) => {
  try {
    const comercio = await Commerce.findByPk(req.params.id, {
      include: [
        { model: Label, through: { attributes: [] } },
        { model: Image, as: 'images' }
      ]
    });
    if (!comercio) return res.status(404).json({ mensaje: 'Comercio no encontrado.' });
    return res.status(200).json(comercio);
  } catch (error) {
    console.error('Error al obtener comercio:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// PUT /api/comercios/:id (Protegido)
router.put('/:id', verificarToken, (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err) return res.status(400).json({ mensaje: 'Error en la subida de archivos.' });
    next();
  });
}, async (req, res) => {
  try {
    const { id } = req.params;
    const comercio = await Commerce.findByPk(id);

    if (!comercio) {
      return res.status(404).json({ mensaje: 'Comercio no encontrado.' });
    }

    // --- AUTORIZACIÓN DIRECTA (1 Comercio = 1 Usuario) ---
    // El id del comercio coincide directamente con el id guardado en req.usuario
    const esPropietario = Number(comercio.id) === Number(req.usuario.id);
    const esAdmin = Boolean(req.usuario.esAdmin);

    if (!esPropietario && !esAdmin) {
      return res.status(403).json({ mensaje: 'No tenés permisos para modificar este comercio.' });
    }

    const { name, description, direccion, tel, rubro, labels, instagram, whatsapp, paginaWeb } = req.body;

    comercio.name = name || comercio.name;
    comercio.description = description !== undefined ? description : comercio.description;
    comercio.direccion = direccion !== undefined ? direccion : comercio.direccion;
    comercio.tel = tel !== undefined ? tel : comercio.tel;
    comercio.rubro = rubro !== undefined ? rubro : comercio.rubro;
    comercio.redSocial = { instagram, whatsapp, paginaWeb };
    await comercio.save();

    const procesarImagenPorPuesto = async (fileArray, tipoPuesto) => {
      if (!fileArray || !fileArray[0]) return;
      const nuevaUrl = fileArray[0].path || fileArray[0].secure_url;
      const imagenVieja = await Image.findOne({ where: { commerceId: comercio.id, tipo: tipoPuesto } });

      if (imagenVieja) {
        imagenVieja.url = nuevaUrl;
        await imagenVieja.save();
      } else {
        await Image.create({ url: nuevaUrl, tipo: tipoPuesto, commerceId: comercio.id });
      }
    };

    if (req.files) {
      await procesarImagenPorPuesto(req.files.imagenFondo, 'FONDO');
      await procesarImagenPorPuesto(req.files.promo1, 'PROMO_1');
      await procesarImagenPorPuesto(req.files.promo2, 'PROMO_2');
    }

    if (labels !== undefined && labels !== null) {
      let labelsArray = [];
      try {
        labelsArray = typeof labels === 'string' ? JSON.parse(labels) : labels;
      } catch (e) {
        console.error('Error al parsear labels:', e);
      }

      if (Array.isArray(labelsArray)) {
        const labelInstances = [];
        for (const item of labelsArray) {
          const texto = typeof item === 'object' ? (item.label || item.name) : item;
          if (texto && typeof texto === 'string' && texto.trim() !== '') {
            const [labelRecord] = await Label.findOrCreate({
              where: { label: texto.trim().toLowerCase() }
            });
            labelInstances.push(labelRecord);
          }
        }
        await comercio.setLabels(labelInstances);
      }
    }

    const comercioActualizado = await Commerce.findByPk(id, {
      include: [
        { model: Label, through: { attributes: [] } },
        { model: Image, as: 'images' }
      ]
    });

    return res.status(200).json(comercioActualizado);
  } catch (error) {
    console.error('Error al actualizar comercio:', error);
    return res.status(500).json({ mensaje: 'Error al procesar los datos.' });
  }

  // --- AUTORIZACIÓN DIRECTA (Comparación estricta en String) ---
    const esPropietario = String(comercio.id) === String(req.usuario.id);
    const esAdmin = Boolean(req.usuario.esAdmin);

    if (!esPropietario && !esAdmin) {
      return res.status(403).json({ mensaje: 'No tenés permisos para modificar este comercio.' });
}
});

// DELETE /api/comercios/:id (Protegido)
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const comercio = await Commerce.findByPk(id);

    if (!comercio) return res.status(404).json({ mensaje: 'El comercio no existe.' });

    // --- AUTORIZACIÓN DIRECTA ---
    const esPropietario = Number(comercio.id) === Number(req.usuario.id);
    const esAdmin = Boolean(req.usuario.esAdmin);

    if (!esPropietario && !esAdmin) {
      return res.status(403).json({ mensaje: 'No tenés permisos para eliminar este comercio.' });
    }

    await comercio.destroy();
    return res.status(200).json({ id: Number(id), mensaje: `Comercio "${comercio.name}" eliminado correctamente.` });
  } catch (error) {
    console.error('Error al eliminar comercio:', error);
    return res.status(500).json({ mensaje: 'Error al intentar eliminar el comercio.' });
  }

  // --- AUTORIZACIÓN DIRECTA (Comparación estricta en String) ---
    const esPropietario = String(comercio.id) === String(req.usuario.id);
    const esAdmin = Boolean(req.usuario.esAdmin);

    if (!esPropietario && !esAdmin) {
      return res.status(403).json({ mensaje: 'No tenés permisos para modificar este comercio.' });
    }
});

export default router;