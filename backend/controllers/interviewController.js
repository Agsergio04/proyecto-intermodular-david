/**
 * Controlador de entrevistas.
 *
 * Gestiona la generación de preguntas con IA, la creación, obtención,
 * actualización y eliminación de entrevistas y sus recursos asociados.
 *
 * @module controllers/interviewController
 */
const Interview = require('../models/Interview');
const Question = require('../models/Question');
const Response = require('../models/Response');
const User = require('../models/User');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY not set. AI features will be disabled.");
}

/**
 * Normaliza una dificultad arbitraria al formato interno: "easy" | "medium" | "hard".
 *
 * @param {string} difficulty - Texto de dificultad recibido (puede estar en varios idiomas o sinónimos).
 * @returns {"easy"|"medium"|"hard"} Dificultad normalizada.
 */
const normalizeDifficulty = (difficulty) => {
  const normalized = difficulty.toLowerCase().trim();

  if (normalized === 'easy' || normalized === 'junior' || normalized === 'fácil' || normalized === 'facil') {
    return 'easy';
  }

  if (normalized === 'medium' || normalized === 'mid' || normalized === 'media' || normalized === 'medio') {
    return 'medium';
  }

  if (normalized === 'hard' || normalized === 'senior' || normalized === 'difícil' || normalized === 'dificil') {
    return 'hard';
  }

  return 'medium';
};

/**
 * Genera preguntas técnicas de entrevista usando Gemini a partir de un repositorio.
 *
 * Espera en el body:
 * - repoUrl {string} URL del repositorio a analizar (obligatorio).
 * - difficulty {string} Nivel de dificultad objetivo (opcional, por defecto "mid").
 * - language {string} Idioma de las preguntas ("en" | "es" | "fr" | "de", por defecto "en").
 * - count {number} Número de preguntas a generar (por defecto 5).
 *
 * Respuesta:
 * - 200: { message, questions: [{ question: string, difficulty: string }] }
 * - 400: Falta repoUrl.
 * - 503: Servicio de IA no disponible.
 * - 500: Error interno generando las preguntas.
 *
 * @async
 * @param {import('express').Request} req - Petición HTTP de Express.
 * @param {import('express').Response} res - Respuesta HTTP de Express.
 * @returns {Promise<void>}
 */
exports.generateAIQuestions = async (req, res) => {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        message: 'AI service not available. GEMINI_API_KEY not configured.'
      });
    }

    console.log('🔎 Body recibido en generateAIQuestions:', JSON.stringify(req.body));

    const { repoUrl, difficulty, language, count } = req.body;

    if (!repoUrl) {
      console.log('❌ Error: repoUrl no recibido o vacío');
      return res.status(400).json({ message: 'Repository URL is required', body: req.body });
    }

    const difficultyLevel = difficulty || 'mid';
    const lang = language || 'en';
    const questionCount = count || 5;

    const languageText =
      lang === 'es' ? 'español' :
      lang === 'fr' ? 'francés' :
      lang === 'de' ? 'alemán' :
      'inglés';

    try {
      const prompt = `Generate exactly ${questionCount} technical interview questions for a repository at ${repoUrl} for a ${difficultyLevel} level position in ${languageText} language. The questions should cover a range of topics relevant to the code and technologies found in the repository.

Return a JSON object with this format:

"questions": [
{"question": "text", "difficulty": "easy|medium|hard"}
]`;

      const result = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              questions: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    question: { type: 'STRING' },
                    difficulty: { type: 'STRING' }
                  },
                  required: ['question', 'difficulty']
                }
              }
            },
            required: ['questions']
          }
        }
      });

      const jsonText = result.text.trim();
      const resultData = JSON.parse(jsonText);
      const questions = resultData.questions || [];

      res.status(200).json({
        message: 'Questions generated successfully',
        questions
      });
    } catch (error) {
      console.error('Gemini API error:', error);
      res.status(500).json({ message: 'Error generating questions with AI', error: error.message });
    }
  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({ message: 'Error generating questions', error: error.message });
  }
};

/**
 * Crea una nueva entrevista para el usuario autenticado.
 *
 * Body esperado:
 * - title {string} Título de la entrevista.
 * - repoUrl {string} URL del repositorio asociado (opcional).
 * - type {"custom"|"ai_generated"|string} Tipo de entrevista.
 * - difficulty {string} Dificultad, requerida para IA, opcional en custom.
 * - language {string} Idioma de la entrevista (por defecto el del usuario o "en").
 * - questions {Array<{question?: string, questionText?: string, difficulty?: string}>} Preguntas iniciales.
 * - repoContext {any} Contexto adicional del repositorio (opcional).
 *
 * Requiere:
 * - req.userId establecido mediante middleware de autenticación.
 *
 * Respuesta:
 * - 201: Entrevista creada con las preguntas pobladas.
 * - 404: Usuario no encontrado.
 * - 500: Error creando la entrevista.
 *
 * @async
 * @param {import('express').Request} req - Petición HTTP de Express.
 * @param {import('express').Response} res - Respuesta HTTP de Express.
 * @returns {Promise<void>}
 */
exports.createInterview = async (req, res) => {
  try {
    const { title, repoUrl, type, difficulty, language, questions, repoContext } = req.body;

    console.log('📝 Creating interview with:', {
      title,
      repoUrl,
      type,
      difficulty,
      language,
      questions,
      hasRepoContext: !!repoContext
    });

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const interviewData = {
      userId: req.userId,
      title,
      repoUrl,
      type,
      language: language || user.language || 'en',
      repositoryUrl: repoUrl || null,
      repoContext: repoContext || null
    };

    if (type === 'ai_generated' || difficulty) {
      interviewData.difficulty = difficulty || 'mid';
    }

    const interview = new Interview(interviewData);
    await interview.save();
    console.log('✅ Interview saved:', interview._id);

    let createdQuestions = [];

    if (questions && questions.length > 0) {
      console.log('📝 Creating questions...');
      for (let i = 0; i < questions.length; i++) {
        try {
          const questionText = questions[i].question || questions[i].questionText;

          const questionDifficulty = type === 'custom'
            ? 'manual'
            : normalizeDifficulty(questions[i].difficulty || 'medium');

          console.log(`Creating question ${i + 1}:`, questionText, `| Difficulty: ${questionDifficulty}`);

          const question = new Question({
            interviewId: interview._id,
            questionText: questionText,
            order: i + 1,
            difficulty: questionDifficulty
          });

          await question.save();
          console.log(`✅ Question ${i + 1} saved:`, question._id);

          createdQuestions.push(question);
          interview.questions.push(question._id);
        } catch (questionError) {
          console.error(`❌ Error creating question ${i + 1}:`, questionError.message);
          throw questionError;
        }
      }

      interview.statistics = {
        totalQuestions: createdQuestions.length,
        answeredQuestions: 0,
        skippedQuestions: 0,
        averageResponseTime: 0,
        confidence: 0
      };

      console.log(`✅ All ${createdQuestions.length} questions created`);
    }

    await interview.save();
    console.log('✅ Interview with questions saved');

    user.interviews.push(interview._id);
    await user.save();
    console.log('✅ User updated');

    await interview.populate('questions');
    console.log('✅ Interview populated with questions');
    console.log('📊 Questions in response:', interview.questions.length);

    res.status(201).json({
      message: 'Interview created successfully',
      interview: {
        id: interview._id,
        title: interview.title,
        repoUrl: interview.repoUrl,
        type: interview.type,
        difficulty: interview.difficulty,
        language: interview.language,
        status: interview.status,
        repositoryUrl: interview.repositoryUrl,
        questions: interview.questions
      }
    });
  } catch (error) {
    console.error('❌ Create interview error:', error.message);
    res.status(500).json({
      message: 'Error creating interview',
      error: error.message
    });
  }
};

/**
 * Obtiene todas las entrevistas del usuario autenticado.
 *
 * Requiere:
 * - req.userId establecido.
 *
 * Respuesta:
 * - 200: { count, interviews: Interview[] (con preguntas pobladas) }
 * - 500: Error al obtener las entrevistas.
 *
 * @async
 * @param {import('express').Request} req - Petición HTTP de Express.
 * @param {import('express').Response} res - Respuesta HTTP de Express.
 * @returns {Promise<void>}
 */
exports.getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId })
      .populate('questions')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: interviews.length,
      interviews
    });
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({ message: 'Error fetching interviews', error: error.message });
  }
};

/**
 * Obtiene una entrevista concreta por ID, con preguntas y respuestas pobladas.
 *
 * Params:
 * - interviewId {string} ID de la entrevista.
 *
 * Requiere:
 * - req.userId coincidiendo con interview.userId.
 *
 * Respuesta:
 * - 200: { interview }
 * - 403: Usuario no autorizado para esta entrevista.
 * - 404: Entrevista no encontrada.
 * - 500: Error al obtener la entrevista.
 *
 * @async
 * @param {import('express').Request} req - Petición HTTP de Express.
 * @param {import('express').Response} res - Respuesta HTTP de Express.
 * @returns {Promise<void>}
 */
exports.getInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId)
      .populate({
        path: 'questions',
        populate: {
          path: 'responses'
        }
      });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    console.log('✅ Interview retrieved:', interview._id);
    console.log('📊 Questions count:', interview.questions?.length || 0);

    if (interview.questions && interview.questions.length > 0) {
      console.log('📝 First question:', JSON.stringify(interview.questions[0], null, 2));
      console.log('📝 First question text:', interview.questions[0]?.questionText);
      console.log('📝 First question responses count:', interview.questions[0]?.responses?.length || 0);
      console.log('📝 All questions:', interview.questions.map((q, i) => ({
        index: i,
        id: q._id,
        text: q.questionText,
        difficulty: q.difficulty,
        responsesCount: q.responses?.length || 0
      })));
    } else {
      console.log('⚠️ No questions found in interview!');
    }

    res.status(200).json({ interview });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ message: 'Error fetching interview', error: error.message });
  }
};

/**
 * Actualiza el estado de una entrevista.
 *
 * Params:
 * - interviewId {string} ID de la entrevista.
 *
 * Body:
 * - status {string} Nuevo estado de la entrevista, por ejemplo "in_progress" o "completed".
 *
 * Requiere:
 * - req.userId coincidiendo con interview.userId.
 *
 * Efectos adicionales:
 * - Si status === "completed", se establece completedAt.
 * - Siempre actualiza updatedAt.
 *
 * Respuesta:
 * - 200: { message, interview }
 * - 403: Usuario no autorizado.
 * - 404: Entrevista no encontrada.
 * - 500: Error al actualizar la entrevista.
 *
 * @async
 * @param {import('express').Request} req - Petición HTTP de Express.
 * @param {import('express').Response} res - Respuesta HTTP de Express.
 * @returns {Promise<void>}
 */
exports.updateInterviewStatus = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { status } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    interview.status = status;

    if (status === 'completed') {
      interview.completedAt = Date.now();
    }

    interview.updatedAt = Date.now();
    await interview.save();

    res.status(200).json({
      message: 'Interview updated successfully',
      interview
    });
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({ message: 'Error updating interview', error: error.message });
  }
};

/**
 * Elimina una entrevista y sus preguntas/respuestas asociadas.
 *
 * Params:
 * - interviewId {string} ID de la entrevista a eliminar.
 *
 * Requiere:
 * - req.userId coincidiendo con interview.userId.
 *
 * Efectos:
 * - Elimina documentos de Question y Response asociados a interviewId.
 * - Elimina la propia Interview.
 * - Quita la referencia de la entrevista del documento User correspondiente.
 *
 * Respuesta:
 * - 200: { message }
 * - 403: Usuario no autorizado.
 * - 404: Entrevista no encontrada.
 * - 500: Error al eliminar la entrevista.
 *
 * @async
 * @param {import('express').Request} req - Petición HTTP de Express.
 * @param {import('express').Response} res - Respuesta HTTP de Express.
 * @returns {Promise<void>}
 */
exports.deleteInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Question.deleteMany({ interviewId });
    await Response.deleteMany({ interviewId });
    await Interview.findByIdAndDelete(interviewId);

    await User.findByIdAndUpdate(req.userId, {
      $pull: { interviews: interviewId }
    });

    res.status(200).json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ message: 'Error deleting interview', error: error.message });
  }
};

/**
 * Actualiza la URL del repositorio asociada a una entrevista.
 *
 * Params:
 * - interviewId {string} ID de la entrevista.
 *
 * Body:
 * - repositoryUrl {string|null} Nueva URL del repositorio, o null para limpiar el campo.
 *
 * Requiere:
 * - req.userId coincidiendo con interview.userId.
 *
 * Efectos:
 * - Actualiza interview.repositoryUrl.
 * - Actualiza interview.updatedAt.
 *
 * Respuesta:
 * - 200: { message, interview: { id, title, repositoryUrl } }
 * - 403: Usuario no autorizado.
 * - 404: Entrevista no encontrada.
 * - 500: Error al actualizar el repositorio.
 *
 * @async
 * @param {import('express').Request} req - Petición HTTP de Express.
 * @param {import('express').Response} res - Respuesta HTTP de Express.
 * @returns {Promise<void>}
 */
exports.updateInterviewRepository = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { repositoryUrl } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    interview.repositoryUrl = repositoryUrl || null;
    interview.updatedAt = Date.now();
    await interview.save();

    res.status(200).json({
      message: 'Repository URL updated successfully',
      interview: {
        id: interview._id,
        title: interview.title,
        repositoryUrl: interview.repositoryUrl
      }
    });
  } catch (error) {
    console.error('Update repository URL error:', error);
    res.status(500).json({ message: 'Error updating repository URL', error: error.message });
  }
};
