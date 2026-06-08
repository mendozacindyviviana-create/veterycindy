import patientService from '../services/PatientService.js';
import { ROLES } from '../config/constants.js';

class PatientController {
  async create(req, res, next) {
    try {
      const patient = await patientService.create(req.body, req.user.id);
      res.status(201).json({
        success: true,
        message: 'Mascota registrada exitosamente.',
        data: patient,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyPets(req, res, next) {
    try {
      const patients = await patientService.getByOwner(req.user.id);
      res.json({ success: true, data: patients });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const ownerId = req.user.role === ROLES.CLIENT ? req.user.id : null;
      const patient = await patientService.getById(req.params.id, ownerId);
      res.json({ success: true, data: patient });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const patient = await patientService.update(req.params.id, req.body, req.user.id);
      res.json({
        success: true,
        message: 'Información de la mascota actualizada.',
        data: patient,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await patientService.delete(req.params.id, req.user.id);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const patients = await patientService.getAll();
      res.json({ success: true, data: patients });
    } catch (error) {
      next(error);
    }
  }
}

export default new PatientController();
