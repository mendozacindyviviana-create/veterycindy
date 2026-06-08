import request from 'supertest';
import app from '../src/app.js';
import sequelize from '../src/config/database.js';

describe('VeteryCindy API Integration Tests', () => {
  // Close database connection after all tests
  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/health', () => {
    it('should return 200 health check status', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('VeteryCindy API is running');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should fail with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid@email.com',
          password: 'WrongPassword',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should succeed with valid credentials and return JWT', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'maria@email.com',
          password: 'Password123!',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe('maria@email.com');
    });
  });

  describe('POST /api/contact', () => {
    it('should successfully submit contact message', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({
          name: 'Test Tester',
          email: 'test@tester.com',
          phone: '3000000000',
          pet_type: 'Perro',
          reason: 'Consulta general',
          preferred_date: '2026-06-15',
          preferred_time: '10:00',
          message: 'My pet needs checking',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
    });
  });
});
