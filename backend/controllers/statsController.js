/**
 * Interview statistics controller.
 *
 * Provides endpoints to obtain user-level aggregate statistics, detailed
 * statistics for a specific interview, and performance trends over time.
 *
 * @module controllers/statsController
 */

const Interview = require('../models/Interview');
const Response = require('../models/Response');

/**
 * Get global statistics for the authenticated user's interviews.
 *
 * Calculates:
 * - totalInterviews: total number of interviews.
 * - completedInterviews: number of interviews completed.
 * - averageScore: average totalScore of completed interviews.
 * - totalDuration: sum of durations of all interviews.
 * - interviewsByMonth: count of interviews per month (key: "MMM YYYY").
 * - interviewsByProfession: count of interviews grouped by associated repository.
 *
 * Requires:
 * - `req.userId` set by authentication middleware.
 *
 * Responses:
 * - 200: { stats: { totalInterviews, completedInterviews, averageScore, totalDuration, interviewsByMonth, interviewsByProfession } }
 * - 500: Error fetching statistics.
 *
 * @async
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 * @access Private
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
      const repoName = interview.repoUrl || interview.repositoryUrl || 'No repository';
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
 * Get detailed statistics for a specific interview.
 *
 * Includes:
 * - title: interview title.
 * - repoUrl: associated repository URL.
 * - totalScore: overall interview score.
 * - statistics: stored interview statistics object.
 * - scoresByDifficulty: average scores grouped by difficulty.
 * - questionStats: per-question detail (text, difficulty, responses with score/feedback/duration).
 * - duration: total interview duration.
 * - createdAt: creation date.
 * - completedAt: completion date.
 *
 * Params:
 * - interviewId {string} Interview ID.
 *
 * Requires:
 * - `req.userId` matching interview.userId.
 *
 * Responses:
 * - 200: { stats: { ... } }
 * - 403: Unauthorized.
 * - 404: Interview not found.
 * - 500: Error fetching interview statistics.
 *
 * @async
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 * @access Private
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
 * Get performance trends for the user across completed interviews.
 *
 * Returns a chronologically ordered list with:
 * - date: interview creation date.
 * - score: interview totalScore.
 * - repoUrl: associated repository URL.
 * - duration: interview duration.
 *
 * Requires:
 * - `req.userId` set by authentication middleware.
 *
 * Responses:
 * - 200: Array<{ date: Date, score: number, repoUrl: string, duration: number }>
 * - 500: Error fetching trends.
 *
 * @async
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 * @access Private
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
