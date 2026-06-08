import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { APPOINTMENT_STATUS, PAYMENT_STATUS } from '../config/constants.js';

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'patients', key: 'id' },
  },
  vet_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    comment: 'Veterinario asignado',
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    comment: 'Dueño de la mascota que agenda la cita',
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Motivo de la cita',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: true,
    comment: 'Hora de la cita, nulo si es emergencia',
  },
  status: {
    type: DataTypes.ENUM(...Object.values(APPOINTMENT_STATUS)),
    allowNull: false,
    defaultValue: APPOINTMENT_STATUS.PENDING,
  },
  payment_status: {
    type: DataTypes.ENUM(...Object.values(PAYMENT_STATUS)),
    allowNull: false,
    defaultValue: PAYMENT_STATUS.PENDING,
  },
  payment_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: 'Monto del servicio en COP',
  },
  payment_reference: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Referencia simulada del pago',
  },
  clinical_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notas clínicas del veterinario',
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  treatment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  follow_up_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Fecha sugerida para seguimiento',
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observaciones del cliente al agendar',
  },
  is_emergency: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'appointments',
  timestamps: true,
});

export default Appointment;
