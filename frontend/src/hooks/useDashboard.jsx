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
        repository: '',
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

        if (!formData.title.trim() || !formData.repository.trim()) {
            toast.warning('Please fill in all required fields');
            return;
        }

        setFormLoading(true);

        try {
            let questions = [];

            if (formData.type === 'ai_generated') {
                toast.info('Generating questions with AI...');

                try {
                    const questionsResponse = await interviewService.generateQuestions({
                        repository: formData.repository,
                        difficulty: formData.difficulty,
                        language: formData.language,
                        count: 5
                    });

                    questions = questionsResponse.data?.questions || [];

                    if (!questions || questions.length === 0) {
                        toast.error('Failed to generate questions. Please try again.');
                        setFormLoading(false);
                        return;
                    }

                    toast.success(`${questions.length} questions generated!`);
                } catch (genError) {
                    console.error('❌ Error generating questions:', genError);
                    toast.error('Error generating questions: ' + genError.message);
                    setFormLoading(false);
                    return;
                }
            } else {
                questions = [
                    { question: "Question 1", difficulty: formData.difficulty },
                    { question: "Question 2", difficulty: formData.difficulty },
                    { question: "Question 3", difficulty: formData.difficulty },
                    { question: "Question 4", difficulty: formData.difficulty },
                    { question: "Question 5", difficulty: formData.difficulty }
                ];
            }

            const createResponse = await interviewService.createInterview({
                title: formData.title,
                repository: formData.repository,
                type: formData.type,
                difficulty: formData.difficulty,
                language: formData.language,
                questions: questions
            });

            toast.success('Interview created successfully!');
            setShowCreateForm(false);
            setFormData({
                title: '',
                repository: '',
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
            console.error('❌ Error creating interview:', error);
            const errorMessage = error.message || error.response?.data?.message || 'Error creating interview';
            toast.error(errorMessage);
        } finally {
            setFormLoading(false);
        }
    };

    const toggleCreateForm = () => setShowCreateForm(!showCreateForm);

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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