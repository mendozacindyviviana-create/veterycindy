import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ContactMessage = sequelize.define('ContactMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  pet_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  preferred_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  preferred_time: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'contact_messages',
  timestamps: true,
});

export default ContactMessage;
