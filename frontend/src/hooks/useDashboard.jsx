import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { statsService, interviewService } from '../api';

export const useDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        repoUrl: '',
        type: 'ai_generated',
        difficulty: 'mid',
        language: 'en'
    });

    // Estados para formulario manual
    const [manualFormData, setManualFormData] = useState({
        title: '',
        repoUrl: '',
        language: 'en',
        questions: []
    });

    const [newQuestion, setNewQuestion] = useState({
        questionText: ''
    });

    useEffect(() => {
        // Verificar autenticación
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Debes iniciar sesión para acceder al dashboard');
            navigate('/login');
            return;
        }
        fetchStats();
    }, [navigate]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await statsService.getUserStats();
            setStats(response.data.stats);

            const trendsResponse = await statsService.getPerformanceTrends();
            setTrends(trendsResponse.data.trends);

            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setIsPremium(user?.subscriptionStatus === 'premium');
        } catch (error) {
            console.error('Error fetching stats:', error);
            setStats({
                totalInterviews: 0,
                completedInterviews: 0,
                averageScore: 0,
                totalDuration: 0,
                interviewsByProfession: {}
            });
            setTrends([]);
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async () => {
        if (!isPremium) {
            toast.warning('dashboard.needPremium');
            return;
        }
        toast.info('Download feature coming soon');
    };

    const handleCreateInterview = async (e) => {
        e.preventDefault();

        console.log('🔍 FormData completo:', formData);
        console.log('🔍 repoUrl value:', formData.repoUrl);
        console.log('🔍 repoUrl length:', formData.repoUrl?.length);
        console.log('🔍 repoUrl trimmed:', formData.repoUrl?.trim());

        if (!formData.title.trim() || !formData.repoUrl.trim()) {
            toast.warning('Por favor, rellena el título y la URL del repositorio');
            return;
        }

        setFormLoading(true);

        try {
            let questions = [];
            let repoContext = null;

            // Determinar el número de preguntas según la dificultad
            const questionCount = formData.difficulty === 'junior' ? 5 : 
                                 formData.difficulty === 'mid' ? 10 : 20;

            if (formData.type === 'ai_generated') {
                toast.info(`Generando ${questionCount} preguntas con IA...`);

                try {
                    const requestBody = {
                        repoUrl: formData.repoUrl.trim(),
                        difficulty: formData.difficulty,
                        language: formData.language,
                        count: questionCount
                    };
                    console.log('📤 Body enviado a generateQuestions:', requestBody);
                    console.log('📤 repoUrl específicamente:', requestBody.repoUrl);
                    console.log('📤 Número de preguntas:', questionCount);

                    const questionsResponse = await interviewService.generateQuestions(requestBody);

                    questions = questionsResponse.data?.questions || [];
                    repoContext = questionsResponse.data?.repoContext || null;

                    console.log('📦 Contexto del repositorio recibido:', repoContext ? 'Sí' : 'No');

                    if (!questions || questions.length === 0) {
                        toast.error('No se pudieron generar preguntas. Inténtalo de nuevo.');
                        setFormLoading(false);
                        return;
                    }

                    toast.success(`${questions.length} preguntas generadas!`);
                } catch (genError) {
                    console.error('❌ Error generando preguntas:', genError);
                    console.error('❌ Error response:', genError.response?.data);
                    console.error('❌ Error status:', genError.response?.status);
                    console.error('❌ Error message:', genError.message);

                    const errorMsg = genError.response?.data?.error
                        || genError.response?.data?.message
                        || genError.message
                        || 'Error desconocido al generar preguntas';

                    toast.error(`Error generando preguntas: ${errorMsg}`);
                    setFormLoading(false);
                    return;
                }
            } else {
                questions = [
                    { questionText: "Pregunta 1", difficulty: formData.difficulty },
                    { questionText: "Pregunta 2", difficulty: formData.difficulty },
                    { questionText: "Pregunta 3", difficulty: formData.difficulty },
                    { questionText: "Pregunta 4", difficulty: formData.difficulty },
                    { questionText: "Pregunta 5", difficulty: formData.difficulty }
                ];
            }

            const createResponse = await interviewService.createInterview({
                title: formData.title,
                repoUrl: formData.repoUrl,
                type: formData.type,
                difficulty: formData.difficulty,
                language: formData.language,
                questions: questions,
                repoContext: repoContext // ✅ Incluir el contexto del repositorio
            });

            toast.success('Entrevista creada correctamente!');
            setShowCreateForm(false);
            setFormData({
                title: '',
                repoUrl: '',
                type: 'ai_generated',
                difficulty: 'mid',
                language: 'en'
            });

            await fetchStats();

            const interviewId = createResponse.data.interview.id || createResponse.data.interview._id;

            setTimeout(() => {
                navigate(`/interview/${interviewId}`);
            }, 500);

        } catch (error) {
            console.error('❌ Error creando entrevista:', error);

            // Verificar si el error es por falta de autenticación
            if (error.response?.status === 401 || error.response?.data?.message === 'No token provided') {
                toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }

            const errorMessage = error.message || error.response?.data?.message || 'Error creando entrevista';
            toast.error(errorMessage);
        } finally {
            setFormLoading(false);
        }
    };

    const toggleCreateForm = () => setShowCreateForm(!showCreateForm);

    const updateFormData = (field, value) => {
        console.log(`🔄 Actualizando campo: ${field} = ${value}`);
        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            console.log('🔄 FormData actualizado:', newData);
            return newData;
        });
    };

    const navigateToInterviews = () => navigate('/interviews');

    const handleAddQuestion = () => {
        if (!newQuestion.questionText.trim()) {
            toast.warning('Por favor, escribe una pregunta');
            return;
        }

        const questionToAdd = {
            questionText: newQuestion.questionText
        };
        
        console.log('➕ Añadiendo pregunta:', questionToAdd);

        setManualFormData(prev => {
            const updated = {
                ...prev,
                questions: [...prev.questions, questionToAdd]
            };
            console.log('📝 Estado actualizado:', updated.questions);
            return updated;
        });

        setNewQuestion({
            questionText: ''
        });
    };

    const handleRemoveQuestion = (index) => {
        setManualFormData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const updateManualFormData = (field, value) => {
        setManualFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateNewQuestion = (field, value) => {
        setNewQuestion(prev => ({ ...prev, [field]: value }));
    };

    const handleCreateManualInterview = async (e) => {
        e.preventDefault();

        if (!manualFormData.title.trim() || !manualFormData.repoUrl.trim()) {
            toast.warning('Por favor, rellena el título y la URL del repositorio');
            return;
        }

        if (manualFormData.questions.length === 0) {
            toast.warning('Añade al menos una pregunta');
            return;
        }

        setFormLoading(true);

        try {
            const response = await interviewService.createInterview({
                title: manualFormData.title,
                repoUrl: manualFormData.repoUrl,
                type: 'custom',
                language: manualFormData.language,
                questions: manualFormData.questions
            });

            toast.success('Entrevista creada correctamente!');
            setShowCreateForm(false);
            setManualFormData({
                title: '',
                repoUrl: '',
                language: 'en',
                questions: []
            });

            await fetchStats();

            const interviewId = response.data.interview.id || response.data.interview._id;
            setTimeout(() => {
                navigate(`/interview/${interviewId}`);
            }, 500);
        } catch (error) {
            console.error('Error creando entrevista:', error);
            const errorMessage = error.response?.data?.message || 'Error creando entrevista';
            toast.error(errorMessage);
        } finally {
            setFormLoading(false);
        }
    };

    return {
        stats,
        trends,
        loading,
        isPremium,
        showCreateForm,
        formLoading,
        formData,
        manualFormData,
        newQuestion,
        downloadReport,
        handleCreateInterview,
        handleCreateManualInterview,
        handleAddQuestion,
        handleRemoveQuestion,
        toggleCreateForm,
        updateFormData,
        updateManualFormData,
        updateNewQuestion,
        navigateToInterviews
    };
};
