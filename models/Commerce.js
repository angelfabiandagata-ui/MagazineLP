// models/Commerce.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Commerce = sequelize.define('Commerce', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  tel: { type: DataTypes.STRING },
  direccion: { type: DataTypes.STRING },
  rubro: { type: DataTypes.STRING },
  
  // 👈 Nuevos campos para las rutas de las imágenes subidas
  imagenFondo: { type: DataTypes.STRING },
  promo1: { type: DataTypes.STRING },
  promo2: { type: DataTypes.STRING },

  ubicacion: { type: DataTypes.STRING },
  pagina: { type: DataTypes.STRING },
  redSocial: { type: DataTypes.JSON }
});

export default Commerce;