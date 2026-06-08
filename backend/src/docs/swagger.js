import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VeteryCindy API',
      version: '1.0.0',
      description: 'API REST para la Clínica Veterinaria VeteryCindy — Bogotá, Colombia. Maneja autenticación, citas, pacientes, pagos simulados y mensajes de contacto.',
      contact: {
        name: 'VeteryCindy',
        email: 'prueba@veterycindy.com.co',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu token JWT obtenido del endpoint de login',
        },
      },
    },
    tags: [
      { name: 'Autenticación', description: 'Registro, login y perfil de usuario' },
      { name: 'Citas', description: 'Gestión de citas médicas veterinarias' },
      { name: 'Pacientes', description: 'Gestión de mascotas / pacientes' },
      { name: 'Contacto', description: 'Formulario de contacto público' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
