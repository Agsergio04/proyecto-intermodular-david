import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { interviewService } from '../api';
import { FiPlus, FiSearch, FiTrash2, FiEye } from 'react-icons/fi';

const Interviews = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    profession: '',
    type: 'ai_generated',
    difficulty: 'mid',
    language: 'en'
  });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await interviewService.getInterviews();
      setInterviews(response.data.interviews);
    } catch (error) {
      toast.error(t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInterview = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.profession.trim()) {
      toast.warning('Please fill in all required fields');
      return;
    }
    
    setFormLoading(true);
    
    try {
      let questions = [];
      
      if (formData.type === 'ai_generated') {
        toast.info('Generating questions with AI...');
        
        // ✅ LLAMAR AL BACKEND
        const questionsResponse = await interviewService.generateQuestions({
          profession: formData.profession,
          difficulty: formData.difficulty,
          language: formData.language,
          count: 5
        });
        
        questions = questionsResponse.data.questions;
        
        if (!questions || questions.length === 0) {
          toast.error('Failed to generate questions. Please try again.');
          setFormLoading(false);
          return;
        }
        
        toast.success(`${questions.length} questions generated!`);
      }

      const response = await interviewService.createInterview({
        title: formData.title,
        profession: formData.profession,
        type: formData.type,
        difficulty: formData.difficulty,
        language: formData.language,
        questions: questions
      });

      toast.success('Interview created successfully!');
      setInterviews([response.data.interview, ...interviews]);
      setShowCreateForm(false);
      setFormData({
        title: '',
        profession: '',
        type: 'ai_generated',
        difficulty: 'mid',
        language: 'en'
      });

      setTimeout(() => {
        navigate(`/interview/${response.data.interview.id || response.data.interview._id}`);
      }, 500);
    } catch (error) {
      console.error('Error creating interview:', error);
      const errorMessage = error.response?.data?.message || 'Error creating interview';
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteInterview = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await interviewService.deleteInterview(id);
        setInterviews(interviews.filter(i => i._id !== id));
        toast.success('Interview deleted');
      } catch (error) {
        toast.error(t('errors.serverError'));
      }
    }
  };

  const filteredInterviews = interviews.filter(i =>
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.profession.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {t('interview.myInterviews')}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              ← {t('dashboard.title')}
            </button>
          </div>
        </div>


        {showCreateForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              {t('interview.newInterview')}
            </h2>
            <form onSubmit={handleCreateInterview} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Interview Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2"
                required
                disabled={formLoading}
              />
              <input
                type="text"
                placeholder="Profession"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2"
                required
                disabled={formLoading}
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2"
                disabled={formLoading}
              >
                <option value="ai_generated">AI Generated</option>
                <option value="custom">Custom</option>
              </select>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2"
                disabled={formLoading}
              >
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
              </select>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2"
                disabled={formLoading}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Interview'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  disabled={formLoading}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-800 dark:text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {t('interview.noInterviews')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviews.map(interview => (
              <div
                key={interview._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {interview.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {interview.profession} • {interview.difficulty}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    interview.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {interview.status}
                  </span>
                  <span className="text-sm text-gray-500">{interview.totalScore}%</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/interview/${interview._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition"
                  >
                    <FiEye /> View
                  </button>
                  <button
                    onClick={() => handleDeleteInterview(interview._id)}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Interviews;
