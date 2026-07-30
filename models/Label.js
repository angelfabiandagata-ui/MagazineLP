import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Label = sequelize.define('Label', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  label: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

export default Label;