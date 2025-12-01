// File: backend/controllers/GitinestController.js
const fetch = global.fetch || require('node-fetch');
const { GoogleGenAI } = require("@google/genai");

const API_KEY = process.env.GEMINI_API_KEY;
let ai = null;

if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    console.warn("⚠️  GEMINI_API_KEY not set in GitinestController. AI features will be disabled.");
}

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
                        console.log(`✅ README encontrado: ${branch}/${readmeFile}`);
                        return text;
                    }
                }
            } catch (e) {
                // ignore and try next
            }
        }
    }

    console.log(`⚠️ No se encontró README para ${owner}/${repo}`);
    return null;
}

// Nueva función para obtener información del repositorio desde GitHub API
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
            console.log(`✅ Información del repositorio obtenida: ${data.name}`);
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
        console.error('❌ Error obteniendo info del repo:', e.message);
    }
    return null;
}

// Función principal para generar texto y preguntas desde repo usando IA
async function generateTextAndQuestions(repoUrl, questionCount = 5, difficulty = 'mid', language = 'en') {
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) throw new Error('Invalid GitHub repo URL');

    const readme = await fetchReadme(parsed.owner, parsed.repo);
    let baseText = '';
    let repoInfo = null;

    if (readme && readme.trim().length > 0) {
        baseText = readme.slice(0, 8000);
        console.log(`📚 README obtenido para ${parsed.owner}/${parsed.repo}, longitud: ${baseText.length} caracteres`);
    } else {
        // Si no hay README, obtener información del repositorio
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

            console.log(`📚 Usando información de GitHub API para ${parsed.owner}/${parsed.repo}`);
        } else {
            console.log(`❌ No se pudo obtener información del repositorio ${parsed.owner}/${parsed.repo}`);
            throw new Error(`Could not fetch information for repository ${parsed.owner}/${parsed.repo}. The repository may be private or does not exist.`);
        }
    }

    // Si no hay IA configurada, lanzar error
    if (!ai) {
        console.warn('⚠️  Gemini no configurado');
        throw new Error('AI service not available. Please configure GEMINI_API_KEY.');
    }

    // ✅ USAR GEMINI PARA GENERAR PREGUNTAS TÉCNICAS REALES
    try {
        console.log(`🤖 Generando ${questionCount} preguntas con Gemini para ${parsed.owner}/${parsed.repo}...`);

        const languageText = language === 'es' ? 'español' : language === 'fr' ? 'francés' : language === 'de' ? 'alemán' : 'inglés';
        const difficultyText = difficulty === 'junior' ? 'junior (fácil)' : difficulty === 'senior' ? 'senior (difícil)' : 'mid-level (medio a difícil)';

        const prompt = `Eres un entrevistador técnico experto. Analiza la siguiente información sobre un repositorio de GitHub y genera exactamente ${questionCount} preguntas técnicas de entrevista en ${languageText}.

INFORMACIÓN DEL REPOSITORIO: ${parsed.owner}/${parsed.repo}

${baseText}

INSTRUCCIONES:
1. Genera preguntas técnicas ESPECÍFICAS basadas en las tecnologías, frameworks y conceptos mencionados
2. Las preguntas deben evaluar conocimientos prácticos y teóricos
3. Nivel de dificultad objetivo: ${difficultyText}
4. Varía la dificultad de las preguntas (algunas easy, medium, hard)
5. Las preguntas deben ser respondibles por alguien familiarizado con el proyecto
6. Incluye preguntas sobre:
   - Arquitectura y diseño
   - Tecnologías y frameworks específicos mencionados
   - Mejores prácticas relacionadas
   - Problemas y soluciones comunes
   - Optimización y escalabilidad

EJEMPLOS DE BUENAS PREGUNTAS TÉCNICAS:
- "¿Qué es React y cómo funciona el Virtual DOM?"
- "Explica la arquitectura de microservicios y sus ventajas"
- "¿Cómo implementarías autenticación JWT en una API REST?"
- "¿Cuáles son las ventajas de usar TypeScript sobre JavaScript?"
- "¿Cómo optimizarías el rendimiento de una aplicación web?"

NO generes preguntas vagas como:
- "Explica el proyecto"
- "¿Para qué sirve esto?"
- "Describe el repositorio"

Sé ESPECÍFICO, TÉCNICO y RELEVANTE al contenido proporcionado.

IDIOMA DE LAS PREGUNTAS: ${languageText}
FORMATO DE SALIDA: JSON con array de objetos {question: string, difficulty: string}`;

        console.log('📤 Llamando a Gemini API...');

        // Usar gemini-1.5-flash que tiene mejor cuota gratuita
        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: 'object',
                    properties: {
                        questions: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    question: { type: 'string' },
                                    difficulty: { type: 'string' }
                                },
                                required: ['question', 'difficulty']
                            }
                        }
                    },
                    required: ['questions']
                }
            }
        });

        const response = await result.response;
        const text = response.text();
        console.log('📥 Respuesta de Gemini recibida, longitud:', text.length);

        const parsedResult = JSON.parse(text);
        const questions = parsedResult.questions || [];

        console.log(`✅ Gemini generó ${questions.length} preguntas exitosamente`);

        if (questions.length > 0) {
            console.log('📝 Primera pregunta generada:', questions[0]);
        }

        if (questions.length === 0) {
            throw new Error('Gemini no generó preguntas');
        }

        return {
            repo: `${parsed.owner}/${parsed.repo}`,
            generatedText: baseText,
            questions: questions.slice(0, questionCount)
        };

    } catch (aiError) {
        console.error('❌ Error al generar preguntas con Gemini:', aiError.message);
        console.error('❌ Error completo:', aiError);

        // No usar fallback, lanzar error para que el usuario sepa que algo falló
        throw new Error(`Failed to generate questions with AI: ${aiError.message}`);
    }
}

// Exportar funciones
exports.parseGitHubUrl = parseGitHubUrl;
exports.fetchReadme = fetchReadme;
exports.generateTextAndQuestions = generateTextAndQuestions;

// Endpoint Express para API
exports.generateTextFromRepo = async (req, res) => {
    const { repoUrl, questionCount = 5, difficulty = 'mid', language = 'en' } = req.body || {};
    if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required' });
    try {
        console.log(`📝 Endpoint generateTextFromRepo llamado con: repoUrl=${repoUrl}, questionCount=${questionCount}, difficulty=${difficulty}, language=${language}`);
        const result = await generateTextAndQuestions(repoUrl, questionCount, difficulty, language);
        return res.json(result);
    } catch (err) {
        console.error('❌ Error en generateTextFromRepo:', err.message);
        return res.status(400).json({ error: err.message });
    }
};
