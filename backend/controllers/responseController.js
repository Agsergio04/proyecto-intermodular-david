const Response = require('../models/Response');
const Question = require('../models/Question');
const Interview = require('../models/Interview');
const { GoogleGenAI, Type } = require("@google/genai");

const API_KEY = process.env.GEMINI_API_KEY;
let ai = null;

if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
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
    if (responseText && ai) {
      try {
        const aiResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `As an expert interviewer, evaluate this interview response and provide feedback.

Question: "${question.questionText}"
Response: "${responseText}"

Provide evaluation in JSON format with:
- score (0-100): Overall score for the response
- strengths (array of strings): Key strengths of the response
- improvements (array of strings): Areas for improvement
- keywords (array of strings): Important keywords mentioned
- feedback (string): Detailed feedback about the response`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                strengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                improvements: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                keywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                feedback: { type: Type.STRING }
              },
              required: ['score', 'strengths', 'improvements', 'keywords', 'feedback']
            }
          }
        });

        const analysis = JSON.parse(aiResponse.text);
        response.score = analysis.score || 0;
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
