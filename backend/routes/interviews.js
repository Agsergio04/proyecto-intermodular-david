/**
 * @fileoverview Rutas de entrevistas técnicas y generación de preguntas por IA.
 * @module routes/interviews
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const checkSubscription = require('../middleware/subscription');
const interviewController = require('../controllers/interviewController');
const gitinestController = require('../controllers/GitinestController');

/**
 * @typedef {Object} GenerateQuestionsRequestBody
 * @property {string} [repoUrl] URL principal del repositorio.
 * @property {string} [repositoryUrl] Alias alternativo para la URL del repo.
 * @property {string} [repo_url] Alias alternativo (snake_case) para la URL del repo.
 * @property {number} [count] Número de preguntas a generar.
 * @property {number} [questionCount] Alias alternativo para el número de preguntas.
 * @property {string} [difficulty] Dificultad de las preguntas (por defecto "mid").
 * @property {string} [language] Idioma de las preguntas (por defecto "en").
 */

/**
 * @typedef {Object} GenerateQuestionsResult
 * @property {Array<{question:string, difficulty:string}>} questions Preguntas generadas.
 * @property {Object} [repo] Información del repositorio analizado.
 * @property {string} [repoContext] Resumen/contexto del repositorio.
 */

/**
 * @typedef {Object} GenerateQuestionsResponseBody
 * @property {string} message Mensaje de éxito.
 * @property {Array<{question:string, difficulty:string}>} questions Lista de preguntas generadas.
 * @property {Object} [repo] Información del repositorio.
 * @property {string} [repoContext] Contexto generado del repositorio.
 */

/**
 * Genera preguntas de entrevista a partir de un repositorio usando IA.
 *
 * - Requiere autenticación.
 * - Acepta varias claves alternativas para la URL del repositorio.
 * - Valida que `repoUrl` sea un string no vacío.
 *
 * @name POST /generate-questions
 * @function
 * @memberof module:routes/interviews
 * @param {express.Request<any, any, GenerateQuestionsRequestBody>} req Objeto de petición HTTP.
 * @param {express.Response<GenerateQuestionsResponseBody|{error:string}>} res Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
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
    console.log('✅ Llamando a gitinestController.generateTextAndQuestions con:', {
      repoUrl,
      questionCount,
      difficulty,
      language
    });

    const result = await gitinestController.generateTextAndQuestions(
      repoUrl,
      questionCount,
      difficulty,
      language
    );

    const questions = result.questions;

    console.log('✅ Preguntas generadas:', questions.length);
    console.log('📝 Primera pregunta:', questions[0]);

    res.status(200).json({
      message: 'Preguntas generadas con IA desde repositorio',
      questions,
      repo: result.repo,
      repoContext: result.repoContext
    });
  } catch (err) {
    console.error('❌ Error en generate-questions:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Crea una nueva entrevista.
 *
 * @name POST /
 * @function
 * @memberof module:routes/interviews
 * @param {express.Request} req Petición HTTP.
 * @param {express.Response} res Respuesta HTTP.
 */
router.post('/', authMiddleware, interviewController.createInterview);

/**
 * Obtiene todas las entrevistas del usuario autenticado.
 *
 * @name GET /
 * @function
 * @memberof module:routes/interviews
 * @param {express.Request} req Petición HTTP.
 * @param {express.Response} res Respuesta HTTP.
 */
router.get('/', authMiddleware, interviewController.getInterviews);

/**
 * Obtiene una entrevista concreta por ID.
 *
 * @name GET /:interviewId
 * @function
 * @memberof module:routes/interviews
 * @param {express.Request} req Petición HTTP con `interviewId` en params.
 * @param {express.Response} res Respuesta HTTP.
 */
router.get('/:interviewId', authMiddleware, interviewController.getInterview);

/**
 * Actualiza el estado de una entrevista.
 *
 * @name PUT /:interviewId/status
 * @function
 * @memberof module:routes/interviews
 * @param {express.Request} req Petición HTTP con `interviewId` en params.
 * @param {express.Response} res Respuesta HTTP.
 */
router.put('/:interviewId/status', authMiddleware, interviewController.updateInterviewStatus);

/**
 * Actualiza la URL del repositorio asociada a una entrevista.
 *
 * @name PUT /:interviewId/repository
 * @function
 * @memberof module:routes/interviews
 * @param {express.Request} req Petición HTTP con `interviewId` en params.
 * @param {express.Response} res Respuesta HTTP.
 */
router.put('/:interviewId/repository', authMiddleware, interviewController.updateInterviewRepository);

/**
 * Elimina una entrevista por ID.
 *
 * @name DELETE /:interviewId
 * @function
 * @memberof module:routes/interviews
 * @param {express.Request} req Petición HTTP con `interviewId` en params.
 * @param {express.Response} res Respuesta HTTP.
 */
router.delete('/:interviewId', authMiddleware, interviewController.deleteInterview);

module.exports = router;
