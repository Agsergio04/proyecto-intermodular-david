/**
 * @fileoverview Script de seeding completo para base de datos AI Interview Platform
 * @description Crea usuarios de prueba, suscripciones premium, entrevistas con repositoryUrl y preguntas
 * @version 1.0.0
 * @example node seedDatabase.js
 */

const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Interview = require('../models/Interview');
const Question = require('../models/Question');
const mongoose = require('mongoose');

/**
 * Carga variables de entorno para conexión MongoDB
 * @private
 */
require('dotenv').config();

/**
 * Datos de usuarios de prueba multilingüe
 * @type {Array<{
 *   email: string;
 *   password: string;
 *   firstName: string;
 *   lastName: string;
 *   language: 'en' | 'es';
 * }>}
 */
const testUsers = [
  {
    email: 'user1@example.com',
    password: 'Password123',
    firstName: 'John',
    lastName: 'Doe',
    language: 'en'
  },
  {
    email: 'user2@example.com',
    password: 'Password123',
    firstName: 'Jane',
    lastName: 'Smith',
    language: 'es'
  }
];

/**
 * Datos de entrevistas de muestra con repository URLs
 * @type {Array<{
 *   userId: import('mongoose').Types.ObjectId;
 *   title: string;
 *   profession: string;
 *   type: 'ai_generated' | 'custom';
 *   difficulty: 'easy' | 'mid' | 'senior';
 *   language: 'en' | 'es';
 *   repoUrl?: string;
 *   repositoryUrl: string;
 *   status: string;
 *   completedAt?: Date;
 * }>}
 */
const sampleInterviewsTemplate = [
  {
    title: 'Frontend Developer Interview',
    profession: 'Frontend Developer',
    type: 'ai_generated',
    difficulty: 'mid',
    language: 'en',
    repoUrl: 'https://github.com/example/frontend-project',
    repositoryUrl: 'https://github.com/example/frontend-project',
    status: 'in_progress'
  },
  {
    title: 'React Developer Position',
    profession: 'React Developer',
    type: 'custom',
    difficulty: 'senior',
    language: 'en',
    repoUrl: 'https://github.com/example/react-portfolio',
    repositoryUrl: 'https://github.com/example/react-portfolio',
    status: 'completed',
    completedAt: new Date()
  },
  {
    title: 'Entrevista Backend Node.js',
    profession: 'Backend Developer',
    type: 'ai_generated',
    difficulty: 'mid',
    language: 'es',
    repoUrl: 'https://github.com/ejemplo/api-nodejs',
    repositoryUrl: 'https://github.com/ejemplo/api-nodejs',
    status: 'in_progress'
  },
  {
    title: 'Desarrollador Full Stack',
    profession: 'Full Stack Developer',
    type: 'custom',
    difficulty: 'senior',
    language: 'es',
    repoUrl: 'https://github.com/ejemplo/fullstack-app',
    repositoryUrl: 'https://github.com/ejemplo/fullstack-app',
    status: 'in_progress'
  }
];

/**
 * Preguntas de muestra para entrevistas frontend
 * @type {Array<{
 *   interviewId: import('mongoose').Types.ObjectId;
 *   questionText: string;
 *   difficulty: 'easy' | 'medium' | 'hard';
 *   order: number;
 * }>}
 */
const sampleQuestions = [
  {
    questionText: 'What is the difference between let, const, and var in JavaScript?',
    difficulty: 'easy',
    order: 1
  },
  {
    questionText: 'Explain the concept of React Hooks and provide examples.',
    difficulty: 'medium',
    order: 2
  },
  {
    questionText: 'How would you optimize the performance of a React application?',
    difficulty: 'hard',
    order: 3
  }
];

/**
 * Función principal de seeding de base de datos
 * Crea datos completos: usuarios → suscripciones → entrevistas → preguntas
 * @returns {Promise<void>}
 * @throws {Error} Si falla conexión MongoDB o cualquier inserción
 * @access Private (CLI utility)
 * @example
 * await seedDatabase();
 */
const seedDatabase = async () => {
  /** @type {import('mongoose').Connection} */
  let dbConnection;

  try {
    // Conectar a MongoDB
    /**
     * URI de conexión con fallback Docker
     * @type {string}
     */
    const mongoUri = process.env.MONGODB_URI || 'mongodb://mongo:27017/ai-interview';
    dbConnection = await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Limpiar datos existentes
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Subscription.deleteMany({});
    await Interview.deleteMany({});
    await Question.deleteMany({});
    console.log('✅ Cleared existing data');

    // 1. Crear usuarios de prueba
    /**
     * Usuarios creados con IDs
     * @type {import('../models/User').UserDocument[]}
     */
    const createdUsers = await User.insertMany(testUsers);
    console.log(`✅ Created ${createdUsers.length} test users`);

    // 2. Crear suscripciones premium
    /**
     * Suscripciones para cada usuario
     * @type {Array<{
     *   userId: import('mongoose').Types.ObjectId;
     *   plan: string;
     *   status: string;
     *   features: {
     *     customInterviews: boolean;
     *     voiceInterview: boolean;
     *     aiGeneratedQuestions: boolean;
     *     downloadReports: boolean;
     *     viewStatistics: boolean;
     *   };
     * }>}
     */
    const subscriptions = createdUsers.map(user => ({
      userId: user._id,
      plan: 'premium',
      status: 'active',
      features: {
        customInterviews: true,
        voiceInterview: true,
        aiGeneratedQuestions: true,
        downloadReports: false,
        viewStatistics: false
      }
    }));

    /**
     * Suscripciones creadas
     * @type {import('../models/Subscription').SubscriptionDocument[]}
     */
    const createdSubscriptions = await Subscription.insertMany(subscriptions);
    console.log(`✅ Created ${createdSubscriptions.length} subscriptions`);

    // 3. Vincular suscripciones a usuarios
    for (let i = 0; i < createdUsers.length; i++) {
      createdUsers[i].subscription = createdSubscriptions[i]._id;
      createdUsers[i].subscriptionStatus = 'premium';
      await createdUsers[i].save();
    }

    // 4. Crear entrevistas de muestra con repository URLs
    /**
     * Entrevistas finalizadas con userId asignado
     * @type {import('../models/Interview').InterviewDocument[]}
     */
    const sampleInterviews = sampleInterviewsTemplate.map((interview, index) => ({
      ...interview,
      userId: createdUsers[Math.floor(index / 2)]._id // 2 entrevistas por usuario
    }));

    const createdInterviews = await Interview.insertMany(sampleInterviews);
    console.log(`✅ Created ${createdInterviews.length} sample interviews`);

    // 5. Crear preguntas para primera entrevista
    const questionsWithInterviewId = sampleQuestions.map((q, index) => ({
      ...q,
      interviewId: createdInterviews[0]._id
    }));

    /**
     * Preguntas creadas
     * @type {import('../models/Question').QuestionDocument[]}
     */
    const createdQuestions = await Question.insertMany(questionsWithInterviewId);
    console.log(`✅ Created ${createdQuestions.length} sample questions`);

    // 6. Actualizar primera entrevista con preguntas y estadísticas
    createdInterviews[0].questions = createdQuestions.map(q => q._id);
    createdInterviews[0].statistics = {
      totalQuestions: createdQuestions.length,
      answeredQuestions: 0,
      skippedQuestions: 0,
      averageResponseTime: 0,
      confidence: 0
    };
    await createdInterviews[0].save();

    // 7. Vincular entrevistas a usuarios
    createdUsers[0].interviews = [createdInterviews[0]._id, createdInterviews[1]._id];
    createdUsers[1].interviews = [createdInterviews[2]._id, createdInterviews[3]._id];
    await createdUsers[0].save();
    await createdUsers[1].save();

    // Resumen final
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📧 Test Credentials:');
    console.log('👤 Email: user1@example.com | Password: Password123 (EN)');
    console.log('👤 Email: user2@example.com | Password: Password123 (ES)');
    console.log('\n📊 Sample Data Created:');
    console.log(`  • ${createdUsers.length} usuarios premium`);
    console.log(`  • ${createdInterviews.length} entrevistas (con repositoryUrl)`);
    console.log(`  • ${createdQuestions.length} preguntas de muestra`);

    process.exit(0);

  } catch (error) {
    /**
     * Error durante el seeding
     * @type {Error}
     */
    console.error('❌ Database seeding failed:', error.message);
    process.exit(1);
  } finally {
    // Cleanup conexión
    if (dbConnection) {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed');
    }
  }
};

/**
 * Ejecuta el seeding de base de datos
 * @type {() => Promise<void>}
 */
seedDatabase();
