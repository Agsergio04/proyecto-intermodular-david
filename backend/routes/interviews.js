const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const checkSubscription = require('../middleware/subscription');
const interviewController = require('../controllers/interviewController');
const gitinestController = require('../controllers/GitinestController');

// Generate AI questions
router.post('/generate-questions', authMiddleware, async (req, res) => {
  const { repoUrl, questionCount = 5 } = req.body;
  if (!repoUrl) {
    return res.status(400).json({ error: 'repoUrl is required' });
  }
  try {
    // Usar la función de Gitinest para obtener preguntas
    const result = await gitinestController.generateTextAndQuestions(repoUrl, questionCount);
    // Formatear las preguntas para el frontend
    const questions = result.questions.map(q => ({ question: q, difficulty: 'medium' }));
    res.status(200).json({ message: 'Preguntas generadas por Gitinest', questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
