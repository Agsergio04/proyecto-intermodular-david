/**
 * @fileoverview Mongoose schema for Interview model. Represents a technical interview session
 * with associated questions, responses, repository context, and scoring.
 * 
 * @module models/Interview
 */

const mongoose = require('mongoose');

/**
 * Schema for Interview documents
 * @typedef {Object} InterviewSchema
 * @property {mongoose.Types.ObjectId} userId - Reference to the owning User [required]
 * @property {string} title - Interview title [required]
 * @property {string} [profession] - Target profession (optional)
 * @property {string} repoUrl - Repository URL for context analysis [required]
 * @property {('ai_generated'|'custom')} type - Interview generation type [required]
 * @property {('junior'|'mid'|'senior'|'manual')} [difficulty='manual'] - Difficulty level
 * @property {('en'|'es'|'fr'|'de'|'pt'|'it'|'ja'|'zh')} [language='en'] - Language code
 * @property {('in_progress'|'completed'|'paused')} [status='in_progress'] - Current status
 * @property {number} [duration=0] - Total duration in seconds
 * @property {mongoose.Types.ObjectId[]} questions - Array of Question references
 * @property {number} [currentQuestionIndex=0] - Current question position
 * @property {number} [totalScore=0] - Final score (0-100)
 * @property {string} [feedback=''] - Overall feedback text
 * @property {string} [recordingUrl=null] - Audio recording URL
 * @property {string} [repositoryUrl=null] - Processed repository URL
 * @property {Object} [repoContext=null] - Repository analysis context
 * @property {Object} statistics - Interview statistics
 * @property {number} statistics.totalQuestions - Total questions count
 * @property {number} statistics.answeredQuestions - Answered questions count
 * @property {number} statistics.skippedQuestions - Skipped questions count
 * @property {number} statistics.averageResponseTime - Avg response time in seconds
 * @property {number} statistics.confidence - Overall confidence score
 * @property {Date} [createdAt] - Creation timestamp
 * @property {Date} [updatedAt] - Last update timestamp
 * @property {Date} [completedAt=null] - Completion timestamp
 */
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
    required: false
  },
  repoUrl: {
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
    enum: ['junior', 'mid', 'senior', 'manual'],
    default: 'manual'
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
  repoContext: {
    type: mongoose.Schema.Types.Mixed,
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