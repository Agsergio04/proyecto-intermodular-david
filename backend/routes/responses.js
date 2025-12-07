const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const checkSubscription = require('../middleware/subscription');
const responseController = require('../controllers/responseController');

// Submit response
router.post('/', authMiddleware, responseController.submitResponse);

// Get responses for an interview
router.get('/interview/:interviewId', authMiddleware, responseController.getResponses);

// Generate feedback for all responses in an interview
router.post('/interview/:interviewId/generate-feedback', authMiddleware, responseController.generateInterviewFeedback);

// Get specific response
router.get('/:responseId', authMiddleware, responseController.getResponse);

// Update response
router.put('/:responseId', authMiddleware, responseController.updateResponse);

module.exports = router;
