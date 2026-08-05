import express from 'express';
// Ajustá la importación según tu modelo de Sequelize o tabla
import Tourism from '../models/Tourism.js'; 

const router = express.Router();

// GET /api/turismo -> Devuelve todos los puntos turísticos
router.get('/', async (req, res) => {
  try {
    let atractivos = await Tourism.findAll({ order: [['id', 'ASC']] });

    // Si la tabla está vacía, creamos los 3 puntos iniciales
    if (atractivos.length === 0) {
      atractivos = await Tourism.bulkCreate([
        {
          id: 1,
          titulo: "Réplica del Cabildo Histórico de 1810",
          categoria: "Patrimonio",
          ubicacion: "Av. Serrana s/n",
          resumen: "Monumento histórico nacional a escala real que recrea el edificio de la Revolución de Mayo.",
          imagen: "https://agenciasanluis.com/wp-content/uploads/2018/04/CABILDO-1.jpg"
        },
        {
          id: 2,
          titulo: "Parque Astronómico La Punta (PALP)",
          categoria: "Ciencia & Familia",
          ubicacion: "Campus ULP",
          resumen: "Un espacio único para explorar el universo con su Planetario digital y observatorio.",
          imagen: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80"
        },
        {
          id: 3,
          titulo: "Réplica de la Casa de Tucumán",
          categoria: "Cultura",
          ubicacion: "Av. Serrana",
          resumen: "Fiel recreación del histórico sitio de la Declaración de la Independencia.",
          imagen: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
        }
      ]);
    }

    return res.status(200).json(atractivos);
  } catch (error) {
    console.error("Error al obtener turismo:", error);
    return res.status(500).json({ mensaje: "Error al obtener datos de turismo" });
  }
});

// PUT /api/turismo/:id -> Actualiza o crea el punto turístico
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, categoria, ubicacion, resumen, imagen } = req.body;

    let punto = await Tourism.findByPk(id);

    // Si no existe el registro en PostgreSQL, lo crea
    if (!punto) {
      punto = await Tourism.create({
        id,
        titulo,
        categoria,
        ubicacion,
        resumen,
        imagen
      });
      return res.status(201).json({ mensaje: "Punto turístico creado con éxito", punto });
    }

    // Si existe, actualiza sus campos
    punto.titulo = titulo;
    punto.categoria = categoria;
    punto.ubicacion = ubicacion;
    punto.resumen = resumen;
    punto.imagen = imagen;

    await punto.save();
    return res.status(200).json({ mensaje: "Punto turístico actualizado con éxito", punto });

  } catch (error) {
    console.error("Error al guardar punto turístico:", error);
    return res.status(500).json({ mensaje: "Error interno al guardar en la BD" });
  }
});

export default router;