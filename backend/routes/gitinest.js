const express = require('express');
const router = express.Router();
const GitinestController = require('../controllers/GitinestController');

// Ruta POST / para recibir el enlace de repositorio y generar preguntas
router.post('/', GitinestController.generateTextFromRepo);

module.exports = router;

