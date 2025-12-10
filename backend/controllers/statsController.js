/**
 * Controlador de estadísticas de entrevistas.
 *
 * Proporciona endpoints para obtener estadísticas globales del usuario,
 * estadísticas detalladas de una entrevista concreta y la evolución
 * del rendimiento a lo largo del tiempo.
 *
 * @module controllers/statsController
 */

const Interview = require('../models/Interview');
const Response = require('../models/Response');

/**
 * Obtiene estadísticas globales del usuario autenticado sobre sus entrevistas.
 *
 * Calcula:
 * - totalInterviews: número total de entrevistas.
 * - completedInterviews: número de entrevistas completadas.
 * - averageScore: media de totalScore de las entrevistas completadas.
 * - totalDuration: suma de las duraciones de todas las entrevistas.
 * - interviewsByMonth: número de entrevistas por mes (clave: "MMM YYYY").
 * - interviewsByProfession: número de entrevistas por repositorio asociado.
 *
 * Requiere:
 * - req.userId establecido por el middleware de autenticación.
 *
 * Respuesta:
 * - 200: { stats: { totalInterviews, completedInterviews, averageScore, totalDuration, interviewsByMonth, interviewsByProfession } }
 * - 500: Error al obtener las estadísticas.
 *
 * @async
 * @param {import('express').Request} req - Petición HTTP.
 * @param {import('express').Response} res - Respuesta HTTP.
 * @returns {Promise<void>}
 */
exports.getUserStats = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId });
    const completedInterviews = interviews.filter(i => i.status === 'completed');
    const totalInterviews = interviews.length;
    const averageScore = completedInterviews.length > 0
        ? completedInterviews.reduce((sum, i) => sum + i.totalScore, 0) / completedInterviews.length
        : 0;
    const totalDuration = interviews.reduce((sum, i) => sum + i.duration, 0);

    // ✅ CORRECCIÓN: Inicializar como objetos vacíos ANTES de usar forEach
    const interviewsByMonth = {};
    interviews.forEach(interview => {
      const month = new Date(interview.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      interviewsByMonth[month] = (interviewsByMonth[month] || 0) + 1;
    });

    const interviewsByRepo = {};
    interviews.forEach(interview => {
      const repoName = interview.repoUrl || interview.repositoryUrl || 'Sin repositorio';
      interviewsByRepo[repoName] = (interviewsByRepo[repoName] || 0) + 1;
    });

    res.status(200).json({
      stats: {
        totalInterviews,
        completedInterviews: completedInterviews.length,
        averageScore: Math.round(averageScore),
        totalDuration,
        interviewsByMonth,
        interviewsByProfession: interviewsByRepo  // Mantener nombre para compatibilidad con frontend
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

/**
 * Obtiene estadísticas detalladas de una entrevista concreta.
 *
 * Incluye:
 * - title: título de la entrevista.
 * - repoUrl: URL del repositorio asociado.
 * - totalScore: puntuación global de la entrevista.
 * - statistics: objeto de estadísticas almacenadas en la entrevista.
 * - scoresByDifficulty: media de puntuaciones agrupadas por dificultad.
 * - questionStats: detalle por pregunta (texto, dificultad, respuestas con score/feedback/duration).
 * - duration: duración total de la entrevista.
 * - createdAt: fecha de creación.
 * - completedAt: fecha de finalización.
 *
 * Params:
 * - interviewId {string} ID de la entrevista.
 *
 * Requiere:
 * - req.userId coincidiendo con interview.userId.
 *
 * Respuesta:
 * - 200: { stats: { ... } }
 * - 403: Usuario no autorizado.
 * - 404: Entrevista no encontrada.
 * - 500: Error al obtener las estadísticas de la entrevista.
 *
 * @async
 * @param {import('express').Request} req - Petición HTTP.
 * @param {import('express').Response} res - Respuesta HTTP.
 * @returns {Promise<void>}
 */
exports.getInterviewStats = async (req, res) => {
  try {
    const { interviewId } = req.params;  // ✅ CORRECCIÓN: Destructuring correcto
    const interview = await Interview.findById(interviewId).populate({
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

    const responses = await Response.find({ interviewId });
    const scoresByDifficulty = {};  // ✅ Inicializar correctamente

    // ✅ CORRECCIÓN: Agregar paréntesis y llaves correctas en map
    const questionStats = interview.questions.map(question => ({
      question: question.questionText,
      difficulty: question.difficulty,
      responses: question.responses.map(resp => ({
        score: resp.score,
        feedback: resp.feedback,
        duration: resp.duration
      }))
    }));

    interview.questions.forEach(question => {
      const difficulty = question.difficulty || 'medium';
      if (!scoresByDifficulty[difficulty]) {
        scoresByDifficulty[difficulty] = { count: 0, totalScore: 0 };
      }
      scoresByDifficulty[difficulty].count++;

      const questionResponses = responses.filter(r => r.questionId.toString() === question.id.toString());
      const avgScore = questionResponses.length > 0
          ? questionResponses.reduce((sum, r) => sum + r.score, 0) / questionResponses.length
          : 0;
      scoresByDifficulty[difficulty].totalScore += avgScore;
    });

    res.status(200).json({
      stats: {
        title: interview.title,
        repoUrl: interview.repoUrl || interview.repositoryUrl,
        totalScore: interview.totalScore,
        statistics: interview.statistics,
        scoresByDifficulty,
        questionStats,
        duration: interview.duration,
        createdAt: interview.createdAt,
        completedAt: interview.completedAt
      }
    });

  } catch (error) {
    console.error('Get interview stats error:', error);
    res.status(500).json({ message: 'Error fetching interview statistics', error: error.message });
  }
};

/**
 * Obtiene las tendencias de rendimiento del usuario en sus entrevistas completadas.
 *
 * Devuelve una lista ordenada cronológicamente con:
 * - date: fecha de creación de la entrevista.
 * - score: totalScore de la entrevista.
 * - repoUrl: URL del repositorio asociado.
 * - duration: duración de la entrevista.
 *
 * Requiere:
 * - req.userId establecido por el middleware de autenticación.
 *
 * Respuesta:
 * - 200: Array<{ date: Date, score: number, repoUrl: string, duration: number }>
 * - 500: Error al obtener las tendencias.
 *
 * @async
 * @param {import('express').Request} req - Petición HTTP.
 * @param {import('express').Response} res - Respuesta HTTP.
 * @returns {Promise<void>}
 */
exports.getPerformanceTrends = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId, status: 'completed' })
        .sort({ createdAt: 1 });

    const trends = [];
    interviews.forEach(interview => {
      trends.push({
        date: interview.createdAt,
        score: interview.totalScore,
        repoUrl: interview.repoUrl || interview.repositoryUrl,
        duration: interview.duration
      });
    });


    res.status(200).json(trends);

  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({ message: 'Error fetching trends', error: error.message });
  }
};
