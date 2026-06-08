import { Router } from 'express';
import authController from '../controllers/AuthController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, email, password]
 *             properties:
 *               first_name: { type: string, example: "María" }
 *               last_name: { type: string, example: "Gómez" }
 *               email: { type: string, example: "maria@email.com" }
 *               password: { type: string, example: "MiClave123!" }
 *               phone: { type: string, example: "3010001234" }
 *               role: { type: string, enum: [CLIENT, VET, CASHIER, ADMIN], default: CLIENT }
 *               document_id: { type: string, example: "1020304050" }
 *               address: { type: string, example: "Calle 15 #8-42, Bogotá" }
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       409:
 *         description: Email ya registrado
 */
router.post('/register', authController.register.bind(authController));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "maria@email.com" }
 *               password: { type: string, example: "MiClave123!" }
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token JWT
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', authController.login.bind(authController));

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: No autenticado
 */
router.get('/profile', authenticate, authController.getProfile.bind(authController));

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Actualizar perfil del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name: { type: string }
 *               last_name: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *     responses:
 *       200:
 *         description: Perfil actualizado
 */
router.put('/profile', authenticate, authController.updateProfile.bind(authController));

export default router;
