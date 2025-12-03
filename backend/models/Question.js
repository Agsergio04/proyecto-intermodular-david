const mongoose = require('mongoose');

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
