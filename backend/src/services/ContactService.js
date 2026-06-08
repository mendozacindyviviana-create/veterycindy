import { ContactMessage } from '../models/index.js';

class ContactService {
  /**
   * Save a new contact message from the public form.
   */
  async create(messageData) {
    return ContactMessage.create(messageData);
  }

  /**
   * Get all contact messages (admin/cashier view).
   */
  async getAll() {
    return ContactMessage.findAll({
      order: [['created_at', 'DESC']],
    });
  }

  /**
   * Mark a message as read.
   */
  async markAsRead(id) {
    const message = await ContactMessage.findByPk(id);
    if (!message) {
      const error = new Error('Mensaje no encontrado.');
      error.statusCode = 404;
      throw error;
    }
    await message.update({ is_read: true });
    return message;
  }
}

export default new ContactService();
