import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { ROLES } from '../config/constants.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM(...Object.values(ROLES)),
    allowNull: false,
    defaultValue: ROLES.CLIENT,
  },
  document_id: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Cédula / ID del usuario',
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  specialty: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Solo aplica para veterinarios',
  },
  license_number: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Matrícula profesional del veterinario',
  },
}, {
  tableName: 'users',
  timestamps: true,
});

export default User;
