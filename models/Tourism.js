import { DataTypes } from 'sequelize';
// Ajustá la ruta de importación para que coincida con tus otros modelos (ej: Commerce.js)
import sequelize from '../config/db.js';

const Tourism = sequelize.define('Tourism', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Turismo',
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resumen: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imagen: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'tourisms', // Nombre de la tabla en PostgreSQL
  timestamps: true,
});

export default Tourism;