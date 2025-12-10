/**
 * @fileoverview Mongoose schema for Question model. Individual questions within
 * an Interview with audio support and response references.
 * 
 * @module models/Question
 */
const mongoose = require('mongoose');
/**
 * Schema for Question documents
 * @typedef {Object} QuestionSchema
 * @property {mongoose.Types.ObjectId} interviewId - Owning Interview reference [required]
 * @property {string} questionText - Question text content [required]
 * @property {string} [questionAudio=null] - Audio file URL
 * @property {number} order - Display sequence number [required]
 * @property {('easy'|'medium'|'hard'|'manual')} [difficulty='manual'] - Difficulty level
 * @property {mongoose.Types.ObjectId[]} responses - Array of Response references
 * @property {number} [timeLimit=300] - Response time limit in seconds (5 min default)
 * @property {Date} [createdAt] - Creation timestamp
 */
const questionSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  questionAudio: {
    type: String, // URL to audio file
    default: null
  },
  order: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'manual'],
    default: 'manual'
  },
  responses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Response'
  }],
  timeLimit: {
    type: Number, // in seconds
    default: 300 // 5 minutes
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', questionSchema);
