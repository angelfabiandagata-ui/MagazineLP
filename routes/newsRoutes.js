import express from 'express';
import News from '../models/News.js';

const router = express.Router();

// GET /api/noticias -> Obtener las noticias
router.get('/', async (req, res) => {
  try {
    let noticias = await News.findAll({ order: [['id', 'ASC']], limit: 3 });

    // Si la tabla está vacía, creamos 3 noticias por defecto para arrancar
    if (noticias.length === 0) {
      noticias = await News.bulkCreate([
        {
          id: 1,
          categoria: 'Ciudad',
          fecha: '01 Ago 2026',
          titulo: 'Nuevas obras de pavimentación e iluminación en La Punta',
          resumen: 'Avanzan los trabajos de mejora urbana en los accesos principales para garantizar mayor seguridad vial.',
          imagen: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 2,
          categoria: 'Eventos',
          fecha: '02 Ago 2026',
          titulo: 'Gran Feria de Artesanos y Emprendedores este fin de semana',
          resumen: 'Este sábado y domingo la plaza cívica reunirá a más de 50 puestos con gastronomía, artesanías y shows en vivo.',
          imagen: 'https://images.unsplash.com/photo-1531058240690-006c446962d8?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 3,
          categoria: 'Cultura',
          fecha: '03 Ago 2026',
          titulo: 'Apertura de inscripciones para los Talleres Culturales 2026',
          resumen: 'Conoce la oferta de cursos gratuitos de música, teatro y artes plásticas disponibles para todas las edades.',
          imagen: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80'
        }
      ]);
    }

    return res.status(200).json(noticias);
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    return res.status(500).json({ mensaje: 'Error al obtener las noticias.' });
  }
});

// PUT /api/noticias/:id -> Actualizar una noticia específica
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { categoria, fecha, titulo, resumen, imagen } = req.body;

    const noticia = await News.findByPk(id);
    if (!noticia) {
      return res.status(404).json({ mensaje: 'Noticia no encontrada.' });
    }

    noticia.categoria = categoria || noticia.categoria;
    noticia.fecha = fecha || noticia.fecha;
    noticia.titulo = titulo || noticia.titulo;
    noticia.resumen = resumen || noticia.resumen;
    noticia.imagen = imagen || noticia.imagen;

    await noticia.save();

    return res.status(200).json({ mensaje: 'Noticia actualizada con éxito', noticia });
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    return res.status(500).json({ mensaje: 'Error al actualizar la noticia.' });
  }
});

export default router;