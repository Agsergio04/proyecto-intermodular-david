const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const checkSubscription = require('../middleware/subscription');
const interviewController = require('../controllers/interviewController');
const gitinestController = require('../controllers/GitinestController');

// Generate AI questions
router.post('/generate-questions', authMiddleware, async (req, res) => {
  console.log('📥 ============ generate-questions INICIO ============');
  console.log('📥 Headers:', JSON.stringify(req.headers));
  console.log('📥 Content-Type:', req.get('Content-Type'));
  console.log('📥 req.body recibido:', JSON.stringify(req.body));
  console.log('📥 req.body keys:', Object.keys(req.body));
  console.log('📥 req.body.repoUrl:', req.body.repoUrl);
  console.log('📥 typeof req.body.repoUrl:', typeof req.body.repoUrl);

  // Extraer parámetros de diferentes posibles ubicaciones
  let repoUrl = req.body.repoUrl || req.body.repositoryUrl || req.body.repo_url;
  const questionCount = req.body.count || req.body.questionCount || 5;
  const difficulty = req.body.difficulty || 'mid';
  const language = req.body.language || 'en';

  console.log('📥 repoUrl extraído:', repoUrl);
  console.log('📥 questionCount:', questionCount);
  console.log('📥 difficulty:', difficulty);
  console.log('📥 language:', language);
  console.log('📥 ============ generate-questions VALIDACIÓN ============');

  // Validar y limpiar repoUrl
  if (!repoUrl || typeof repoUrl !== 'string' || repoUrl.trim() === '') {
    console.log('❌ Error: repoUrl no proporcionado, no es string o está vacío');
    console.log('❌ req.body completo:', req.body);
    return res.status(400).json({
      error: 'repoUrl is required and must be a non-empty string',
      receivedBody: req.body,
      keys: Object.keys(req.body),
      repoUrlReceived: repoUrl,
      typeOfRepoUrl: typeof repoUrl
    });
  }

  repoUrl = repoUrl.trim();

  try {
    console.log('✅ Llamando a gitinestController.generateTextAndQuestions con:', { repoUrl, questionCount, difficulty, language });
    // Usar la función de Gitinest para obtener preguntas usando IA
    const result = await gitinestController.generateTextAndQuestions(repoUrl, questionCount, difficulty, language);

    // Las preguntas ya vienen con el formato correcto {question: string, difficulty: string}
    const questions = result.questions;

    console.log('✅ Preguntas generadas:', questions.length);
    console.log('📝 Primera pregunta:', questions[0]);

    res.status(200).json({
      message: 'Preguntas generadas con IA desde repositorio',
      questions,
      repo: result.repo
    });
  } catch (err) {
    console.error('❌ Error en generate-questions:', err.message);
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
