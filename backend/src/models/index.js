import User from './User.js';
import Patient from './Patient.js';
import Appointment from './Appointment.js';
import ContactMessage from './ContactMessage.js';

// ─── Associations ────────────────────────────────────
// A User (CLIENT) owns many Patients
User.hasMany(Patient, { foreignKey: 'owner_id', as: 'pets' });
Patient.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// A User (CLIENT) has many Appointments
User.hasMany(Appointment, { foreignKey: 'client_id', as: 'clientAppointments' });
Appointment.belongsTo(User, { foreignKey: 'client_id', as: 'client' });

// A User (VET) has many Appointments
User.hasMany(Appointment, { foreignKey: 'vet_id', as: 'vetAppointments' });
Appointment.belongsTo(User, { foreignKey: 'vet_id', as: 'vet' });

// An Appointment belongs to a Patient
Patient.hasMany(Appointment, { foreignKey: 'patient_id', as: 'appointments' });
Appointment.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });

export { User, Patient, Appointment, ContactMessage };
