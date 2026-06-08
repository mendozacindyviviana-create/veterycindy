import contactService from '../services/ContactService.js';

class ContactController {
  /** Public endpoint — no auth required */
  async create(req, res, next) {
    try {
      const message = await contactService.create(req.body);
      res.status(201).json({
        success: true,
        message: '¡Gracias! Tu mensaje ha sido recibido. Te contactaremos pronto.',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  /** Admin/Cashier — list all messages */
  async getAll(req, res, next) {
    try {
      const messages = await contactService.getAll();
      res.json({ success: true, data: messages });
    } catch (error) {
      next(error);
    }
  }

  /** Mark a message as read */
  async markAsRead(req, res, next) {
    try {
      const message = await contactService.markAsRead(req.params.id);
      res.json({
        success: true,
        message: 'Mensaje marcado como leído.',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ContactController();
