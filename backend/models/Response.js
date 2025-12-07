const mongoose = require('mongoose');

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
