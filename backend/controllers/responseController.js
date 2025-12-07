const Response = require('../models/Response');
const Question = require('../models/Question');
const Interview = require('../models/Interview');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
        console.log('🤖 Iniciando evaluación con IA...');
        console.log('📝 Pregunta:', question.questionText.substring(0, 100));
        console.log('💬 Respuesta:', responseText.substring(0, 100));
        
        // Obtener el contexto del repositorio si existe
        const repoContext = interview.repoContext;
        let contextInfo = '';

        if (repoContext && repoContext.readmeContent) {
          contextInfo = `
CONTEXTO DEL REPOSITORIO (${repoContext.owner}/${repoContext.repo}):
${repoContext.readmeContent.slice(0, 3000)}

Este contexto debe ser usado para evaluar si la respuesta del candidato demuestra comprensión real del proyecto, sus tecnologías y funcionalidades específicas.
`;
          console.log('📚 Usando contexto del repositorio:', repoContext.owner, '/', repoContext.repo);
        } else {
          console.log('⚠️  Sin contexto del repositorio');
        }

        const languageMap = {
          'en': 'English',
          'es': 'Español',
          'fr': 'Français',
          'de': 'Deutsch'
        };

        const evaluationLanguage = languageMap[interview.language] || 'English';

        const prompt = `Eres un entrevistador técnico amable y comprensivo evaluando a un candidato para un puesto de desarrollador. Tu enfoque es FORMATIVO y ALENTADOR, valorando el esfuerzo y el conocimiento demostrado.

${contextInfo}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREGUNTA TÉCNICA:
"${question.questionText}"

RESPUESTA DEL CANDIDATO:
"${responseText}"
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

        console.log('🤖 Llamando a Gemini API...');

        const result = await genAI.models.generateContent({
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

        console.log('📥 Respuesta recibida de Gemini');
        const analysis = JSON.parse(result.text.trim());

        console.log('✅ Evaluación completada. Score:', analysis.score);
        console.log('💪 Fortalezas:', analysis.strengths?.length || 0);
        console.log('📈 Mejoras:', analysis.improvements?.length || 0);

        response.score = Math.min(100, Math.max(0, analysis.score || 0));
        response.feedback = analysis.feedback || '';
        response.analysis = {
          strengths: analysis.strengths || [],
          areasForImprovement: analysis.improvements || [],
          keywords: analysis.keywords || []
        };
      } catch (error) {
        console.error('❌ Error en evaluación con IA:', error.message);
        console.error('📋 Detalles del error:', error);
        response.score = 50;
        response.feedback = 'No se pudo generar feedback en este momento. Puntuación asignada por defecto.';
      }
    } else {
      if (!responseText) {
        console.log('⚠️  Sin texto de respuesta, asignando score por defecto');
      }
      if (!genAI) {
        console.log('⚠️  Gemini AI no disponible, asignando score por defecto');
      }
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
