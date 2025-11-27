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

// Función principal para generar texto y preguntas desde repo
async function generateTextAndQuestions(repoUrl, questionCount = 5) {
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) throw new Error('Invalid GitHub repo URL');
    const readme = await fetchReadme(parsed.owner, parsed.repo);
    const baseText = readme ? readme.slice(0, 8000) : `No README found for ${parsed.owner}/${parsed.repo}`;
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
    return {
        repo: `${parsed.owner}/${parsed.repo}`,
        generatedText: baseText,
        questions
    };
}

// Exportar la función para uso interno
exports.generateTextAndQuestions = generateTextAndQuestions;

// Endpoint Express para API
exports.generateTextFromRepo = async (req, res) => {
    const { repoUrl, questionCount = 5 } = req.body || {};
    if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required' });
    try {
        const result = await generateTextAndQuestions(repoUrl, questionCount);
        return res.json(result);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
