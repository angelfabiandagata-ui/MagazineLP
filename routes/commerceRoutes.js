import express from 'express';
import Commerce from '../models/Commerce.js';
import Label from '../models/Label.js';
import Image from '../models/Image.js';
import upload from '../middleware/upload.js';
import { borrarArchivoFisico } from '../utils/deleteFile.js';

const router = express.Router();

// Configuración de los campos para subir archivos
const uploadFields = upload.fields([
  { name: 'imagenFondo', maxCount: 1 },
  { name: 'promo1', maxCount: 1 },
  { name: 'promo2', maxCount: 1 }
]);

// GET /api/comercios -> Devuelve siempre un Array [...]
router.get('/', async (req, res) => {
  try {
    const comercios = await Commerce.findAll({
      include: [
        { 
          model: Label, 
          through: { attributes: [] } 
        },
        { 
          model: Image, 
          as: 'images' 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Forzar que siempre retorne un Array estructurado
    return res.status(200).json(Array.isArray(comercios) ? comercios : []);
  } catch (error) {
    console.error('Error al obtener comercios:', error);
    return res.status(500).json([]); // Retorna array vacío en error para no romper el .filter() del frontend
  }
});

// GET /api/comercios/:id -> Obtener un comercio específico
router.get('/:id', async (req, res) => {
  try {
    const comercio = await Commerce.findByPk(req.params.id, {
      include: [
        { model: Label, through: { attributes: [] } },
        { model: Image, as: 'images' }
      ]
    });

    if (!comercio) {
      return res.status(404).json({ mensaje: 'Comercio no encontrado.' });
    }

    return res.status(200).json(comercio);
  } catch (error) {
    console.error('Error al obtener comercio:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// PUT /api/comercios/:id -> Actualizar perfil e imágenes
router.put('/:id', (req, res, next) => {
  // Manejo de errores de multer antes de entrar a la lógica
  uploadFields(req, res, (err) => {
    if (err) {
      console.error('Error al procesar imágenes subidas:', err);
      return res.status(400).json({ mensaje: 'Error en la subida de archivos.' });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, direccion, tel, rubro, labels, instagram, whatsapp, paginaWeb } = req.body;

    const comercio = await Commerce.findByPk(id);
    if (!comercio) {
      return res.status(404).json({ mensaje: 'Comercio no encontrado.' });
    }

    // 1. Actualizar datos de texto
    comercio.name = name || comercio.name;
    comercio.description = description !== undefined ? description : comercio.description;
    comercio.direccion = direccion !== undefined ? direccion : comercio.direccion;
    comercio.tel = tel !== undefined ? tel : comercio.tel;
    comercio.rubro = rubro !== undefined ? rubro : comercio.rubro;
    comercio.redSocial = { instagram, whatsapp, paginaWeb };
    await comercio.save();

    // 2. Procesar imágenes por puesto borrando la anterior
    const procesarImagenPorPuesto = async (fileArray, tipoPuesto) => {
      if (!fileArray || !fileArray[0]) return;

      const nuevaUrl = `/uploads/${fileArray[0].filename}`;

      const imagenVieja = await Image.findOne({
        where: { commerceId: comercio.id, tipo: tipoPuesto }
      });

      if (imagenVieja) {
        borrarArchivoFisico(imagenVieja.url);
        imagenVieja.url = nuevaUrl;
        await imagenVieja.save();
      } else {
        await Image.create({
          url: nuevaUrl,
          tipo: tipoPuesto,
          commerceId: comercio.id
        });
      }
    };

    if (req.files) {
      await procesarImagenPorPuesto(req.files.imagenFondo, 'FONDO');
      await procesarImagenPorPuesto(req.files.promo1, 'PROMO_1');
      await procesarImagenPorPuesto(req.files.promo2, 'PROMO_2');
    }

    // 3. Procesar Labels
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
});

// DELETE /api/comercios/:id -> Eliminar un comercio
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const comercio = await Commerce.findByPk(id, {
      include: [{ model: Image, as: 'images' }]
    });

    if (!comercio) {
      return res.status(404).json({ mensaje: 'El comercio no existe.' });
    }

    if (comercio.images && comercio.images.length > 0) {
      for (const img of comercio.images) {
        borrarArchivoFisico(img.url);
      }
    }

    await comercio.destroy();

    return res.status(200).json({ 
      id: Number(id),
      mensaje: `Comercio "${comercio.name}" eliminado correctamente.` 
    });

  } catch (error) {
    console.error('Error al eliminar comercio:', error);
    return res.status(500).json({ mensaje: 'Error al intentar eliminar el comercio.' });
  }
});

export default router;