/**
 * @fileoverview Rutas para Gitinest - Análisis de repositorios con IA.
 * @module routes/gitinest
 * @description Endpoint único para generar texto y preguntas desde repositorios GitHub.
 */

const express = require('express');
const router = express.Router();
const GitinestController = require('../controllers/GitinestController');

/**
 * Recibe URL de repositorio y genera texto + preguntas con IA.
 *
 * **Endpoint público** - No requiere autenticación.
 *
 * @name POST /
 * @function
 * @memberof module:routes/gitinest
 * @param {express.Request} req - Con `repoUrl` en body
 * @param {express.Response} res
 * @access Public
 * 
 * @example
 * curl -X POST http://localhost:5000/api/gitinest \
 *   -H "Content-Type: application/json" \
 *   -d '{"repoUrl": "https://github.com/user/repo"}'
 */
router.post('/', GitinestController.generateTextFromRepo);

module.exports = router;
