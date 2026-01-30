/**
 * @fileoverview Script de prueba para demostrar el funcionamiento del campo repositoryUrl
 * @description Este script simula las operaciones CRUD del repositoryUrl en el modelo Interview
 * @version 1.0.0
 * @example node testRepositoryUrl.js
 */

const mongoose = require('mongoose');
const Interview = require('../models/Interview');
const User = require('../models/User');

/**
 * Carga variables de entorno desde .env
 * @private
 */
require('dotenv').config();

/**
 * Función principal de prueba para el campo repositoryUrl
 * Ejecuta operaciones CRUD completas (Create, Read, Update, Delete) y queries avanzadas
 * @returns {Promise<void>}
 * @throws {Error} Si falla la conexión a MongoDB o cualquier operación
 * @access Private (CLI utility)
 * @example
 * testRepositoryUrl()
 *   .then(() => console.log('Tests completed'))
 *   .catch(err => console.error('Tests failed', err));
 */
const testRepositoryUrl = async () => {
  /** @type {import('mongoose').Connection} */
  let dbConnection;

  try {
    // Conectar a la base de datos
    /**
     * URI de conexión MongoDB con fallback Docker
     * @type {string}
     */
    const mongoUri = process.env.MONGODB_URI || 'mongodb://mongo:27017/ai-interview';
    dbConnection = await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    /**
     * Usuario de prueba requerido para las operaciones
     * @type {import('../models/User').UserDocument|null}
     */
    const user = await User.findOne({ email: 'user1@example.com' });
    if (!user) {
      console.log('❌ Usuario de prueba no encontrado. Ejecuta seedData.js primero.');
      process.exit(1);
    }

    console.log('📝 Simulando operaciones con repositoryUrl...\n');

    // 1. CREAR entrevista con repositoryUrl
    /**
     * Nueva entrevista de prueba con repositoryUrl
     * @type {import('../models/Interview').InterviewDocument}
     */
    console.log('1️⃣  CREAR entrevista con repositoryUrl:');
    const newInterview = new Interview({
      userId: user._id,
      title: 'Test Interview con Repository',
      profession: 'Full Stack Developer',
      type: 'custom',
      difficulty: 'mid',
      language: 'es',
      repositoryUrl: 'https://github.com/test-user/my-awesome-project'
    });
    await newInterview.save();
    console.log(`   ✅ Entrevista creada con ID: ${newInterview._id}`);
    console.log(`   📂 Repository URL: ${newInterview.repositoryUrl}\n`);

    // 2. LEER la entrevista y mostrar el repositoryUrl
    /**
     * Recupera la entrevista recién creada
     * @type {import('../models/Interview').InterviewDocument|null}
     */
    console.log('2️⃣  LEER entrevista y obtener repositoryUrl:');
    const retrievedInterview = await Interview.findById(newInterview._id);
    console.log(`   ✅ Entrevista encontrada: ${retrievedInterview.title}`);
    console.log(`   📂 Repository URL: ${retrievedInterview.repositoryUrl || 'No definido'}\n`);

    // 3. ACTUALIZAR el repositoryUrl
    console.log('3️⃣  ACTUALIZAR repositoryUrl:');
    retrievedInterview.repositoryUrl = 'https://github.com/test-user/updated-project';
    retrievedInterview.updatedAt = Date.now();
    await retrievedInterview.save();
    console.log(`   ✅ Repository URL actualizado a: ${retrievedInterview.repositoryUrl}\n`);

    // 4. ELIMINAR el repositoryUrl (establecer a null)
    console.log('4️⃣  ELIMINAR repositoryUrl (establecer a null):');
    retrievedInterview.repositoryUrl = null;
    await retrievedInterview.save();
    console.log(`   ✅ Repository URL eliminado: ${retrievedInterview.repositoryUrl}\n`);

    // 5. RESTAURAR el repositoryUrl
    console.log('5️⃣  RESTAURAR repositoryUrl:');
    retrievedInterview.repositoryUrl = 'https://github.com/test-user/final-project';
    await retrievedInterview.save();
    console.log(`   ✅ Repository URL restaurado: ${retrievedInterview.repositoryUrl}\n`);

    // 6. LISTAR todas las entrevistas con sus repositoryUrl
    /**
     * Lista paginada de entrevistas del usuario
     * @type {import('../models/Interview').InterviewDocument[]}
     */
    console.log('6️⃣  LISTAR todas las entrevistas del usuario con repositoryUrl:');
    const userInterviews = await Interview.find({ userId: user._id })
      .select('title profession repositoryUrl status')
      .limit(10);

    console.log(`   Encontradas ${userInterviews.length} entrevistas:\n`);
    userInterviews.forEach((interview, index) => {
      console.log(`   ${index + 1}. ${interview.title}`);
      console.log(`      Profesión: ${interview.profession}`);
      console.log(`      Status: ${interview.status}`);
      console.log(`      📂 Repository: ${interview.repositoryUrl || 'Sin repositorio'}`);
      console.log('');
    });

    // 7. BUSCAR entrevistas que TIENEN repositoryUrl
    /**
     * Query MongoDB: repositoryUrl no es null
     * @type {import('../models/Interview').InterviewDocument[]}
     */
    console.log('7️⃣  BUSCAR entrevistas que TIENEN repositoryUrl:');
    const interviewsWithRepo = await Interview.find({
      userId: user._id,
      repositoryUrl: { $ne: null }
    }).select('title repositoryUrl');

    console.log(`   Encontradas ${interviewsWithRepo.length} entrevistas con repositorio:\n`);
    interviewsWithRepo.forEach((interview, index) => {
      console.log(`   ${index + 1}. ${interview.title}: ${interview.repositoryUrl}`);
    });
    console.log('');

    // 8. BUSCAR entrevistas SIN repositoryUrl
    /**
     * Query MongoDB: repositoryUrl es null o no existe
     * @type {import('../models/Interview').InterviewDocument[]}
     */
    console.log('8️⃣  BUSCAR entrevistas SIN repositoryUrl:');
    const interviewsWithoutRepo = await Interview.find({
      userId: user._id,
      $or: [
        { repositoryUrl: null },
        { repositoryUrl: { $exists: false } }
      ]
    }).select('title profession');

    console.log(`   Encontradas ${interviewsWithoutRepo.length} entrevistas sin repositorio:\n`);
    interviewsWithoutRepo.forEach((interview, index) => {
      console.log(`   ${index + 1}. ${interview.title} (${interview.profession})`);
    });
    console.log('');

    // LIMPIAR: Eliminar la entrevista de prueba
    await Interview.findByIdAndDelete(newInterview._id);
    console.log('🧹 Entrevista de prueba eliminada\n');

    console.log('✅ Todas las operaciones completadas exitosamente!');
    console.log('\n📌 Resumen:');
    console.log('   - El backend puede CREAR entrevistas con repositoryUrl');
    console.log('   - El backend puede LEER el repositoryUrl de las entrevistas');
    console.log('   - El backend puede ACTUALIZAR el repositoryUrl');
    console.log('   - El backend puede ELIMINAR/RESTAURAR el repositoryUrl');
    console.log('   - El backend puede FILTRAR entrevistas por repositoryUrl');

    process.exit(0);

  } catch (error) {
    /**
     * Manejo centralizado de errores
     * @type {Error}
     */
    console.error('❌ Error en las pruebas:', error.message);
    process.exit(1);
  } finally {
    // Cerrar conexión a MongoDB
    if (dbConnection) {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed');
    }
  }
};

/**
 * Ejecuta el script de pruebas
 * @type {() => Promise<void>}
 */
testRepositoryUrl();
