import './setup.js';
import app from '../src/app.js';
import sequelize from '../src/config/database.js';

const PORT = 4001;
let server;

async function runTests() {
  console.log('🐾 Iniciando pruebas de integración...');
  
  // Start server on test port
  server = app.listen(PORT, async () => {
    console.log(`🚀 Servidor de prueba iniciado en http://localhost:${PORT}`);
    
    try {
      // Test 1: Health check
      console.log('\n🧪 Prueba 1: GET /api/health');
      const healthRes = await fetch(`http://localhost:${PORT}/api/health`);
      const healthData = await healthRes.json();
      if (healthRes.status === 200 && healthData.success === true) {
        console.log('✅ Prueba 1 PASÓ: Endpoint de salud responde correctamente.');
      } else {
        throw new Error('Prueba 1 falló');
      }

      // Test 2: Login invalid credentials
      console.log('\n🧪 Prueba 2: POST /api/auth/login (credenciales inválidas)');
      const loginInvalidRes = await fetch(`http://localhost:${PORT}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'wrong@user.com',
          password: 'wrongpassword'
        })
      });
      if (loginInvalidRes.status === 401) {
        console.log('✅ Prueba 2 PASÓ: Credenciales inválidas rechazadas correctamente con 401.');
      } else {
        throw new Error(`Prueba 2 falló: Debería haber retornado 401, retornó ${loginInvalidRes.status}`);
      }

      // Test 3: Login valid credentials
      console.log('\n🧪 Prueba 3: POST /api/auth/login (credenciales válidas)');
      const loginRes = await fetch(`http://localhost:${PORT}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'maria@email.com',
          password: 'Password123!'
        })
      });
      const loginData = await loginRes.json();
      if (loginRes.status === 200 && loginData.data.token) {
        console.log('✅ Prueba 3 PASÓ: Inicio de sesión exitoso y token devuelto.');
      } else {
        throw new Error('Prueba 3 falló');
      }

      // Test 4: Submit contact message
      console.log('\n🧪 Prueba 4: POST /api/contact');
      const contactRes = await fetch(`http://localhost:${PORT}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Prueba Integracion',
          email: 'test@email.com',
          phone: '3009999999',
          pet_type: 'Perro',
          reason: 'Consulta general',
          preferred_date: '2026-06-12',
          preferred_time: '11:00',
          message: 'Mensaje de prueba de integración.'
        })
      });
      const contactData = await contactRes.json();
      if (contactRes.status === 201 && contactData.success === true) {
        console.log('✅ Prueba 4 PASÓ: Formulario de contacto enviado correctamente.');
      } else {
        throw new Error('Prueba 4 falló');
      }

      console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE! 🎉\n');
      cleanup(0);
    } catch (error) {
      console.error('\n❌ ERROR EN LAS PRUEBAS:', error.message);
      cleanup(1);
    }
  });
}

function cleanup(exitCode) {
  if (server) {
    server.close(async () => {
      console.log('⏹️ Servidor de prueba cerrado.');
      await sequelize.close();
      console.log('🔌 Conexión de base de datos cerrada.');
      process.exit(exitCode);
    });
  } else {
    process.exit(exitCode);
  }
}

runTests();
