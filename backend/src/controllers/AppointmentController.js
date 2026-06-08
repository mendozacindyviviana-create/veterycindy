import appointmentService from '../services/AppointmentService.js';

class AppointmentController {
  async create(req, res, next) {
    try {
      const appointment = await appointmentService.create(req.body, req.user.id);
      res.status(201).json({
        success: true,
        message: 'Cita creada exitosamente.',
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const appointments = await appointmentService.getAll(req.user, req.query);
      res.json({ success: true, data: appointments });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const appointment = await appointmentService.getById(req.params.id);
      res.json({ success: true, data: appointment });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const appointment = await appointmentService.update(req.params.id, req.body, req.user);
      res.json({
        success: true,
        message: 'Cita actualizada exitosamente.',
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }

  async addClinicalNotes(req, res, next) {
    try {
      const appointment = await appointmentService.addClinicalNotes(
        req.params.id,
        req.body,
        req.user
      );
      res.json({
        success: true,
        message: 'Notas clínicas agregadas exitosamente.',
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }

  async processPayment(req, res, next) {
    try {
      const appointment = await appointmentService.processPayment(req.params.id, req.body);
      res.json({
        success: true,
        message: req.body.approved ? 'Pago aprobado y cita confirmada.' : 'Pago rechazado y cita cancelada.',
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req, res, next) {
    try {
      const appointment = await appointmentService.cancel(req.params.id, req.user);
      res.json({
        success: true,
        message: 'Cita cancelada exitosamente.',
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AppointmentController();
