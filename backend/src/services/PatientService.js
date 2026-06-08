import { Patient } from '../models/index.js';

class PatientService {
  /**
   * Create a new patient (pet).
   */
  async create(patientData, ownerId) {
    const patient = await Patient.create({
      ...patientData,
      owner_id: ownerId,
    });
    return patient;
  }

  /**
   * Get all patients for a specific owner.
   */
  async getByOwner(ownerId) {
    return Patient.findAll({
      where: { owner_id: ownerId },
      order: [['name', 'ASC']],
    });
  }

  /**
   * Get a single patient by ID (with owner verification).
   */
  async getById(id, ownerId = null) {
    const where = { id };
    if (ownerId) where.owner_id = ownerId;

    const patient = await Patient.findOne({ where });

    if (!patient) {
      const error = new Error('Paciente no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    return patient;
  }

  /**
   * Update a patient's info.
   */
  async update(id, updateData, ownerId) {
    const patient = await this.getById(id, ownerId);
    await patient.update(updateData);
    return patient;
  }

  /**
   * Delete a patient.
   */
  async delete(id, ownerId) {
    const patient = await this.getById(id, ownerId);
    await patient.destroy();
    return { message: 'Paciente eliminado correctamente.' };
  }

  /**
   * Get all patients (admin/vet view).
   */
  async getAll() {
    return Patient.findAll({
      include: [{ association: 'owner', attributes: ['id', 'first_name', 'last_name', 'email', 'phone'] }],
      order: [['name', 'ASC']],
    });
  }
}

export default new PatientService();
