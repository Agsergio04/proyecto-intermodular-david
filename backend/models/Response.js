/**
 * @fileoverview Mongoose schema for Response model. User answers to questions
 * with AI scoring, feedback, and analysis.
 * 
 * @module models/Response
 */
const mongoose = require('mongoose');
/**
 * Schema for Response documents
 * @typedef {Object} ResponseSchema
 * @property {mongoose.Types.ObjectId} questionId - Related Question reference [required]
 * @property {mongoose.Types.ObjectId} interviewId - Owning Interview reference [required]
 * @property {string} [responseText=''] - User text response
 * @property {string} [responseAudio=null] - Audio recording URL
 * @property {number} [duration=0] - Response duration in seconds
 * @property {number} [score=null] - AI-generated score (0-100)
 * @property {string} [feedback=null] - AI feedback text
 * @property {number} [confidence=0] - AI confidence score (0-100)
 * @property {Object} analysis - Detailed analysis results
 * @property {string[]} analysis.strengths - Identified strengths
 * @property {string[]} analysis.areasForImprovement - Improvement areas
 * @property {string[]} analysis.keywords - Extracted keywords
 * @property {Date} [createdAt] - Creation timestamp
 */
const responseSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  responseText: {
    type: String,
    default: ''
  },
  responseAudio: {
    type: String, // URL to audio file
    default: null
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  score: {
    type: Number,
    default: null,
    min: 0,
    max: 100
  },
  feedback: {
    type: String,
    default: null
  },
  confidence: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  analysis: {
    strengths: [String],
    areasForImprovement: [String],
    keywords: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Response', responseSchema);
