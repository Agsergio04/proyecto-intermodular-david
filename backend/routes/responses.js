/**
 * @fileoverview Rutas para gestionar respuestas de entrevistas y feedback generado por IA.
 * @module routes/responses
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const checkSubscription = require('../middleware/subscription');
const responseController = require('../controllers/responseController');

/**
 * Envía una nueva respuesta para una pregunta de entrevista.
 *
 * @name POST /
 * @function
 * @memberof module:routes/responses
 * @param {express.Request} req Petición HTTP con los datos de la respuesta.
 * @param {express.Response} res Respuesta HTTP.
 */
router.post('/', authMiddleware, responseController.submitResponse);

/**
 * Obtiene todas las respuestas de una entrevista.
 *
 * @name GET /interview/:interviewId
 * @function
 * @memberof module:routes/responses
 * @param {express.Request} req Petición HTTP con `interviewId` en params.
 * @param {express.Response} res Respuesta HTTP.
 */
router.get('/interview/:interviewId', authMiddleware, responseController.getResponses);

/**
 * Genera feedback global para todas las respuestas de una entrevista.
 *
 * @name POST /interview/:interviewId/generate-feedback
 * @function
 * @memberof module:routes/responses
 * @param {express.Request} req Petición HTTP con `interviewId` en params.
 * @param {express.Response} res Respuesta HTTP.
 */
router.post(
  '/interview/:interviewId/generate-feedback',
  authMiddleware,
  responseController.generateInterviewFeedback
);

/**
 * Obtiene una respuesta concreta por ID.
 *
 * @name GET /:responseId
 * @function
 * @memberof module:routes/responses
 * @param {express.Request} req Petición HTTP con `responseId` en params.
 * @param {express.Response} res Respuesta HTTP.
 */
router.get('/:responseId', authMiddleware, responseController.getResponse);

/**
 * Actualiza una respuesta existente.
 *
 * @name PUT /:responseId
 * @function
 * @memberof module:routes/responses
 * @param {express.Request} req Petición HTTP con `responseId` en params.
 * @param {express.Response} res Respuesta HTTP.
 */
router.put('/:responseId', authMiddleware, responseController.updateResponse);

module.exports = router;
