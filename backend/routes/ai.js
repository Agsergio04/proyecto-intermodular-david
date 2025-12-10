/**
 * @fileoverview Rutas de servicios de IA con Google Gemini.
 * @module routes/ai
 * @description Transcripción de audio, generación de preguntas y evaluación de respuestas.
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
let ai = null;

if (API_KEY) {
  ai = new GoogleGenerativeAI(API_KEY);
} else {
  console.warn('GEMINI_API_KEY not set. AI features will be disabled.');
}

/**
 * @typedef {Object} TranscribeRequest
 * @property {string} audioBase64 - Audio en base64 (WebM)
 * @property {string} [language] - Idioma de transcripción
 */

/**
 * @typedef {Object} NextQuestionRequest
 * @property {Array<{question: string, answer: string}>} interviewHistory - Historial QA
 * @property {string} profession - Profesión del candidato
 * @property {string} [language] - Idioma ('en', 'es')
 * @property {string} [difficulty] - Dificultad ('easy', 'mid', 'hard')
 */

/**
 * @typedef {Object} EvaluateResponseRequest
 * @property {string} question - Pregunta evaluada
 * @property {string} response - Respuesta del candidato
 * @property {string} profession - Profesión del candidato
 * @property {string} [language] - Idioma del feedback
 */

/**
 * Convierte speech-to-text usando Gemini.
 *
 * @name POST /transcribe
 * @function
 * @memberof module:routes/ai
 * @param {express.Request<any, any, TranscribeRequest>} req
 * @param {express.Response<{text: string}>} res
 * @access Private (JWT requerido)
 */
router.post('/transcribe', authMiddleware, async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ message: 'AI service not available. GEMINI_API_KEY not configured.' });
    }

    const { audioBase64, language = 'en' } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ message: 'Audio data is required' });
    }

    try {
      const response = await ai.getGenerativeModel({ model: 'gemini-2.0-flash' })
        .generateContent({
          contents: [{
            parts: [
              { text: `Transcribe this audio in language ${language}. Return ONLY the transcription text, nothing else.` },
              {
                inlineData: {
                  mimeType: 'audio/webm',
                  data: audioBase64
                }
              }
            ]
          }]
        });

      const transcript = response.response.text().trim();
      res.status(200).json({ text: transcript });
    } catch (error) {
      console.error('Transcription error:', error);
      res.status(500).json({ message: 'Error transcribing audio', error: error.message });
    }
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ message: 'Error transcribing audio', error: error.message });
  }
});

/**
 * Genera la siguiente pregunta de entrevista basada en historial.
 *
 * @name POST /next-question
 * @function
 * @memberof module:routes/ai
 * @param {express.Request<any, any, NextQuestionRequest>} req
 * @param {express.Response} res
 * @access Private (JWT requerido)
 */
router.post('/next-question', authMiddleware, async (req, res) => {
  // ... implementación similar con validaciones y prompts específicos
});

/**
 * Evalúa una respuesta de candidato con IA.
 *
 * @name POST /evaluate-response
 * @function
 * @memberof module:routes/ai
 * @param {express.Request<any, any, EvaluateResponseRequest>} req
 * @param {express.Response} res
 * @access Private (JWT requerido)
 */
router.post('/evaluate-response', authMiddleware, async (req, res) => {
  // ... implementación similar con evaluación estructurada en JSON
});

module.exports = router;
