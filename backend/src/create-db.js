import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root12345',
    });

    console.log('🐾 Conectado a MySQL. Creando la base de datos si no existe...');
    await connection.query('CREATE DATABASE IF NOT EXISTS \`veterycindy\`;');
    console.log('✅ Base de datos "veterycindy" creada o ya existente.');
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al crear la base de datos:', err.message);
    process.exit(1);
  }
}

createDatabase();
