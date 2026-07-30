import express from 'express';
import Commerce from '../models/Commerce.js';
import Label from '../models/Label.js';
import Image from '../models/Image.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Configuración de los campos para subir archivos
const uploadFields = upload.fields([
  { name: 'imagenFondo', maxCount: 1 },
  { name: 'promo1', maxCount: 1 },
  { name: 'promo2', maxCount: 1 }
]);

// GET /api/comercios -> Devuelve todos los comercios para la vista de Inicio
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
      ]
    });

    return res.status(200).json(comercios);
  } catch (error) {
    console.error('Error al obtener comercios:', error);
    return res.status(500).json({ mensaje: 'Error al cargar la lista de comercios.' });
  }
});

// GET /api/comercios/:id -> Obtener un comercio específico por ID
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

// PUT /api/comercios/:id -> Actualizar perfil, imágenes y etiquetas
router.put('/:id', uploadFields, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, direccion, tel, rubro, labels, instagram, whatsapp } = req.body;

    const comercio = await Commerce.findByPk(id);
    if (!comercio) {
      return res.status(404).json({ mensaje: 'Comercio no encontrado.' });
    }

    // 1. Actualizar datos de texto
    comercio.name = name || comercio.name;
    comercio.description = description;
    comercio.direccion = direccion;
    comercio.tel = tel;
    comercio.rubro = rubro;
    comercio.redSocial = { instagram, whatsapp };
    await comercio.save();

    // 2. Guardar o reemplazar Imágenes
    if (req.files) {
      const guardarOReemplazarImagen = async (fileArray, tipoEnum) => {
        if (fileArray && fileArray[0]) {
          const urlPath = `/uploads/${fileArray[0].filename}`;
          const [imgRecord] = await Image.findOrCreate({
            where: { commerceId: comercio.id, tipo: tipoEnum },
            defaults: { url: urlPath, tipo: tipoEnum, commerceId: comercio.id }
          });
          imgRecord.url = urlPath;
          await imgRecord.save();
        }
      };

      await guardarOReemplazarImagen(req.files.imagenFondo, 'FONDO');
      await guardarOReemplazarImagen(req.files.promo1, 'PROMO_1');
      await guardarOReemplazarImagen(req.files.promo2, 'PROMO_2');
    }

    // 3. Procesar Labels (Robusto para arrays o strings JSON)
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
          // Extraemos el texto limpio, sirviendo si es objeto o string directa
          const texto = typeof item === 'object' ? (item.label || item.name) : item;
          
          if (texto && typeof texto === 'string' && texto.trim() !== '') {
            const [labelRecord] = await Label.findOrCreate({
              where: { label: texto.trim().toLowerCase() }
            });
            labelInstances.push(labelRecord);
          }
        }

        // Asocia e invalida/reemplaza las viejas relaciones de la tabla pivote
        await comercio.setLabels(labelInstances);
      }
    }

    // 4. Traer el comercio actualizado con ambas asociaciones
    const comercioActualizado = await Commerce.findByPk(id, {
      include: [
        { 
          model: Label, 
          through: { attributes: [] } 
        },
        { 
          model: Image, 
          as: 'images' 
        }
      ]
    });

    return res.status(200).json({
      mensaje: 'Perfil e imágenes actualizados con éxito',
      comercio: comercioActualizado
    });

  } catch (error) {
    console.error('Error al actualizar comercio:', error);
    return res.status(500).json({ mensaje: 'Error al procesar los datos.' });
  }
});

export default router;