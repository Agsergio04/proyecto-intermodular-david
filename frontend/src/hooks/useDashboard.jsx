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

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await statsService.getUserStats();
            setStats(response.data.stats);

            const trendsResponse = await statsService.getPerformanceTrends();
            setTrends(trendsResponse.data.trends);

            const user = JSON.parse(localStorage.getItem('user'));
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

            if (formData.type === 'ai_generated') {
                toast.info('Generando preguntas con IA...');

                try {
                    const requestBody = {
                        repoUrl: formData.repoUrl.trim(),
                        difficulty: formData.difficulty,
                        language: formData.language,
                        count: 5
                    };
                    console.log('📤 Body enviado a generateQuestions:', requestBody);
                    console.log('📤 repoUrl específicamente:', requestBody.repoUrl);

                    const questionsResponse = await interviewService.generateQuestions(requestBody);

                    questions = questionsResponse.data?.questions || [];

                    if (!questions || questions.length === 0) {
                        toast.error('No se pudieron generar preguntas. Inténtalo de nuevo.');
                        setFormLoading(false);
                        return;
                    }

                    toast.success(`${questions.length} preguntas generadas!`);
                } catch (genError) {
                    console.error('❌ Error generando preguntas:', genError);
                    toast.error('Error generando preguntas: ' + genError.message);
                    setFormLoading(false);
                    return;
                }
            } else {
                questions = [
                    { question: "Pregunta 1", difficulty: formData.difficulty },
                    { question: "Pregunta 2", difficulty: formData.difficulty },
                    { question: "Pregunta 3", difficulty: formData.difficulty },
                    { question: "Pregunta 4", difficulty: formData.difficulty },
                    { question: "Pregunta 5", difficulty: formData.difficulty }
                ];
            }

            const createResponse = await interviewService.createInterview({
                title: formData.title,
                repoUrl: formData.repoUrl,
                type: formData.type,
                difficulty: formData.difficulty,
                language: formData.language,
                questions: questions
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

    return {
        stats,
        trends,
        loading,
        isPremium,
        showCreateForm,
        formLoading,
        formData,
        downloadReport,
        handleCreateInterview,
        toggleCreateForm,
        updateFormData,
        navigateToInterviews
    };
};
