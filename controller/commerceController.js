import { Commerce, Image, Label, User } from '../models/index.js';

// 1. Obtener todos los comercios (blindado para que SIEMPRE devuelva un Array)
export const getAllCommerces = async (req, res) => {
  try {
    const comercios = await Commerce.findAll({
      include: [
        { model: Image }, // Si usas alias en models/index.js usa: { model: Image, as: 'images' }
        { model: Label, through: { attributes: [] } }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(Array.isArray(comercios) ? comercios : []);
  } catch (error) {
    console.error('Error al obtener comercios:', error);
    // ⚠️ Retornamos array vacío en lugar de objeto para no romper .filter() o .map() en el Frontend
    return res.status(500).json([]);
  }
};

// 2. Obtener un comercio por ID
export const getCommerceById = async (req, res) => {
  try {
    const { id } = req.params;
    const comercio = await Commerce.findByPk(id, {
      include: [
        { model: Image },
        { model: Label, through: { attributes: [] } },
        { model: User, attributes: ['username', 'email'] }
      ]
    });

    if (!comercio) {
      return res.status(404).json({ error: 'Comercio no encontrado' });
    }

    return res.status(200).json(comercio);
  } catch (error) {
    console.error('Error al obtener el comercio:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 3. Actualizar los datos del comercio
export const updateCommerce = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, tel, direccion, ubicacion, pagina, redSocial } = req.body;

    const comercio = await Commerce.findByPk(id);

    if (!comercio) {
      return res.status(404).json({ error: 'Comercio no encontrado' });
    }

    await comercio.update({
      name,
      description,
      tel,
      direccion,
      ubicacion,
      pagina,
      redSocial
    });

    // Devolvemos el comercio actualizado con sus asociaciones incluidas
    const comercioActualizado = await Commerce.findByPk(id, {
      include: [{ model: Image }, { model: Label }]
    });

    return res.status(200).json(comercioActualizado);
  } catch (error) {
    console.error('Error al actualizar el comercio:', error);
    return res.status(500).json({ error: 'Error al actualizar la información' });
  }
};

// 4. Eliminar un comercio
export const deleteCommerce = async (req, res) => {
  try {
    const { id } = req.params;
    const comercio = await Commerce.findByPk(id);

    if (!comercio) {
      return res.status(404).json({ error: 'Comercio no encontrado' });
    }

    await comercio.destroy();
    return res.status(200).json({ id: Number(id), mensaje: 'Comercio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el comercio:', error);
    return res.status(500).json({ error: 'Error al intentar eliminar el comercio' });
  }
};