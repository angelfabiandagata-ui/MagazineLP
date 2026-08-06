import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('FONDO', 'PROMO_1', 'PROMO_2'),
    allowNull: false,
  },
});

export default Image;