import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Ajustá la ruta a tu conexión de DB

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Ciudad',
  },
  fecha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  titulo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  resumen: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imagen: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default News;