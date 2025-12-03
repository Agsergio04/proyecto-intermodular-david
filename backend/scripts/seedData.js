const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Interview = require('../models/Interview');
const Question = require('../models/Question');
const mongoose = require('mongoose');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/ai-interview');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Subscription.deleteMany({});
    await Interview.deleteMany({});
    await Question.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
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

    const createdUsers = await User.insertMany(testUsers);
    console.log(`Created ${createdUsers.length} test users`);

    // Create subscriptions for test users
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

    const createdSubscriptions = await Subscription.insertMany(subscriptions);
    console.log(`Created ${createdSubscriptions.length} subscriptions`);

    // Update users with subscription references
    for (let i = 0; i < createdUsers.length; i++) {
      createdUsers[i].subscription = createdSubscriptions[i]._id;
      createdUsers[i].subscriptionStatus = 'premium';
      await createdUsers[i].save();
    }

    // Create sample interviews with repository URLs
    const sampleInterviews = [
      {
        userId: createdUsers[0]._id,
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
        userId: createdUsers[0]._id,
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
        userId: createdUsers[1]._id,
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
        userId: createdUsers[1]._id,
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

    const createdInterviews = await Interview.insertMany(sampleInterviews);
    console.log(`Created ${createdInterviews.length} sample interviews`);

    // Create sample questions for the first interview
    const sampleQuestions = [
      {
        interviewId: createdInterviews[0]._id,
        questionText: 'What is the difference between let, const, and var in JavaScript?',
        difficulty: 'easy',
        order: 1
      },
      {
        interviewId: createdInterviews[0]._id,
        questionText: 'Explain the concept of React Hooks and provide examples.',
        difficulty: 'medium',
        order: 2
      },
      {
        interviewId: createdInterviews[0]._id,
        questionText: 'How would you optimize the performance of a React application?',
        difficulty: 'hard',
        order: 3
      }
    ];

    const createdQuestions = await Question.insertMany(sampleQuestions);
    console.log(`Created ${createdQuestions.length} sample questions`);

    // Update interview with questions
    createdInterviews[0].questions = createdQuestions.map(q => q._id);
    createdInterviews[0].statistics = {
      totalQuestions: createdQuestions.length,
      answeredQuestions: 0,
      skippedQuestions: 0,
      averageResponseTime: 0,
      confidence: 0
    };
    await createdInterviews[0].save();

    // Update users with interview references
    createdUsers[0].interviews = [createdInterviews[0]._id, createdInterviews[1]._id];
    createdUsers[1].interviews = [createdInterviews[2]._id, createdInterviews[3]._id];
    await createdUsers[0].save();
    await createdUsers[1].save();

    console.log('✅ Database seeding completed successfully');
    console.log('\nTest Credentials:');
    console.log('Email: user1@example.com | Password: Password123');
    console.log('Email: user2@example.com | Password: Password123');
    console.log('\nSample Interviews Created:');
    console.log(`- ${createdInterviews.length} interviews with repository URLs`);
    console.log(`- ${createdQuestions.length} sample questions`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
