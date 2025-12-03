const Response = require('../models/Response');
const Question = require('../models/Question');
const Interview = require('../models/Interview');
const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  GEMINI_API_KEY not set. AI features will be disabled.");
}

// Submit response to a question
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

    // Create response
    const response = new Response({
      questionId,
      interviewId,
      responseText,
      responseAudio,
      duration: duration || 0
    });

    // Generate AI feedback and scoring with Gemini
    if (responseText && genAI) {
      try {
        // Obtener el contexto del repositorio si existe
        const repoContext = interview.repoContext;
        let contextInfo = '';

        if (repoContext && repoContext.readmeContent) {
          contextInfo = `
CONTEXTO DEL REPOSITORIO (${repoContext.owner}/${repoContext.repo}):
${repoContext.readmeContent.slice(0, 3000)}

Este contexto debe ser usado para evaluar si la respuesta del candidato demuestra comprensión real del proyecto, sus tecnologías y funcionalidades específicas.
`;
        }

        const languageMap = {
          'en': 'English',
          'es': 'Español',
          'fr': 'Français',
          'de': 'Deutsch'
        };

        const evaluationLanguage = languageMap[interview.language] || 'English';

        const prompt = `Eres un entrevistador técnico experto evaluando a un candidato. Tu objetivo es evaluar la respuesta de manera justa, precisa y HUMANA.

${contextInfo}

PREGUNTA TÉCNICA:
"${question.questionText}"

RESPUESTA DEL CANDIDATO:
"${responseText}"

INSTRUCCIONES PARA LA EVALUACIÓN:
1. Evalúa la profundidad técnica de la respuesta
2. Si hay contexto del repositorio, verifica si el candidato demuestra conocimiento específico del proyecto
3. Considera la claridad y estructura de la respuesta
4. Valora ejemplos prácticos y experiencia real
5. Sé justo pero exigente - una respuesta superficial debe tener nota baja
6. Una respuesta completa, técnica y bien explicada debe tener nota alta (80-100)
7. La puntuación debe reflejar:
   - 90-100: Respuesta excelente, completa, con ejemplos y conocimiento profundo
   - 70-89: Respuesta buena, correcta pero puede mejorar en profundidad
   - 50-69: Respuesta aceptable pero con carencias importantes
   - 30-49: Respuesta incompleta o con errores conceptuales
   - 0-29: Respuesta muy deficiente o incorrecta

IMPORTANTE: El feedback debe ser en ${evaluationLanguage} y tener un tono profesional pero cercano, como un mentor que quiere ayudar al candidato a mejorar.

FORMATO DE SALIDA: JSON con:
- score (número 0-100): Puntuación objetiva
- strengths (array de strings): Fortalezas específicas de la respuesta
- improvements (array de strings): Áreas concretas de mejora
- keywords (array de strings): Conceptos técnicos clave mencionados
- feedback (string): Retroalimentación detallada y constructiva en ${evaluationLanguage}`;

        console.log('🤖 Evaluando respuesta con Gemini usando contexto del repositorio...');

        const result = await genAI.models.generateContent({
            model: 'gemini-pro',
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

        console.log('✅ Evaluación completada. Score:', analysis.score);

        response.score = Math.min(100, Math.max(0, analysis.score || 0));
        response.feedback = analysis.feedback || '';
        response.analysis = {
          strengths: analysis.strengths || [],
          areasForImprovement: analysis.improvements || [],
          keywords: analysis.keywords || []
        };
      } catch (error) {
        console.error('Error getting feedback:', error);
        response.score = 50;
        response.feedback = 'Unable to generate feedback at this time';
      }
    } else {
      response.score = 50;
    }

    response.confidence = response.score;
    await response.save();

    // Update question with response
    question.responses.push(response._id);
    await question.save();
    
    console.log(`✅ Response added to question. Question now has ${question.responses.length} responses`);
    console.log(`📝 Response IDs:`, question.responses);

    // Update interview statistics
    const allResponses = await Response.find({ interviewId });
    const answeredQuestions = allResponses.filter(r => r.responseText || r.responseAudio).length;
    const totalScore = allResponses.reduce((sum, r) => sum + r.score, 0) / allResponses.length || 0;
    const averageTime = allResponses.reduce((sum, r) => sum + r.duration, 0) / allResponses.length || 0;

    interview.statistics = {
      totalQuestions: interview.questions.length,
      answeredQuestions,
      skippedQuestions: interview.questions.length - answeredQuestions,
      averageResponseTime: Math.round(averageTime),
      confidence: Math.round(totalScore)
    };

    interview.totalScore = Math.round(totalScore);
    interview.updatedAt = Date.now();
    await interview.save();

    res.status(201).json({
      message: 'Response submitted successfully',
      response: {
        id: response._id,
        score: response.score,
        feedback: response.feedback,
        analysis: response.analysis,
        confidence: response.confidence
      }
    });
  } catch (error) {
    console.error('Submit response error:', error);
    res.status(500).json({ message: 'Error submitting response', error: error.message });
  }
};

// Get responses for an interview
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

// Get specific response
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

// Update response
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
