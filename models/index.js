import Commerce from './Commerce.js';
import User from './User.js';
import Label from './Label.js';
import Image from './Image.js';

// Relación Commerce <-> Label (Muchos a Muchos)
Commerce.belongsToMany(Label, { through: 'CommerceLabels' });
Label.belongsToMany(Commerce, { through: 'CommerceLabels' });

// Relación Commerce <-> Image (Un Comercio tiene muchas Imágenes)
Commerce.hasMany(Image, { foreignKey: 'commerceId', as: 'images', onDelete: 'CASCADE' });
Image.belongsTo(Commerce, { foreignKey: 'commerceId' });

User.hasOne(Commerce, { foreignKey: 'userId' });
Commerce.belongsTo(User, { foreignKey: 'userId' });

export { Commerce, Label, Image };