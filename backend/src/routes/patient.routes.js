import { Router } from 'express';
import patientController from '../controllers/PatientController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Registrar nueva mascota
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, species]
 *             properties:
 *               name: { type: string, example: "Luna" }
 *               species: { type: string, example: "Perro" }
 *               breed: { type: string, example: "Golden Retriever" }
 *               color: { type: string, example: "Dorado" }
 *               birth_date: { type: string, format: date, example: "2022-03-15" }
 *               weight: { type: number, example: 28.5 }
 *               sex: { type: string, enum: [MALE, FEMALE] }
 *               microchip: { type: string }
 *               allergies: { type: string }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Mascota registrada
 */
router.post('/', authorize(ROLES.CLIENT, ROLES.ADMIN), patientController.create.bind(patientController));

/**
 * @swagger
 * /api/patients/my-pets:
 *   get:
 *     summary: Obtener mis mascotas
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mascotas del usuario
 */
router.get('/my-pets', patientController.getMyPets.bind(patientController));

/**
 * @swagger
 * /api/patients/all:
 *   get:
 *     summary: Obtener todos los pacientes (veterinario/admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de pacientes
 */
router.get('/all', authorize(ROLES.VET, ROLES.ADMIN, ROLES.CASHIER), patientController.getAll.bind(patientController));

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Obtener paciente por ID
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Detalle del paciente
 */
router.get('/:id', patientController.getById.bind(patientController));

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Actualizar información de mascota
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paciente actualizado
 */
router.put('/:id', patientController.update.bind(patientController));

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Eliminar mascota
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paciente eliminado
 */
router.delete('/:id', patientController.delete.bind(patientController));

export default router;
