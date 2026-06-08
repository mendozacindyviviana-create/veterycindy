import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';
import { User, Patient, Appointment, ContactMessage } from '../models/index.js';
import { ROLES, APPOINTMENT_STATUS, PAYMENT_STATUS } from '../config/constants.js';

dotenv.config();

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos.');

    // Force sync to recreate tables
    await sequelize.sync({ force: true });
    console.log('✅ Tablas recreadas.');

    const password = await bcrypt.hash('Password123!', 12);

    // ──── USERS ─────────────────────────────────────
    const users = await User.bulkCreate([
      // Clients
      {
        first_name: 'María Camila', last_name: 'Gómez Rodríguez', email: 'maria@email.com',
        password, phone: '3011234567', role: ROLES.CLIENT,
        document_id: '1020345678', address: 'Calle 72 #10-34, Chapinero, Bogotá',
      },
      {
        first_name: 'Andrés Felipe', last_name: 'Velásquez Torres', email: 'andres@email.com',
        password, phone: '3009876543', role: ROLES.CLIENT,
        document_id: '1030456789', address: 'Carrera 15 #85-21, Usaquén, Bogotá',
      },
      {
        first_name: 'Valentina', last_name: 'Ruiz Hernández', email: 'valentina@email.com',
        password, phone: '3201112233', role: ROLES.CLIENT,
        document_id: '1040567890', address: 'Calle 116 #45-12, Suba, Bogotá',
      },
      {
        first_name: 'Carlos Eduardo', last_name: 'Martínez López', email: 'carlos@email.com',
        password, phone: '3156667788', role: ROLES.CLIENT,
        document_id: '1050678901', address: 'Av Boyacá #68-50, Kennedy, Bogotá',
      },
      // Vets
      {
        first_name: 'Dra. Laura', last_name: 'Mendoza Ríos', email: 'dra.laura@veterycindy.com',
        password, phone: '3017778899', role: ROLES.VET,
        document_id: '80123456', address: 'Calle 15 #8-42, Centro, Bogotá',
        specialty: 'Medicina General y Cirugía', license_number: 'MV-2018-4521',
      },
      {
        first_name: 'Dr. Santiago', last_name: 'Herrera Vargas', email: 'dr.santiago@veterycindy.com',
        password, phone: '3024445566', role: ROLES.VET,
        document_id: '80234567', address: 'Calle 15 #8-42, Centro, Bogotá',
        specialty: 'Dermatología y Odontología Veterinaria', license_number: 'MV-2020-7832',
      },
      // Cashier
      {
        first_name: 'Juliana', last_name: 'Ospina García', email: 'juliana@veterycindy.com',
        password, phone: '3039991122', role: ROLES.CASHIER,
        document_id: '1060789012', address: 'Calle 15 #8-42, Centro, Bogotá',
      },
      // Admin
      {
        first_name: 'Cindy', last_name: 'Admin', email: 'admin@veterycindy.com',
        password, phone: '3010003030', role: ROLES.ADMIN,
        document_id: '1000000001', address: 'Calle 15 #8-42, Centro, Bogotá',
      },
    ]);

    console.log(`✅ ${users.length} usuarios creados.`);

    // ──── PATIENTS (PETS) ───────────────────────────
    const patients = await Patient.bulkCreate([
      // María's pets
      {
        name: 'Luna', species: 'Perro', breed: 'Golden Retriever', color: 'Dorado',
        birth_date: '2022-03-15', weight: 28.5, sex: 'FEMALE',
        microchip: 'COL-2022-00451', allergies: 'Sensibilidad al pollo', notes: 'Muy cariñosa, le dan ansiedad las agujas.',
        owner_id: users[0].id,
      },
      {
        name: 'Max', species: 'Gato', breed: 'Siamés', color: 'Crema con puntos oscuros',
        birth_date: '2021-07-22', weight: 4.2, sex: 'MALE',
        microchip: 'COL-2021-00892', allergies: null, notes: 'Gato indoor. Muy tranquilo.',
        owner_id: users[0].id,
      },
      // Andrés's pets
      {
        name: 'Simón', species: 'Gato', breed: 'Persa', color: 'Blanco',
        birth_date: '2020-11-05', weight: 5.1, sex: 'MALE',
        microchip: 'COL-2020-01234', allergies: 'Intolerancia a lácteos', notes: 'Necesita limpieza ocular frecuente.',
        owner_id: users[1].id,
      },
      // Valentina's pets
      {
        name: 'Coco', species: 'Perro', breed: 'Cocker Spaniel', color: 'Canela',
        birth_date: '2019-01-10', weight: 12.8, sex: 'MALE',
        microchip: 'COL-2019-00567', allergies: null, notes: 'Propenso a otitis. Revisar oídos frecuentemente.',
        owner_id: users[2].id,
      },
      {
        name: 'Nina', species: 'Gato', breed: 'Mestiza', color: 'Tricolor',
        birth_date: '2023-05-20', weight: 3.8, sex: 'FEMALE',
        microchip: null, allergies: null, notes: 'Rescatada de la calle. Ya tiene todas las vacunas al día.',
        owner_id: users[2].id,
      },
      // Carlos's pets
      {
        name: 'Rocky', species: 'Perro', breed: 'Beagle', color: 'Tricolor',
        birth_date: '2021-09-01', weight: 15.3, sex: 'MALE',
        microchip: 'COL-2021-01678', allergies: 'Dermatitis atópica estacional', notes: 'Come de todo lo que encuentra. Vigilar.',
        owner_id: users[3].id,
      },
      {
        name: 'Kiwi', species: 'Ave', breed: 'Periquito australiano', color: 'Verde y amarillo',
        birth_date: '2023-02-14', weight: 0.04, sex: 'MALE',
        microchip: null, allergies: null, notes: 'Primera visita al veterinario.',
        owner_id: users[3].id,
      },
    ]);

    console.log(`✅ ${patients.length} pacientes (mascotas) creados.`);

    // ──── APPOINTMENTS ──────────────────────────────
    const today = new Date();
    const formatDate = (d) => d.toISOString().split('T')[0];
    const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

    const appointments = await Appointment.bulkCreate([
      // Past completed appointments
      {
        patient_id: patients[0].id, vet_id: users[4].id, client_id: users[0].id,
        reason: 'Vacunación anual', date: formatDate(addDays(today, -30)), time: '10:00',
        status: APPOINTMENT_STATUS.COMPLETED, payment_status: PAYMENT_STATUS.APPROVED,
        payment_amount: 65000, payment_reference: 'PAY-DEMO-001',
        clinical_notes: 'Se aplicó vacuna séxtuple y antirrábica. Paciente en excelente estado.',
        diagnosis: 'Paciente sana, esquema de vacunación completo.',
        treatment: 'Vacuna séxtuple + antirrábica. Próxima dosis en 12 meses.',
        follow_up_date: formatDate(addDays(today, 335)),
      },
      {
        patient_id: patients[2].id, vet_id: users[5].id, client_id: users[1].id,
        reason: 'Revisión dental', date: formatDate(addDays(today, -15)), time: '11:30',
        status: APPOINTMENT_STATUS.COMPLETED, payment_status: PAYMENT_STATUS.APPROVED,
        payment_amount: 120000, payment_reference: 'PAY-DEMO-002',
        clinical_notes: 'Limpieza dental completa bajo sedación. Se extrajo premolar con caries avanzada.',
        diagnosis: 'Enfermedad periodontal grado II. Un premolar con caries grado IV.',
        treatment: 'Profilaxis dental + extracción de premolar. Antibiótico oral por 7 días. Dieta blanda 5 días.',
        follow_up_date: formatDate(addDays(today, -8)),
      },
      // Pending / upcoming appointments
      {
        patient_id: patients[3].id, vet_id: users[4].id, client_id: users[2].id,
        reason: 'Consulta general', date: formatDate(addDays(today, 2)), time: '09:00',
        status: APPOINTMENT_STATUS.PENDING, payment_status: PAYMENT_STATUS.PENDING,
        observations: 'Coco tiene una bolita en el cuello que le creció esta semana.',
      },
      {
        patient_id: patients[5].id, vet_id: users[5].id, client_id: users[3].id,
        reason: 'Problemas de piel o alergias', date: formatDate(addDays(today, 3)), time: '14:00',
        status: APPOINTMENT_STATUS.CONFIRMED, payment_status: PAYMENT_STATUS.APPROVED,
        payment_amount: 85000, payment_reference: 'PAY-DEMO-003',
        observations: 'Rocky se rasca mucho, tiene zonas enrojecidas detrás de las orejas.',
      },
      {
        patient_id: patients[1].id, vet_id: users[4].id, client_id: users[0].id,
        reason: 'Desparasitación', date: formatDate(addDays(today, 5)), time: '16:00',
        status: APPOINTMENT_STATUS.PENDING, payment_status: PAYMENT_STATUS.PENDING,
        observations: 'Max necesita su desparasitación trimestral.',
      },
      {
        patient_id: patients[4].id, vet_id: users[4].id, client_id: users[2].id,
        reason: 'Esterilización / Castración', date: formatDate(addDays(today, 7)), time: '08:00',
        status: APPOINTMENT_STATUS.CONFIRMED, payment_status: PAYMENT_STATUS.APPROVED,
        payment_amount: 180000, payment_reference: 'PAY-DEMO-004',
        observations: 'Nina va para esterilización. Valentina ya fue informada del ayuno previo.',
      },
      // Emergency
      {
        patient_id: patients[0].id, vet_id: users[4].id, client_id: users[0].id,
        reason: 'Emergencia', date: formatDate(addDays(today, -2)), time: null,
        status: APPOINTMENT_STATUS.COMPLETED, payment_status: PAYMENT_STATUS.APPROVED,
        payment_amount: 250000, payment_reference: 'PAY-DEMO-005',
        is_emergency: true,
        clinical_notes: 'Luna ingresó por vómito persistente y deshidratación. Se estabilizó con fluidos IV.',
        diagnosis: 'Gastroenteritis aguda. Probable ingesta de comida en descomposición.',
        treatment: 'Hidratación IV, antieméticos, protectores gástricos. Dieta blanda estricta por 5 días.',
        follow_up_date: formatDate(addDays(today, 5)),
      },
      // No-show
      {
        patient_id: patients[6].id, vet_id: users[5].id, client_id: users[3].id,
        reason: 'Consulta general', date: formatDate(addDays(today, -7)), time: '10:00',
        status: APPOINTMENT_STATUS.NO_SHOW, payment_status: PAYMENT_STATUS.PENDING,
        observations: 'Primera consulta para Kiwi.',
      },
    ]);

    console.log(`✅ ${appointments.length} citas creadas.`);

    // ──── CONTACT MESSAGES ──────────────────────────
    const messages = await ContactMessage.bulkCreate([
      {
        name: 'Pedro Sánchez', email: 'pedro.sanchez@gmail.com', phone: '3112223344',
        pet_type: 'Perro', reason: 'Vacunación', preferred_date: formatDate(addDays(today, 10)),
        preferred_time: '11:00', message: 'Hola, tengo un cachorro de 3 meses y necesita sus primeras vacunas. ¿Qué incluye el paquete?',
        is_read: true,
      },
      {
        name: 'Ana Lucía Mora', email: 'ana.mora@outlook.com', phone: '3205556677',
        pet_type: 'Gato', reason: 'Esterilización / Castración', preferred_date: formatDate(addDays(today, 14)),
        preferred_time: '08:00', message: 'Buenas tardes, tengo una gatica de 8 meses y quiero esterilizarla. ¿Cuánto cuesta y qué cuidados necesita después?',
        is_read: false,
      },
      {
        name: 'Roberto Jiménez', email: 'roberto.j@gmail.com', phone: '3018889900',
        pet_type: 'Conejo', reason: 'Consulta general', preferred_date: null,
        preferred_time: null, message: 'Hola, ¿atienden conejos? Mi conejo dejó de comer desde ayer y estoy muy preocupado.',
        is_read: false,
      },
    ]);

    console.log(`✅ ${messages.length} mensajes de contacto creados.`);

    console.log('\n🎉 Seed completado exitosamente.');
    console.log('\n📋 Credenciales de acceso (todas usan la clave: Password123!):\n');
    console.log('  👤 Cliente:      maria@email.com');
    console.log('  👤 Cliente:      andres@email.com');
    console.log('  👤 Cliente:      valentina@email.com');
    console.log('  👤 Cliente:      carlos@email.com');
    console.log('  🩺 Veterinaria:  dra.laura@veterycindy.com');
    console.log('  🩺 Veterinario:  dr.santiago@veterycindy.com');
    console.log('  💰 Cajera:       juliana@veterycindy.com');
    console.log('  🔑 Admin:        admin@veterycindy.com');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seeder:', error);
    process.exit(1);
  }
};

seed();
