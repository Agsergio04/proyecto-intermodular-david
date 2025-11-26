const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const checkSubscription = require('../middleware/subscription');
const interviewController = require('../controllers/interviewController');

// Generate AI questions
router.post('/generate-questions', authMiddleware, interviewController.generateAIQuestions);

// Create interview
router.post('/', authMiddleware, interviewController.createInterview);

// Get all interviews
router.get('/', authMiddleware, interviewController.getInterviews);

// Get single interview
router.get('/:interviewId', authMiddleware, interviewController.getInterview);

// Update interview status
router.put('/:interviewId/status', authMiddleware, interviewController.updateInterviewStatus);

// Update interview repository URL
router.put('/:interviewId/repository', authMiddleware, interviewController.updateInterviewRepository);

// Delete interview
router.delete('/:interviewId', authMiddleware, interviewController.deleteInterview);

module.exports = router;
