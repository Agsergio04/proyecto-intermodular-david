// File: backend/controllers/GitinestController.js
// ✅ VERSIÓN CORREGIDA - Usa gemini-2.5-flash (Modelo Actual)

const fetch = global.fetch || require('node-fetch');
const { GoogleGenAI } = require("@google/genai");

// ✅ VALIDACIÓN EXPLÍCITA DE API KEY
const API_KEY = process.env.GEMINI_API_KEY;

console.log('🔍 GitinestController initialization...');
if (!API_KEY || API_KEY.trim() === '') {
    console.error('❌ CRITICAL: GEMINI_API_KEY is not configured!');
    console.error('   📝 Please add GEMINI_API_KEY to your .env file');
} else {
    console.log('✅ GEMINI_API_KEY found (length:', API_KEY.length, ')');
}

// Solo crear genAI si existe clave válida
let genAI = null;
try {
    if (API_KEY && API_KEY.trim() !== '') {
        genAI = new GoogleGenAI({ apiKey: API_KEY });
        console.log('✅ GoogleGenAI (new SDK) initialized successfully');
    }
} catch (err) {
    console.error('❌ Error initializing GoogleGenAI:', err.message);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function parseGitHubUrl(repoUrl) {
    // acepta urls como https://github.com/owner/repo or git@github.com:owner/repo.git
    const m = repoUrl.match(/github\.com[/:]([^\/]+)\/([^\/]+)(?:\.git)?/);
    if (!m) return null;
    return { owner: m[1], repo: m[2].replace(/\/$/, '') };
}

async function fetchReadme(owner, repo) {
    // Intentar diferentes ramas y nombres de archivo
    const branches = ['main', 'master', 'develop'];
    const readmeVariants = ['README.md', 'readme.md', 'Readme.md', 'README.MD', 'README'];

    for (const branch of branches) {
        for (const readmeFile of readmeVariants) {
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${readmeFile}`;
            try {
                const res = await fetch(rawUrl);
                if (res.ok) {
                    const text = await res.text();
                    if (text && text.trim().length > 0) {
                        console.log(`✅ README found: ${branch}/${readmeFile}`);
                        return text;
                    }
                }
            } catch (e) {
                // ignore and try next
            }
        }
    }

    console.log(`⚠️ No README found for ${owner}/${repo}`);
    return null;
}

async function fetchRepoInfo(owner, repo) {
    try {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
        const res = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'GitInest-Interview-App'
            }
        });

        if (res.ok) {
            const data = await res.json();
            console.log(`✅ Repository info obtained: ${data.name}`);
            return {
                name: data.name,
                description: data.description || '',
                language: data.language || 'Unknown',
                topics: data.topics || [],
                homepage: data.homepage || '',
                stargazers_count: data.stargazers_count || 0,
                forks_count: data.forks_count || 0
            };
        }
    } catch (e) {
        console.error('❌ Error fetching repo info:', e.message);
    }

    return null;
}

// ============================================
// MAIN FUNCTION: Generate Questions with AI
// ============================================

async function generateTextAndQuestions(repoUrl, questionCount = 5, difficulty = 'mid', language = 'en') {
    try {
        // ✅ Validate input
        if (!repoUrl || typeof repoUrl !== 'string') {
            throw new Error('repoUrl must be a non-empty string');
        }

        console.log(`\n🚀 Starting question generation for: ${repoUrl}`);
        console.log(`   Params: count=${questionCount}, difficulty=${difficulty}, language=${language}`);

        // ✅ Parse GitHub URL
        const parsed = parseGitHubUrl(repoUrl);
        if (!parsed) {
            throw new Error(`Invalid GitHub URL format: ${repoUrl}`);
        }
        console.log(`📦 Repository: ${parsed.owner}/${parsed.repo}`);

        // ✅ Fetch README or repo info
        let baseText = '';
        let repoInfo = null;
        let isGeneric = false;

        const readme = await fetchReadme(parsed.owner, parsed.repo);

        if (readme && readme.trim().length > 0) {
            baseText = readme.slice(0, 8000);
            console.log(`📚 README obtained, length: ${baseText.length} chars`);
        } else {
            repoInfo = await fetchRepoInfo(parsed.owner, parsed.repo);
            if (repoInfo) {
                baseText = `Repository: ${repoInfo.name}
Description: ${repoInfo.description || 'No description available'}
Primary Language: ${repoInfo.language}
Topics: ${repoInfo.topics.join(', ') || 'None'}
Stars: ${repoInfo.stargazers_count}
Forks: ${repoInfo.forks_count}
Homepage: ${repoInfo.homepage || 'None'}
This is a ${repoInfo.language} project${repoInfo.topics.length > 0 ? ` focused on ${repoInfo.topics.join(', ')}` : ''}.`;
                console.log(`📚 Using GitHub API info, length: ${baseText.length} chars`);
            } else {
                // ✅ NUEVO: Si no se puede acceder al repositorio, usar información genérica
                console.log(`⚠️ Repository ${parsed.owner}/${parsed.repo} is private or inaccessible. Generating generic questions.`);
                isGeneric = true;
                baseText = `Repository: ${parsed.repo}
Owner: ${parsed.owner}
This is a software development project. Since the repository is private or inaccessible, we'll generate general technical interview questions suitable for software development roles.`;
            }
        }

        // ✅ Check Gemini configuration
        if (!genAI || !API_KEY) {
            console.error('❌ GEMINI_API_KEY not available');
            throw new Error(
                'AI service not available. GEMINI_API_KEY is not configured. ' +
                'Please add GEMINI_API_KEY to your .env file.'
            );
        }

        console.log(`\n🤖 Generating ${questionCount} questions with Gemini...`);

        // ✅ Prepare language text
        const languageText = language === 'es' ? 'español'
            : language === 'fr' ? 'francés'
                : language === 'de' ? 'alemán'
                    : 'inglés';

        const difficultyText = difficulty === 'junior' ? 'junior (easy)'
            : difficulty === 'senior' ? 'senior (hard)'
                : 'mid-level (medium)';

        // ✅ Build prompt
        const prompt = isGeneric
            ? `You are a senior technical interviewer. Generate ${questionCount} general technical interview questions in ${languageText} for a ${difficultyText} software developer position.

REQUIREMENTS:
- Cover different areas: algorithms, data structures, system design, best practices, testing, version control, databases
- Questions should be practical and realistic
- Difficulty level: ${difficultyText}
- Language: ${languageText}

OUTPUT FORMAT: JSON with array of objects {question: string, difficulty: string}`
            : `You are a senior technical interviewer with extensive experience. You have reviewed a GitHub repository and need to ask intelligent, technical questions that make sense.

REPOSITORY ANALYZED: ${parsed.owner}/${parsed.repo}

README/INFORMATION CONTENT:

${baseText}

YOUR TASK:

Generate exactly ${questionCount} technical questions in ${languageText} that demonstrate whether the candidate really understands:

1. The main functionality of the project
2. The technologies and frameworks it uses
3. Architecture and design decisions
4. Problems it solves and how it solves them
5. Specific technical aspects mentioned in the README

DIFFICULTY LEVEL: ${difficultyText}

QUESTION CHARACTERISTICS:

✅ Specific to the project (mention technologies, functionalities or concepts from README)
✅ With human sense (like a real interviewer would ask)
✅ Evaluate deep understanding, not just memorization
✅ Mix of: conceptual, practical, design and implementation questions
✅ Vary difficulty: some easy, medium, hard

OUTPUT FORMAT: JSON with array of objects {question: string, difficulty: string}`;

        console.log('📤 Calling Gemini API using gemini-2.5-flash...');

        // ✅ Call Gemini API usando el nuevo SDK @google/genai
        let result;
        try {
            result = await genAI.models.generateContent({
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
        } catch (geminiError) {
            console.error('❌ Gemini API call failed:', geminiError.message);
            throw new Error(`Gemini API error: ${geminiError.message}`);
        }

        // ✅ Validate response
        if (!result || !result.text) {
            throw new Error('Gemini returned empty response');
        }

        // ✅ Parse JSON
        const jsonText = result.text.trim();
        console.log('📥 Gemini response received, parsing...');
        console.log('📄 Raw JSON response:', jsonText.substring(0, 500));

        let parsedResult;
        try {
            const rawParsed = JSON.parse(jsonText);
            
            // ✅ ADAPTACIÓN: Si Gemini devuelve un array directamente, envolverlo en un objeto
            if (Array.isArray(rawParsed)) {
                console.log('⚠️ Gemini returned array instead of object, wrapping...');
                parsedResult = { questions: rawParsed };
            } else {
                parsedResult = rawParsed;
            }
            
            console.log('✅ Parsed result with', parsedResult.questions?.length || 0, 'questions');
        } catch (parseErr) {
            console.error('❌ JSON parse error. Raw response (first 300 chars):', jsonText.substring(0, 300));
            throw new Error(`Failed to parse Gemini response as JSON: ${parseErr.message}`);
        }

        // ✅ Extract and validate questions
        const questions = parsedResult.questions || [];

        if (!Array.isArray(questions)) {
            throw new Error('Questions field is not an array');
        }

        if (questions.length === 0) {
            throw new Error('Gemini did not generate any questions');
        }

        console.log(`✅ Generated ${questions.length} questions successfully`);
        if (questions.length > 0) {
            console.log('📝 First question:', questions[0].question?.substring(0, 80) + '...');
        }

        // ✅ Return result
        return {
            repo: `${parsed.owner}/${parsed.repo}`,
            repoUrl: repoUrl,
            generatedText: baseText,
            repoContext: {
                owner: parsed.owner,
                repo: parsed.repo,
                readmeContent: baseText,
                repoInfo: repoInfo,
                url: repoUrl
            },
            questions: questions.slice(0, questionCount)
        };

    } catch (error) {
        console.error('❌ generateTextAndQuestions error:', error.message);
        throw error;
    }
}

// ============================================
// EXPORTS
// ============================================

exports.parseGitHubUrl = parseGitHubUrl;
exports.fetchReadme = fetchReadme;
exports.generateTextAndQuestions = generateTextAndQuestions;

// Express endpoint
exports.generateTextFromRepo = async (req, res) => {
    const { repoUrl, questionCount = 5, difficulty = 'mid', language = 'en' } = req.body || {};

    if (!repoUrl) {
        return res.status(400).json({ error: 'repoUrl is required' });
    }

    try {
        console.log(`📝 generateTextFromRepo endpoint called with: repoUrl=${repoUrl}, questionCount=${questionCount}`);
        const result = await generateTextAndQuestions(repoUrl, questionCount, difficulty, language);
        return res.json(result);
    } catch (err) {
        console.error('❌ Error in generateTextFromRepo:', err.message);
        return res.status(400).json({ error: err.message });
    }
};
