// File: backend/controllers/GitinestController.js
const fetch = global.fetch || require('node-fetch');

function parseGitHubUrl(repoUrl) {
    // acepta urls como https://github.com/owner/repo or git@github.com:owner/repo.git
    const m = repoUrl.match(/github\.com[/:]([^\/]+)\/([^\/]+)(?:\.git)?/);
    if (!m) return null;
    return { owner: m[1], repo: m[2].replace(/\/$/, '') };
}

async function fetchReadme(owner, repo) {
    const branches = ['main', 'master'];
    for (const b of branches) {
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${b}/README.md`;
        try {
            const res = await fetch(rawUrl);
            if (res.ok) {
                const text = await res.text();
                if (text && text.trim().length > 0) return text;
            }
        } catch (e) {
            // ignore and try next
        }
    }
    return null;
}

exports.generateTextFromRepo = async (req, res) => {
    const { repoUrl, questionCount = 5 } = req.body || {};
    if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required' });

    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) return res.status(400).json({ error: 'Invalid GitHub repo URL' });

    const readme = await fetchReadme(parsed.owner, parsed.repo);
    const baseText = readme ? readme.slice(0, 8000) : `No README found for ${parsed.owner}/${parsed.repo}`;

    // Heurística simple para generar preguntas: dividir por encabezados y párrafos
    const paragraphs = baseText
        .split(/\r?\n\r?\n/)
        .map(p => p.replace(/\r?\n/g, ' ').trim())
        .filter(Boolean);

    const questions = [];
    for (let i = 0; i < questionCount; i++) {
        const source = paragraphs[i] || paragraphs[i % paragraphs.length] || baseText;
        const qText = `Basada en el repositorio ${parsed.owner}/${parsed.repo}: resuma o formule una pregunta sobre: "${source.slice(0, 200)}"`;
        questions.push(qText);
    }

    // Devuelve tanto el texto base como el array de preguntas para que InterviewController los consuma
    return res.json({
        repo: `${parsed.owner}/${parsed.repo}`,
        generatedText: baseText,
        questions
    });
};

// File: backend/controllers/InterviewController.js
const Question = require('../models/Question');

// Mantener resto del controlador igual; añadimos la nueva función:
exports.createQuestionsFromGitinest = async (req, res) => {
    const { interviewId, questions } = req.body || {};
    if (!interviewId) return res.status(400).json({ error: 'interviewId is required' });
    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'questions must be a non-empty array of strings' });
    }

    try {
        const docs = questions.map((text, idx) => ({
            interviewId,
            questionText: String(text).trim(),
            order: idx + 1,
            difficulty: 'medium',
            timeLimit: 300
        }));

        const created = await Question.insertMany(docs);
        return res.status(201).json({ created });
    } catch (err) {
        console.error('createQuestionsFromGitinest error', err);
        return res.status(500).json({ error: 'Failed to create questions' });
    }
};

// File: backend/routes/gitinest.js
const express = require('express');
const router = express.Router();
const GitinestController = require('../controllers/GitinestController');

router.post('/', GitinestController.generateTextFromRepo);

module.exports = router;

// File: backend/routes/interview.js (fragmento - añadir o reemplazar la ruta POST /generate-questions)
const express = require('express');
const router = express.Router();
const InterviewController = require('../controllers/InterviewController');

// ... otras rutas ...

// Reemplazar o añadir esta ruta para que use las preguntas enviadas por Gitinest
router.post('/generate-questions', InterviewController.createQuestionsFromGitinest);

module.exports = router;