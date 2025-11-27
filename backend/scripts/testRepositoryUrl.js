e/**
 * Script de prueba para demostrar el funcionamiento del campo repositoryUrl
 * Este script simula las operaciones CRUD del repositoryUrl
 */

const mongoose = require('mongoose');
const Interview = require('../models/Interview');
const User = require('../models/User');
require('dotenv').config();

const testRepositoryUrl = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/ai-interview');
    console.log('✅ Connected to MongoDB\n');

    // Buscar un usuario de prueba
    const user = await User.findOne({ email: 'user1@example.com' });
    if (!user) {
      console.log('❌ Usuario de prueba no encontrado. Ejecuta seedData.js primero.');
      process.exit(1);
    }

    console.log('📝 Simulando operaciones con repositoryUrl...\n');

    // 1. Crear una entrevista con repositoryUrl
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

    // 2. Leer la entrevista y mostrar el repositoryUrl
    console.log('2️⃣  LEER entrevista y obtener repositoryUrl:');
    const retrievedInterview = await Interview.findById(newInterview._id);
    console.log(`   ✅ Entrevista encontrada: ${retrievedInterview.title}`);
    console.log(`   📂 Repository URL: ${retrievedInterview.repositoryUrl || 'No definido'}\n`);

    // 3. Actualizar el repositoryUrl
    console.log('3️⃣  ACTUALIZAR repositoryUrl:');
    retrievedInterview.repositoryUrl = 'https://github.com/test-user/updated-project';
    retrievedInterview.updatedAt = Date.now();
    await retrievedInterview.save();
    console.log(`   ✅ Repository URL actualizado a: ${retrievedInterview.repositoryUrl}\n`);

    // 4. Eliminar el repositoryUrl (establecer a null)
    console.log('4️⃣  ELIMINAR repositoryUrl (establecer a null):');
    retrievedInterview.repositoryUrl = null;
    await retrievedInterview.save();
    console.log(`   ✅ Repository URL eliminado: ${retrievedInterview.repositoryUrl}\n`);

    // 5. Restaurar el repositoryUrl
    console.log('5️⃣  RESTAURAR repositoryUrl:');
    retrievedInterview.repositoryUrl = 'https://github.com/test-user/final-project';
    await retrievedInterview.save();
    console.log(`   ✅ Repository URL restaurado: ${retrievedInterview.repositoryUrl}\n`);

    // 6. Listar todas las entrevistas con sus repositoryUrl
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

    // 7. Buscar entrevistas que tienen repositoryUrl
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

    // 8. Buscar entrevistas SIN repositoryUrl
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

    // Limpiar: Eliminar la entrevista de prueba
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
    console.error('❌ Error en las pruebas:', error.message);
    process.exit(1);
  }
};

// Ejecutar el test
testRepositoryUrl();

