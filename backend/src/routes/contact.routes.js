import { Router } from 'express';
import contactController from '../controllers/ContactController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = Router();

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Enviar mensaje de contacto (público, sin autenticación)
 *     tags: [Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name: { type: string, example: "Juan Pérez" }
 *               email: { type: string, example: "juan@email.com" }
 *               phone: { type: string, example: "3010001234" }
 *               pet_type: { type: string, example: "Perro" }
 *               reason: { type: string, example: "Consulta general" }
 *               preferred_date: { type: string, format: date }
 *               preferred_time: { type: string, example: "10:00" }
 *               message: { type: string, example: "Mi perro está un poco decaído" }
 *     responses:
 *       201:
 *         description: Mensaje recibido exitosamente
 */
router.post('/', contactController.create.bind(contactController));

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: Listar todos los mensajes de contacto (admin/cajero)
 *     tags: [Contacto]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mensajes
 */
router.get('/', authenticate, authorize(ROLES.ADMIN, ROLES.CASHIER), contactController.getAll.bind(contactController));

/**
 * @swagger
 * /api/contact/{id}/read:
 *   put:
 *     summary: Marcar mensaje como leído
 *     tags: [Contacto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Mensaje marcado como leído
 */
router.put('/:id/read', authenticate, authorize(ROLES.ADMIN, ROLES.CASHIER), contactController.markAsRead.bind(contactController));

export default router;
