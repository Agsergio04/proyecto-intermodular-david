/**
 * @fileoverview Rutas de estadísticas del usuario (`/api/stats`).
 * @module routes/stats
 * @description Endpoints para obtener métricas de rendimiento y tendencias.
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const statsController = require('../controllers/statsController');

/**
 * Obtiene estadísticas generales del usuario.
 *
 * @name GET /
 * @function
 * @memberof module:routes/stats
 * @param {express.Request} req
 * @param {express.Response} res
 * @access Private (JWT requerido)
 */
router.get('/', authMiddleware, statsController.getUserStats);

/**
 * Obtiene estadísticas de una entrevista específica.
 *
 * @name GET /interview/:interviewId
 * @function
 * @memberof module:routes/stats
 * @param {express.Request} req - Con `interviewId` en params
 * @param {express.Response} res
 * @access Private (JWT requerido)
 */
router.get('/interview/:interviewId', authMiddleware, statsController.getInterviewStats);

/**
 * Obtiene tendencias de rendimiento del usuario.
 *
 * @name GET /trends
 * @function
 * @memberof module:routes/stats
 * @param {express.Request} req
 * @param {express.Response} res
 * @access Private (JWT requerido)
 */
router.get('/trends', authMiddleware, statsController.getPerformanceTrends);

module.exports = router;
