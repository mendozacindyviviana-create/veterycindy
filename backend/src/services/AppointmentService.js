import { Appointment, Patient, User } from '../models/index.js';
import { APPOINTMENT_STATUS, PAYMENT_STATUS, ROLES } from '../config/constants.js';
import { Op } from 'sequelize';

class AppointmentService {
  /**
   * Create a new appointment.
   */
  async create(appointmentData, clientId) {
    // Verify the patient belongs to this client
    const patient = await Patient.findOne({
      where: { id: appointmentData.patient_id, owner_id: clientId },
    });

    if (!patient) {
      const error = new Error('Paciente no encontrado o no pertenece a este usuario.');
      error.statusCode = 404;
      throw error;
    }

    const appointment = await Appointment.create({
      ...appointmentData,
      client_id: clientId,
      status: APPOINTMENT_STATUS.PENDING,
      payment_status: PAYMENT_STATUS.PENDING,
    });

    return this.getById(appointment.id);
  }

  /**
   * Get appointment by ID with all associations.
   */
  async getById(id) {
    const appointment = await Appointment.findByPk(id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: User, as: 'client', attributes: { exclude: ['password'] } },
        { model: User, as: 'vet', attributes: { exclude: ['password'] } },
      ],
    });

    if (!appointment) {
      const error = new Error('Cita no encontrada.');
      error.statusCode = 404;
      throw error;
    }

    return appointment;
  }

  /**
   * Get appointments filtered by role.
   */
  async getAll(user, filters = {}) {
    const where = {};
    const { status, date_from, date_to, patient_id } = filters;

    // Filter by role
    if (user.role === ROLES.CLIENT) {
      where.client_id = user.id;
    } else if (user.role === ROLES.VET) {
      where.vet_id = user.id;
    }
    // CASHIER and ADMIN see all

    if (status) where.status = status;
    if (patient_id) where.patient_id = patient_id;
    if (date_from || date_to) {
      where.date = {};
      if (date_from) where.date[Op.gte] = date_from;
      if (date_to) where.date[Op.lte] = date_to;
    }

    return Appointment.findAll({
      where,
      include: [
        { model: Patient, as: 'patient' },
        { model: User, as: 'client', attributes: ['id', 'first_name', 'last_name', 'email', 'phone'] },
        { model: User, as: 'vet', attributes: ['id', 'first_name', 'last_name', 'specialty'] },
      ],
      order: [['date', 'ASC'], ['time', 'ASC']],
    });
  }

  /**
   * Update appointment (reschedule, change status, etc.).
   */
  async update(id, updateData, user) {
    const appointment = await this.getById(id);

    // Clients can only modify their own appointments
    if (user.role === ROLES.CLIENT && appointment.client_id !== user.id) {
      const error = new Error('No tienes permiso para modificar esta cita.');
      error.statusCode = 403;
      throw error;
    }

    await appointment.update(updateData);
    return this.getById(id);
  }

  /**
   * Vet adds clinical notes to an appointment.
   */
  async addClinicalNotes(id, notesData, user) {
    const appointment = await this.getById(id);

    if (user.role !== ROLES.ADMIN && appointment.vet_id !== user.id) {
      const error = new Error('Solo el veterinario asignado puede agregar notas clínicas.');
      error.statusCode = 403;
      throw error;
    }

    await appointment.update({
      clinical_notes: notesData.clinical_notes,
      diagnosis: notesData.diagnosis,
      treatment: notesData.treatment,
      follow_up_date: notesData.follow_up_date,
      status: notesData.status || appointment.status,
    });

    return this.getById(id);
  }

  /**
   * Process payment simulation (Cashier role).
   */
  async processPayment(id, paymentData) {
    const appointment = await this.getById(id);

    if (paymentData.approved) {
      await appointment.update({
        payment_status: PAYMENT_STATUS.APPROVED,
        payment_amount: paymentData.amount,
        payment_reference: `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        status: APPOINTMENT_STATUS.CONFIRMED,
      });
    } else {
      await appointment.update({
        payment_status: PAYMENT_STATUS.REJECTED,
        status: APPOINTMENT_STATUS.CANCELLED,
      });
    }

    return this.getById(id);
  }

  /**
   * Cancel an appointment.
   */
  async cancel(id, user) {
    const appointment = await this.getById(id);

    if (user.role === ROLES.CLIENT && appointment.client_id !== user.id) {
      const error = new Error('No tienes permiso para cancelar esta cita.');
      error.statusCode = 403;
      throw error;
    }

    await appointment.update({ status: APPOINTMENT_STATUS.CANCELLED });
    return this.getById(id);
  }
}

export default new AppointmentService();
