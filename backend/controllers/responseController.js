/**
 * Interview responses controller.
 *
 * Manages submission, retrieval, update and automated evaluation of
 * responses tied to questions and interviews, including AI-generated
 * feedback (Gemini).
 *
 * @module controllers/responseController
 */
const Response = require('../models/Response');
const Question = require('../models/Question');
const Interview = require('../models/Interview');
const { GoogleGenerativeAI } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  GEMINI_API_KEY not set. AI features will be disabled.");
}

/**
 * Submit a response for a specific interview question.
 *
 * Body:
 * - questionId {string} ID of the answered question.
 * - interviewId {string} ID of the interview.
 * - responseText {string} Text of the response (optional if audio used).
 * - responseAudio {string} Reference/URL to audio (optional).
 * - duration {number} Duration in seconds (optional).
 *
 * Requires:
 * - `req.userId` matching the interview.userId.
 *
 * Responses:
 * - 201: { message, response: { id, questionId, interviewId, responseText, duration } }
 * - 403: Unauthorized.
 * - 404: Question or interview not found.
 * - 500: Error saving the response.
 *
 * @async
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 * @access Private
 */

exports.submitResponse = async (req, res) => {
  try {
    const { questionId, interviewId, responseText, responseAudio, duration } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Create response (sin generar feedback automáticamente)
    const response = new Response({
      questionId,
      interviewId,
      responseText,
      responseAudio,
      duration: duration || 0,
      score: null, // Se generará bajo demanda
      feedback: null,
      analysis: null
    });

    console.log('💾 Saving response without evaluation (will be evaluated when feedback is requested)');

    await response.save();

    // Update question with response
    question.responses.push(response._id);
    await question.save();
    
    console.log(`✅ Response added to question. Question now has ${question.responses.length} responses`);
    console.log(`📝 Response IDs:`, question.responses);

    // Update interview statistics (without including score until feedback is generated)
    const allResponses = await Response.find({ interviewId });
    const answeredQuestions = allResponses.filter(r => r.responseText || r.responseAudio).length;
    const responsesWithScore = allResponses.filter(r => r.score !== null && r.score !== undefined);
    const totalScore = responsesWithScore.length > 0 
      ? responsesWithScore.reduce((sum, r) => sum + r.score, 0) / responsesWithScore.length 
      : null;
    const averageTime = allResponses.reduce((sum, r) => sum + r.duration, 0) / allResponses.length || 0;

    interview.statistics = {
      totalQuestions: interview.questions.length,
      answeredQuestions,
      skippedQuestions: interview.questions.length - answeredQuestions,
      averageResponseTime: Math.round(averageTime),
      confidence: totalScore !== null ? Math.round(totalScore) : null
    };

    interview.totalScore = totalScore !== null ? Math.round(totalScore) : null;
    interview.updatedAt = Date.now();
    await interview.save();

    res.status(201).json({
      message: 'Response submitted successfully',
      response: {
        id: response._id,
        questionId: response.questionId,
        interviewId: response.interviewId,
        responseText: response.responseText,
        duration: response.duration
        // score, feedback y analysis se generarán bajo demanda
      }
    });
  } catch (error) {
    console.error('Submit response error:', error);
    res.status(500).json({ message: 'Error submitting response', error: error.message });
  }
};

/**
 * Retrieve all responses for an interview.
 *
 * Params:
 * - interviewId {string} Interview ID.
 *
 * Requires:
 * - `req.userId` matching interview.userId.
 *
 * Responses:
 * - 200: { count, responses } (with questionId populated).
 * - 403: Unauthorized.
 * - 404: Interview not found.
 * - 500: Error fetching responses.
 *
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @access Private
 */
exports.getResponses = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const responses = await Response.find({ interviewId }).populate('questionId');

    res.status(200).json({
      count: responses.length,
      responses
    });
  } catch (error) {
    console.error('Get responses error:', error);
    res.status(500).json({ message: 'Error fetching responses', error: error.message });
  }
};

/**
 * Retrieve a specific response by its ID.
 *
 * Params:
 * - responseId {string} Response ID.
 *
 * Requires:
 * - `req.userId` matching the interview owner.
 *
 * Responses:
 * - 200: { response } (with questionId and interviewId populated).
 * - 403: Unauthorized.
 * - 404: Response not found.
 * - 500: Error fetching the response.
 *
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @access Private
 */
exports.getResponse = async (req, res) => {
  try {
    const { responseId } = req.params;

    const response = await Response.findById(responseId)
      .populate('questionId')
      .populate('interviewId');

    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    if (response.interviewId.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json({ response });
  } catch (error) {
    console.error('Get response error:', error);
    res.status(500).json({ message: 'Error fetching response', error: error.message });
  }
};

/**
 * Update an existing response.
 *
 * Params:
 * - responseId {string} Response ID.
 *
 * Body:
 * - responseText {string} New response text (optional).
 * - responseAudio {string} New response audio (optional).
 * - duration {number} New duration (optional).
 *
 * Requires:
 * - `req.userId` matching the interview owner.
 *
 * Responses:
 * - 200: { message, response }
 * - 403: Unauthorized.
 * - 404: Response not found.
 * - 500: Error updating the response.
 *
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @access Private
 */
exports.updateResponse = async (req, res) => {
  try {
    const { responseId } = req.params;
    const { responseText, responseAudio, duration } = req.body;

    const response = await Response.findById(responseId).populate('interviewId');
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    if (response.interviewId.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (responseText) response.responseText = responseText;
    if (responseAudio) response.responseAudio = responseAudio;
    if (duration) response.duration = duration;

    await response.save();

    res.status(200).json({
      message: 'Response updated successfully',
      response
    });
  } catch (error) {
    console.error('Update response error:', error);
    res.status(500).json({ message: 'Error updating response', error: error.message });
  }
};

/**
 * Generate AI feedback and scoring for all responses of an interview, updating
 * the interview statistics.
 *
 * Params:
 * - interviewId {string} Interview ID.
 *
 * Requires:
 * - `req.userId` matching the interview owner.
 * - `GEMINI_API_KEY` configured.
 *
 * Effects:
 * - Evaluates only responses that contain text and do not already have feedback.
 * - Updates `score`, `feedback`, `analysis` and `confidence` for each response.
 * - Updates `interview.statistics.confidence` and `interview.totalScore`.
 *
 * Responses:
 * - 200: { message, evaluatedCount, errorCount, totalResponses, averageScore, evaluatedResponses }
 * - 400: No responses to evaluate.
 * - 403: Unauthorized.
 * - 404: Interview not found.
 * - 503: AI service not available.
 * - 500: Error generating feedback.
 *
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @access Private
 */
exports.generateInterviewFeedback = async (req, res) => {
  try {
    const { interviewId } = req.params;

    console.log(`🎯 Generando feedback para entrevista ${interviewId}`);

    const interview = await Interview.findById(interviewId).populate('questions');
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!genAI || !process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        message: 'AI service not available. GEMINI_API_KEY not configured.'
      });
    }

    // Obtener todas las respuestas de la entrevista
    const responses = await Response.find({ interviewId });
    console.log(`📝 Found ${responses.length} responses`);

    if (responses.length === 0) {
      return res.status(400).json({ message: 'No responses found for this interview' });
    }

    const repoContext = interview.repoContext;
    const languageMap = {
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch'
    };
    const evaluationLanguage = languageMap[interview.language] || 'English';

    let evaluatedCount = 0;
    let errorCount = 0;
    const evaluatedResponses = [];

    // Generate feedback for each response that has text and no prior feedback
    for (const response of responses) {
      if (!response.responseText || (response.feedback && response.score !== null)) {
        console.log(`⏭️  Skipping response ${response._id} (no text or already evaluated)`);
        continue;
      }

      const question = await Question.findById(response.questionId);
      if (!question) {
        console.log(`⚠️  Question not found for response ${response._id}`);
        continue;
      }

      try {
        console.log(`🤖 Evaluando respuesta ${evaluatedCount + 1}...`);

        let contextInfo = '';
        if (repoContext && repoContext.readmeContent) {
          contextInfo = `
CONTEXTO DEL REPOSITORIO (${repoContext.owner}/${repoContext.repo}):
${repoContext.readmeContent.slice(0, 3000)}

Este contexto debe ser usado para evaluar si la respuesta del candidato demuestra comprensión real del proyecto, sus tecnologías y funcionalidades específicas.
`;
        }

        const prompt = `Eres un entrevistador técnico amable y comprensivo evaluando a un candidato para un puesto de desarrollador. Tu enfoque es FORMATIVO y ALENTADOR, valorando el esfuerzo y el conocimiento demostrado.

${contextInfo}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREGUNTA TÉCNICA:
"${question.questionText}"

RESPUESTA DEL CANDIDATO:
"${response.responseText}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILOSOFÍA DE EVALUACIÓN:
Eres COMPRENSIVO y GENEROSO. Valoras el esfuerzo, la iniciativa y cualquier conocimiento demostrado. Los errores menores NO deben penalizar severamente. Enfócate en lo POSITIVO que el candidato muestra.

CRITERIOS DE EVALUACIÓN (con enfoque positivo):

1. **CONOCIMIENTO DEL PROYECTO** (25 puntos):
   ${repoContext ? `
   - Si menciona CUALQUIER aspecto relacionado con ${repoContext.owner}/${repoContext.repo}, otorga puntos generosamente
   - Valora positivamente incluso referencias generales al tipo de tecnología
   - No penalices si la conexión con el proyecto es parcial
   ` : '- Valora cualquier conocimiento técnico relevante'}

2. **COMPRENSIÓN TÉCNICA** (25 puntos):
   - ¿Demuestra entendimiento básico del concepto? → Da puntos
   - ¿Intenta explicar aunque sea de forma simple? → Da puntos
   - ¿Menciona términos técnicos relevantes? → Da puntos
   - Errores menores NO deben restar mucho

3. **ESFUERZO Y CLARIDAD** (25 puntos):
   - ¿Se nota que pensó la respuesta? → Da puntos
   - ¿Intenta estructurar su explicación? → Da puntos
   - ¿Proporciona algún ejemplo aunque sea básico? → Da puntos

4. **ACTITUD Y APLICABILIDAD** (25 puntos):
   - ¿La respuesta es sincera y muestra interés? → Da puntos
   - ¿Intenta aplicar conocimiento práctico? → Da puntos
   - Valora el intento aunque no sea perfecto

ESCALA DE PUNTUACIÓN (GENEROSA):
- **85-100**: Excelente. Respuesta bien pensada que demuestra conocimiento y esfuerzo. Puede tener pequeños errores pero el concepto general es sólido.
- **70-84**: Muy buena. Respuesta correcta con entendimiento claro del tema. Algunos detalles podrían mejorarse pero está bien.
- **55-69**: Buena. Respuesta válida que muestra comprensión básica. Aunque simple, demuestra que entiende el concepto.
- **40-54**: Aceptable. Respuesta incompleta pero muestra algo de conocimiento. Hay esfuerzo visible.
- **25-39**: Necesita mejorar. Respuesta muy básica o con varios errores, pero hay algún intento de responder.
- **0-24**: Insuficiente. Respuesta muy alejada del tema o sin contenido relevante.

REGLAS IMPORTANTES:
- SÉ GENEROSO con la puntuación - errores menores no deben bajar mucho la nota
- Si el candidato demuestra CUALQUIER conocimiento relevante, la nota debe ser al menos 55-60
- Una respuesta con esfuerzo visible debe estar en 65-75 mínimo
- Solo da notas bajas (<50) si realmente no hay contenido relevante
- El feedback debe ser ALENTADOR y CONSTRUCTIVO
- EXPLICA CLARAMENTE por qué diste esa puntuación específica
- Menciona primero lo bueno, luego sugerencias de mejora

FORMATO DE SALIDA: JSON con:
- score (número 0-100): Puntuación GENEROSA basada en lo positivo de la respuesta
- strengths (array de 2-4 strings): Fortalezas específicas - SÉ GENEROSO, encuentra lo bueno
- improvements (array de 2-3 strings): Sugerencias constructivas y amables para mejorar
- keywords (array de strings): Conceptos técnicos mencionados (da crédito por intentarlo)
- feedback (string): Retroalimentación DETALLADA (200-300 palabras) en ${evaluationLanguage} que:
  * Empiece destacando lo positivo
  * EXPLIQUE CLARAMENTE por qué obtuviste esta puntuación (ej: "Te he dado 75 puntos porque...")
  * Detalle los criterios evaluados y cómo los cumplió
  * Termine con sugerencias constructivas para mejorar`;

        const { GoogleGenAI } = require("@google/genai");
        const genAIInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const result = await genAIInstance.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                score: { type: 'NUMBER' },
                strengths: {
                  type: 'ARRAY',
                  items: { type: 'STRING' }
                },
                improvements: {
                  type: 'ARRAY',
                  items: { type: 'STRING' }
                },
                keywords: {
                  type: 'ARRAY',
                  items: { type: 'STRING' }
                },
                feedback: { type: 'STRING' }
              },
              required: ['score', 'strengths', 'improvements', 'keywords', 'feedback']
            }
          }
        });

        const analysis = JSON.parse(result.text.trim());

        response.score = Math.min(100, Math.max(0, analysis.score || 0));
        response.feedback = analysis.feedback || '';
        response.analysis = {
          strengths: analysis.strengths || [],
          areasForImprovement: analysis.improvements || [],
          keywords: analysis.keywords || []
        };
        response.confidence = response.score;

        await response.save();
        evaluatedCount++;
        evaluatedResponses.push({
          responseId: response._id,
          questionId: question._id,
          score: response.score
        });

        console.log(`✅ Respuesta ${evaluatedCount} evaluada. Score: ${response.score}`);

      } catch (error) {
        console.error(`❌ Error evaluando respuesta ${response._id}:`, error.message);
        errorCount++;
      }
    }

    // Actualizar estadísticas de la entrevista
    const allResponses = await Response.find({ interviewId });
    const responsesWithScore = allResponses.filter(r => r.score !== null && r.score !== undefined);
    const totalScore = responsesWithScore.length > 0 
      ? responsesWithScore.reduce((sum, r) => sum + r.score, 0) / responsesWithScore.length 
      : null;

    interview.statistics.confidence = totalScore !== null ? Math.round(totalScore) : null;
    interview.totalScore = totalScore !== null ? Math.round(totalScore) : null;
    interview.updatedAt = Date.now();
    await interview.save();

    console.log(`🎉 Feedback generado para ${evaluatedCount} respuestas. Errores: ${errorCount}`);

    res.status(200).json({
      message: 'Interview feedback generated successfully',
      evaluatedCount,
      errorCount,
      totalResponses: responses.length,
      averageScore: totalScore,
      evaluatedResponses
    });

  } catch (error) {
    console.error('Generate interview feedback error:', error);
    res.status(500).json({ 
      message: 'Error generating interview feedback', 
      error: error.message 
    });
  }
};
