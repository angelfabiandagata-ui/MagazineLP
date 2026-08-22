import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
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

// 1. GET /api/comercios/admin/todos (Protegido - Devuelve TODOS los comercios para el Admin)
router.get('/admin/todos', verificarToken, async (req, res) => {
  try {
    if (!req.usuario.esAdmin) {
      return res.status(403).json({ mensaje: 'Acceso denegado: solo administradores.' });
    }

    const comercios = await Commerce.findAll({
      include: [
        { model: Label, through: { attributes: [] } },
        { model: Image, as: 'images' }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(comercios);
  } catch (error) {
    console.error('Error al obtener todos los comercios (admin):', error);
    return res.status(500).json({ mensaje: 'Error al consultar la base de datos.' });
  }
});

// 2. PUT /api/comercios/:id/estado (Protegido - Dar de Alta / Dar de Baja sin eliminar)
router.put('/:id/estado', verificarToken, async (req, res) => {
  try {
    if (!req.usuario.esAdmin) {
      return res.status(403).json({ mensaje: 'Acceso denegado: solo administradores.' });
    }

    const { id } = req.params;
    const { activo } = req.body;

    const comercio = await Commerce.findByPk(id);
    if (!comercio) {
      return res.status(404).json({ mensaje: 'Comercio no encontrado.' });
    }

    comercio.activo = Boolean(activo);
    await comercio.save();

    return res.status(200).json({ 
      mensaje: `Comercio ${comercio.activo ? 'activado (dado de alta)' : 'pausado (dado de baja)'} con éxito.`,
      comercio 
    });
  } catch (error) {
    console.error('Error al cambiar estado del comercio:', error);
    return res.status(500).json({ mensaje: 'Error al actualizar el estado.' });
  }
});

// 3. GET /api/comercios (Público - Solo comercios ACTIVOS en la revista)
router.get('/', async (req, res) => {
  try {
    const comercios = await Commerce.findAll({
      where: { activo: true }, // 👈 Solo muestra comercios con el alta confirmada
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

// 4. GET /api/comercios/:id (Público)
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

// 5. PUT /api/comercios/:id (Protegido - Edición de datos e imágenes)
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

    const esPropietario = String(comercio.id) === String(req.usuario.id);
    const esAdmin = Boolean(req.usuario.esAdmin);

    if (!esPropietario && !esAdmin) {
      return res.status(403).json({ mensaje: 'No tenés permisos para modificar este comercio.' });
    }

    const { name, description, direccion, tel, rubro, labels, instagram, whatsapp, paginaWeb, ubicacion } = req.body;

    comercio.name = name || comercio.name;
    comercio.description = description !== undefined ? description : comercio.description;
    comercio.direccion = direccion !== undefined ? direccion : comercio.direccion;
    comercio.tel = tel !== undefined ? tel : comercio.tel;
    comercio.rubro = rubro !== undefined ? rubro : comercio.rubro;
    
    comercio.redSocial = { 
      instagram, 
      whatsapp, 
      paginaWeb, 
      ubicacion: ubicacion !== undefined ? ubicacion : comercio.redSocial?.ubicacion 
    };
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
});

// 6. DELETE /api/comercios/:id/imagen/:tipo (Protegido - Borra de DB y Cloudinary)
router.delete('/:id/imagen/:tipo', verificarToken, async (req, res) => {
  try {
    const { id, tipo } = req.params;
    const comercio = await Commerce.findByPk(id);

    if (!comercio) return res.status(404).json({ mensaje: 'Comercio no encontrado.' });

    const esPropietario = String(comercio.id) === String(req.usuario.id);
    const esAdmin = Boolean(req.usuario.esAdmin);

    if (!esPropietario && !esAdmin) {
      return res.status(403).json({ mensaje: 'No tenés permisos para modificar este comercio.' });
    }

    const imagen = await Image.findOne({ 
      where: { commerceId: id, tipo: tipo.toUpperCase() } 
    });

    if (imagen) {
      if (imagen.url && imagen.url.includes('cloudinary.com')) {
        try {
          const parts = imagen.url.split('/');
          const fileName = parts.pop().split('.')[0];
          const folder = parts.pop();
          const publicId = `${folder}/${fileName}`;

          await cloudinary.uploader.destroy(publicId);
        } catch (cErr) {
          console.error('Error al borrar imagen de Cloudinary:', cErr);
        }
      }

      await imagen.destroy();
    }

    return res.status(200).json({ mensaje: `Imagen ${tipo} eliminada correctamente.` });
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    return res.status(500).json({ mensaje: 'Error interno al intentar eliminar la imagen.' });
  }
});

// 7. DELETE /api/comercios/:id (Protegido - Elimina definitivamente)
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const comercio = await Commerce.findByPk(id);

    if (!comercio) return res.status(404).json({ mensaje: 'El comercio no existe.' });

    const esPropietario = String(comercio.id) === String(req.usuario.id);
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
});

export default router;