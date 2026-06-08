import { Router } from 'express';
import appointmentController from '../controllers/AppointmentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// All appointment routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Crear nueva cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patient_id, reason, date]
 *             properties:
 *               patient_id: { type: integer, example: 1 }
 *               vet_id: { type: integer, example: 2 }
 *               reason: { type: string, example: "Consulta general" }
 *               date: { type: string, format: date, example: "2025-02-15" }
 *               time: { type: string, example: "10:00" }
 *               observations: { type: string, example: "Mi perro no come desde hace 2 días" }
 *               is_emergency: { type: boolean, default: false }
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 */
router.post('/', authorize(ROLES.CLIENT, ROLES.ADMIN), appointmentController.create.bind(appointmentController));

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Listar citas (filtradas por rol)
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, CONFIRMED, PAID, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW] }
 *       - in: query
 *         name: date_from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: date_to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: patient_id
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de citas
 */
router.get('/', appointmentController.getAll.bind(appointmentController));

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Obtener cita por ID
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Detalle de la cita
 */
router.get('/:id', appointmentController.getById.bind(appointmentController));

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Actualizar cita (reprogramar, cambiar estado)
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date: { type: string, format: date }
 *               time: { type: string }
 *               status: { type: string }
 *               vet_id: { type: integer }
 *     responses:
 *       200:
 *         description: Cita actualizada
 */
router.put('/:id', appointmentController.update.bind(appointmentController));

/**
 * @swagger
 * /api/appointments/{id}/clinical-notes:
 *   put:
 *     summary: Agregar notas clínicas (veterinario asignado o admin)
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clinical_notes: { type: string, example: "Paciente presenta fiebre leve" }
 *               diagnosis: { type: string, example: "Gastroenteritis leve" }
 *               treatment: { type: string, example: "Dieta blanda por 3 días, antibiótico oral" }
 *               follow_up_date: { type: string, format: date, example: "2025-02-22" }
 *               status: { type: string, enum: [IN_PROGRESS, COMPLETED] }
 *     responses:
 *       200:
 *         description: Notas clínicas agregadas
 */
router.put('/:id/clinical-notes', authorize(ROLES.VET, ROLES.ADMIN), appointmentController.addClinicalNotes.bind(appointmentController));

/**
 * @swagger
 * /api/appointments/{id}/payment:
 *   post:
 *     summary: Procesar pago simulado (solo cajero)
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [approved, amount]
 *             properties:
 *               approved: { type: boolean, example: true }
 *               amount: { type: number, example: 85000 }
 *     responses:
 *       200:
 *         description: Pago procesado
 */
router.post('/:id/payment', authorize(ROLES.CASHIER, ROLES.ADMIN), appointmentController.processPayment.bind(appointmentController));

/**
 * @swagger
 * /api/appointments/{id}/cancel:
 *   put:
 *     summary: Cancelar una cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Cita cancelada
 */
router.put('/:id/cancel', appointmentController.cancel.bind(appointmentController));

export default router;
