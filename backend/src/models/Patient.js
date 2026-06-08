import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nombre de la mascota',
  },
  species: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Especie: Perro, Gato, Ave, Conejo, etc.',
  },
  breed: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Raza de la mascota',
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Peso en kilogramos',
  },
  sex: {
    type: DataTypes.ENUM('MALE', 'FEMALE'),
    allowNull: true,
  },
  microchip: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Número de microchip',
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notas generales sobre el paciente',
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
}, {
  tableName: 'patients',
  timestamps: true,
});

export default Patient;
