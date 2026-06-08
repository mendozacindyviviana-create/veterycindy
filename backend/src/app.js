import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import sequelize from './config/database.js';
import swaggerSpec from './docs/swagger.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import models to register associations
import './models/index.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import patientRoutes from './routes/patient.routes.js';
import contactRoutes from './routes/contact.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ──────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Documentation ──────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'VeteryCindy API Docs',
}));

// ─── Routes ─────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'VeteryCindy API is running 🐾', timestamp: new Date().toISOString() });
});

// ─── Error Handler ──────────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente.');

    // Sync database (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`🐾 VeteryCindy API corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación Swagger en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    process.exit(1);
  }
};

// Only start if not being imported for testing
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
