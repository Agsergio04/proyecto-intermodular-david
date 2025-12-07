const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
let ai = null;

if (API_KEY) {
    ai = new GoogleGenerativeAI(API_KEY);
} else {
    console.warn("⚠️  GEMINI_API_KEY not set. AI features will be disabled.");
}

// Convert speech to text with Gemini
router.post('/transcribe', authMiddleware, async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        message: 'AI service not available. GEMINI_API_KEY not configured.'
      });
    }

    const { audioBase64, language } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ message: 'Audio data is required' });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            parts: [
              {
                text: `Transcribe this audio in ${language || 'en'} language. Return ONLY the transcription text, nothing else.`,
                inline_data: {
                  mime_type: 'audio/webm',
                  data: audioBase64
                }
              }
            ]
          }
        ]
      });

      const transcript = response.text.trim();
      res.status(200).json({
        text: transcript
      });
    } catch (error) {
      console.error('Transcription error:', error);
      res.status(500).json({ message: 'Error transcribing audio', error: error.message });
    }
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ message: 'Error transcribing audio', error: error.message });
  }
});

// Get next question from AI with Gemini
router.post('/next-question', authMiddleware, async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        message: 'AI service not available. GEMINI_API_KEY not configured.'
      });
    }

    const { interviewHistory, profession, language, difficulty } = req.body;

    try {
      const formattedHistory = interviewHistory
        .map(qa => `Q: ${qa.question}\nA: ${qa.answer}`)
        .join('\n\n');

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert ${profession} interviewer. Based on the interview history, generate the next question for a ${difficulty} level interview in ${language} language.
    
Previous Q&A:
${formattedHistory}
    
Generate ONLY the next interview question in valid JSON format with fields: question, difficulty, timeLimit (in seconds).
Do not include any other text or explanation.`,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const questionData = JSON.parse(response.text);
      res.status(200).json({
        question: questionData.question,
        difficulty: questionData.difficulty,
        timeLimit: questionData.timeLimit
      });
    } catch (error) {
      console.error('Next question error:', error);
      res.status(500).json({ message: 'Error generating next question', error: error.message });
    }
  } catch (error) {
    console.error('Next question error:', error);
    res.status(500).json({ message: 'Error generating next question', error: error.message });
  }
});

// Generate AI feedback for response with Gemini
router.post('/evaluate-response', authMiddleware, async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        message: 'AI service not available. GEMINI_API_KEY not configured.'
      });
    }

    const { question, response, profession, language } = req.body;

    try {
      const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `As an expert ${profession} recruiter, evaluate this candidate response:

Question: "${question}"
Response: "${response}"

Provide evaluation in JSON format with:
- score (0-100)
- strengths (array of strings)
- improvements (array of strings)
- keywords (array of keywords mentioned)
- feedback (detailed feedback string in ${language} language)

Include only valid JSON in your response.`,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const evaluation = JSON.parse(aiResponse.text);
      res.status(200).json({
        score: evaluation.score,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        keywords: evaluation.keywords,
        feedback: evaluation.feedback
      });
    } catch (error) {
      console.error('Evaluate response error:', error);
      res.status(500).json({ message: 'Error evaluating response', error: error.message });
    }
  } catch (error) {
    console.error('Evaluate response error:', error);
    res.status(500).json({ message: 'Error evaluating response', error: error.message });
  }
});

module.exports = router;
