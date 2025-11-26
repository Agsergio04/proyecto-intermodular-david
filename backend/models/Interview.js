const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  profession: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['ai_generated', 'custom'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['junior', 'mid', 'senior'],
    default: 'mid'
  },
  language: {
    type: String,
    enum: ['en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'zh'],
    default: 'en'
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'paused'],
    default: 'in_progress'
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  feedback: {
    type: String,
    default: ''
  },
  recordingUrl: {
    type: String,
    default: null
  },
  repositoryUrl: {
    type: String,
    default: null
  },
  statistics: {
    totalQuestions: Number,
    answeredQuestions: Number,
    skippedQuestions: Number,
    averageResponseTime: Number,
    confidence: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Interview', interviewSchema);
