const Interview = require('../models/Interview');
const Question = require('../models/Question');
const Response = require('../models/Response');
const User = require('../models/User');
const { GoogleGenAI } = require("@google/genai");

const API_KEY = process.env.GEMINI_API_KEY;
let ai = null;

if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    console.warn("⚠️  GEMINI_API_KEY not set. AI features will be disabled.");
}

// ✅ Normalizar dificultad de Gemini a nuestro formato
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

// Generate AI questions based on repository
exports.generateAIQuestions = async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        message: 'AI service not available. GEMINI_API_KEY not configured.'
      });
    }

    // Log del body recibido para depuración
    console.log('🔎 Body recibido en generateAIQuestions:', JSON.stringify(req.body));

    const { repoUrl, difficulty, language, count } = req.body;

    if (!repoUrl) {
      console.log('❌ Error: repoUrl no recibido o vacío');
      return res.status(400).json({ message: 'Repository URL is required', body: req.body });
    }

    const difficultyLevel = difficulty || 'mid';
    const lang = language || 'en';
    const questionCount = count || 5;
    const languageText = lang === 'es' ? 'español' : lang === 'fr' ? 'francés' : lang === 'de' ? 'alemán' : 'inglés';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate exactly ${questionCount} technical interview questions for a repository at ${repoUrl} for a ${difficultyLevel} level position in ${languageText} language. The questions should cover a range of topics relevant to the code and technologies found in the repository.`,
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

      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText);
      const questions = result.questions || [];

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

// Create new interview
exports.createInterview = async (req, res) => {
  try {
    const { title, repoUrl, type, difficulty, language, questions } = req.body;

    console.log('📝 Creating interview with:', { title, repoUrl, difficulty, language, questions });

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const interview = new Interview({
      userId: req.userId,
      title,
      repoUrl,
      type,
      difficulty: difficulty || 'mid',
      language: language || user.language || 'en',
      repositoryUrl: repoUrl || null
    });

    await interview.save();
    console.log('✅ Interview saved:', interview._id);

    let createdQuestions = [];

    // PRIORIDAD: Si hay preguntas en el body, usarlas siempre
    if (questions && questions.length > 0) {
      console.log('📝 Creating questions...');

      for (let i = 0; i < questions.length; i++) {
        try {
          const questionText = questions[i].question || questions[i].questionText;
          const normalizedDifficulty = normalizeDifficulty(questions[i].difficulty || 'medium');
          
          console.log(`Creating question ${i + 1}:`, questionText, `| Difficulty: ${questions[i].difficulty} -> ${normalizedDifficulty}`);
          
          const question = new Question({
            interviewId: interview._id,
            questionText: questionText,
            order: i + 1,
            difficulty: normalizedDifficulty // USA LA DIFICULTAD NORMALIZADA
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

    // Poblar las preguntas antes de enviar la respuesta
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
        questions: interview.questions // Ahora incluye los objetos completos de las preguntas
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

// Get user interviews
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

// Get single interview
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
      console.log('📝 All questions:', interview.questions.map((q, i) => ({
        index: i,
        id: q._id,
        text: q.questionText,
        difficulty: q.difficulty
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

// Update interview status
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

// Delete interview
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

    // Delete questions and responses
    await Question.deleteMany({ interviewId });
    await Response.deleteMany({ interviewId });
    await Interview.findByIdAndDelete(interviewId);

    // Remove from user's interviews
    await User.findByIdAndUpdate(req.userId, {
      $pull: { interviews: interviewId }
    });

    res.status(200).json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ message: 'Error deleting interview', error: error.message });
  }
};

// Update interview repository URL
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
