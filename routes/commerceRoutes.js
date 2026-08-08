// PUT /api/comercios/:id
router.put('/:id', verificarToken, (req, res, next) => {
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

    const comercio = await Commerce.findByPk(id);
    if (!comercio) {
      return res.status(404).json({ mensaje: 'Comercio no encontrado.' });
    }

    // --- AUTORIZACIÓN VÁLIDA PARA UUID ---
    const idUsuarioToken = req.usuario.id; // UUID del usuario logueado
    
    // Si la relación en Sequelize se llama userId (o UsuarioId)
    const idDuenioComercio = comercio.userId || comercio.UserId;

    const esPropietario = idDuenioComercio && String(idDuenioComercio) === String(idUsuarioToken);
    const esAdmin = Boolean(req.usuario.esAdmin);

    if (!esPropietario && !esAdmin) {
      return res.status(403).json({ mensaje: 'No tenés permisos para modificar este comercio.' });
    }

    const { name, description, direccion, tel, rubro, labels, instagram, whatsapp, paginaWeb } = req.body;

    // Actualización de datos...
    comercio.name = name || comercio.name;
    comercio.description = description !== undefined ? description : comercio.description;
    comercio.direccion = direccion !== undefined ? direccion : comercio.direccion;
    comercio.tel = tel !== undefined ? tel : comercio.tel;
    comercio.rubro = rubro !== undefined ? rubro : comercio.rubro;
    comercio.redSocial = { instagram, whatsapp, paginaWeb };
    await comercio.save();

    // Procesar imágenes...
    const procesarImagenPorPuesto = async (fileArray, tipoPuesto) => {
      if (!fileArray || !fileArray[0]) return;
      const nuevaUrl = fileArray[0].path || fileArray[0].secure_url;

      const imagenVieja = await Image.findOne({
        where: { commerceId: comercio.id, tipo: tipoPuesto }
      });

      if (imagenVieja) {
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

    // Procesar Labels...
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