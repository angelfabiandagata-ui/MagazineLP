import { Commerce, Image, Label, User } from '../models/index.js';

// 1. Obtener todos los comercios con sus imágenes y etiquetas (para la vista principal 100vh)
export const getAllCommerces = async (req, res) => {
  try {
    const comercios = await Commerce.findAll({
      include: [
        { model: Image },
        { model: Label }
      ]
    });
    res.status(200).json(comercios);
  } catch (error) {
    console.error('Error al obtener comercios:', error);
    res.status(500).json({ error: 'Error al obtener la lista de comercios' });
  }
};

// 2. Obtener un comercio por su ID
export const getCommerceById = async (req, res) => {
  try {
    const { id } = req.params;
    const comercio = await Commerce.findByPk(id, {
      include: [
        { model: Image },
        { model: Label },
        { model: User, attributes: ['username', 'email'] } // Evitamos traer la contraseña
      ]
    });

    if (!comercio) {
      return res.status(404).json({ error: 'Comercio no encontrado' });
    }

    res.status(200).json(comercio);
  } catch (error) {
    console.error('Error al obtener el comercio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 3. Actualizar los datos del comercio (Perfil)
export const updateCommerce = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, tel, direccion, ubicacion, pagina, redSocial } = req.body;

    const comercio = await Commerce.findByPk(id);

    if (!comercio) {
      return res.status(404).json({ error: 'Comercio no encontrado' });
    }

    // Actualizamos los campos
    await comercio.update({
      name,
      description,
      tel,
      direccion,
      ubicacion,
      pagina,
      redSocial
    });

    res.status(200).json({ mensaje: 'Comercio actualizado con éxito', comercio });
  } catch (error) {
    console.error('Error al actualizar el comercio:', error);
    res.status(500).json({ error: 'Error al actualizar la información' });
  }
};

// 4. Eliminar / Dar de baja un comercio
export const deleteCommerce = async (req, res) => {
  try {
    const { id } = req.params;
    const comercio = await Commerce.findByPk(id);

    if (!comercio) {
      return res.status(404).json({ error: 'Comercio no encontrado' });
    }

    await comercio.destroy();
    res.status(200).json({ mensaje: 'Comercio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el comercio:', error);
    res.status(500).json({ error: 'Error al intentar eliminar el comercio' });
  }
};