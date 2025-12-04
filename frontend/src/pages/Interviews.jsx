import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { interviewService } from '../api';
import { FiPlus, FiSearch, FiTrash2, FiEye, FiX } from 'react-icons/fi';
import { useThemeStore } from '../store';
import '../assets/styles/Interviews.css';


const Interviews = () => {
  const { t } = useTranslation();
  const { isDark } = useThemeStore();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    repoUrl: '',
    type: 'ai_generated',
    difficulty: 'mid',
    language: 'en'
  });


  const fetchInterviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await interviewService.getInterviews();
      setInterviews(response.data.interviews);
    } catch (error) {
      toast.error(t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  }, [t]);


  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);


  const handleCreateInterview = async (e) => {
    e.preventDefault();
   
    if (!formData.title.trim() || !formData.repoUrl.trim()) {
      toast.warning(t('errors.fillFields') || 'Por favor, rellena el título y la URL del repositorio');
      return;
    }
   
    setFormLoading(true);
   
    try {
      let questions = [];
     
      if (formData.type === 'ai_generated') {
        toast.info(t('interview.generatingQuestions') || 'Generating questions with AI...');
       
        const questionsResponse = await interviewService.generateQuestions({
          repoUrl: formData.repoUrl,
          difficulty: formData.difficulty,
          language: formData.language,
          count: 5
        });
       
        questions = questionsResponse.data.questions;
       
        if (!questions || questions.length === 0) {
          toast.error(t('errors.questionsGeneration') || 'Failed to generate questions. Please try again.');
          setFormLoading(false);
          return;
        }
       
        toast.success(`${questions.length} ${t('interview.questionsGenerated') || 'questions generated'}!`);
      }


      const response = await interviewService.createInterview({
        title: formData.title,
        repoUrl: formData.repoUrl,
        type: formData.type,
        difficulty: formData.difficulty,
        language: formData.language,
        questions
      });


      toast.success(t('interview.created') || 'Interview created successfully!');
      setInterviews([response.data.interview, ...interviews]);
      setShowCreateForm(false);
      setFormData({
        title: '',
        repoUrl: '',
        type: 'ai_generated',
        difficulty: 'mid',
        language: 'en'
      });


      setTimeout(() => {
        navigate(`/interview/${response.data.interview.id || response.data.interview._id}`);
      }, 500);
    } catch (error) {
      console.error('Error creating interview:', error);
      const errorMessage = error.response?.data?.message || t('errors.creatingInterview') || 'Error creating interview';
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };


  const handleDeleteInterview = async (id) => {
    if (window.confirm(t('common.confirmDelete') || 'Are you sure?')) {
      try {
        await interviewService.deleteInterview(id);
        setInterviews(interviews.filter(i => i._id !== id));
        toast.success(t('interview.deleted') || 'Interview deleted');
      } catch (error) {
        toast.error(t('errors.serverError'));
      }
    }
  };


  const filteredInterviews = interviews.filter(i =>
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.repoUrl && i.repoUrl.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (i.repositoryUrl && i.repositoryUrl.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  return (
    <div className={`interviews ${isDark ? 'interviews--dark' : ''}`}>
      <div className="interviews__container">
        <div className="interviews__header">
          <h1 className={`interviews__title ${isDark ? 'interviews__title--dark' : ''}`}>
            {t('interview.myInterviews')}
          </h1>
          <div className="interviews__actions">
            <button
              onClick={() => navigate('/dashboard')}
              className="interviews__button interviews__button--dashboard"
            >
              ← {t('dashboard.title')}
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              disabled={showCreateForm}
              className="interviews__button interviews__button--new"
            >
              <FiPlus /> {t('interview.newInterview')}
            </button>
          </div>
        </div>


        {showCreateForm && (
          <div className={`interviews__form-overlay ${isDark ? 'interviews__form-overlay--dark' : ''}`} onClick={() => setShowCreateForm(false)}>
            <div className={`interviews__modal ${isDark ? 'interviews__modal--dark' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className="interviews__modal-header">
                <h2 className={`interviews__modal-title ${isDark ? 'interviews__modal-title--dark' : ''}`}>
                  {t('interview.newInterview')}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  disabled={formLoading}
                  className={`interviews__modal-close ${isDark ? 'interviews__modal-close--dark' : ''}`}
                >
                  <FiX />
                </button>
              </div>
             
              <form onSubmit={handleCreateInterview} className="interviews__modal-form">
                <div className="interviews__modal-grid">
                  {/* Título */}
                  <div className="interviews__modal-field interviews__modal-field--full">
                    <label className={`interviews__modal-label ${isDark ? 'interviews__modal-label--dark' : ''}`}>
                      {t('interview.interviewTitle')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('interview.interviewTitle')}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`interviews__modal-input ${isDark ? 'interviews__modal-input--dark' : ''}`}
                      required
                      disabled={formLoading}
                    />
                  </div>


                  {/* URL del Repositorio */}
                  <div className="interviews__modal-field interviews__modal-field--full">
                    <label className={`interviews__modal-label ${isDark ? 'interviews__modal-label--dark' : ''}`}>
                      {t('interview.repositoryUrl')}
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username/repository"
                      value={formData.repoUrl}
                      onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                      className={`interviews__modal-input ${isDark ? 'interviews__modal-input--dark' : ''}`}
                      required
                      disabled={formLoading}
                    />
                  </div>


                  {/* Tipo de Entrevista */}
                  <div className="interviews__modal-field">
                    <label className={`interviews__modal-label ${isDark ? 'interviews__modal-label--dark' : ''}`}>
                      {t('interview.type')}
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className={`interviews__modal-select ${isDark ? 'interviews__modal-select--dark' : ''}`}
                      disabled={formLoading}
                    >
                      <option value="ai_generated">{t('interview.aiGenerated')}</option>
                      <option value="custom">{t('interview.custom')}</option>
                    </select>
                  </div>


                  {/* Dificultad */}
                  <div className="interviews__modal-field">
                    <label className={`interviews__modal-label ${isDark ? 'interviews__modal-label--dark' : ''}`}>
                      {t('interview.difficulty')}
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className={`interviews__modal-select ${isDark ? 'interviews__modal-select--dark' : ''}`}
                      disabled={formLoading}
                    >
                      <option value="junior">{t('interview.junior')}</option>
                      <option value="mid">{t('interview.mid')}</option>
                      <option value="senior">{t('interview.senior')}</option>
                    </select>
                  </div>


                  {/* Idioma */}
                  <div className="interviews__modal-field">
                    <label className={`interviews__modal-label ${isDark ? 'interviews__modal-label--dark' : ''}`}>
                      {t('interview.language')}
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className={`interviews__modal-select ${isDark ? 'interviews__modal-select--dark' : ''}`}
                      disabled={formLoading}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>


                {/* Nota informativa */}
                <div className={`interviews__modal-info ${isDark ? 'interviews__modal-info--dark' : ''}`}>
                  <p>{t('interview.repositoryInfo')}</p>
                </div>


                {/* Botones de acción */}
                <div className="interviews__modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    disabled={formLoading}
                    className={`interviews__modal-button interviews__modal-button--cancel ${isDark ? 'interviews__modal-button--cancel--dark' : ''}`}
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="interviews__modal-button interviews__modal-button--submit"
                  >
                    {formLoading ? (
                      <>
                        <div className="interviews__modal-spinner"></div>
                        {t('interview.creating')}
                      </>
                    ) : (
                      <>
                        <FiPlus />
                        {t('interview.createInterview')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


        <div className="interviews__search">
          <div className="interviews__search-wrapper">
            <FiSearch className="interviews__search-icon" />
            <input
              type="text"
              placeholder={t('interview.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`interviews__search-input ${isDark ? 'interviews__search-input--dark' : ''}`}
            />
          </div>
        </div>


        {loading ? (
          <div className="interviews__loading">
            <div className="interviews__loading-spinner"></div>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className={`interviews__empty ${isDark ? 'interviews__empty--dark' : ''}`}>
            <p>{t('interview.noInterviews')}</p>
          </div>
        ) : (
          <div className="interviews__grid">
            {filteredInterviews.map((interview, index) => (
              <div
                key={interview._id || interview.id || `interview-${index}`}
                className={`interview-card ${isDark ? 'interview-card--dark' : ''}`}
              >
                <div className="interview-card__header">
                  <h3 className={`interview-card__title ${isDark ? 'interview-card__title--dark' : ''}`}>
                    {interview.title}
                  </h3>
                  <span className={`interview-card__status interview-card__status--${interview.status === 'completed' ? 'completed' : interview.status === 'in_progress' ? 'in-progress' : 'scheduled'}`}>
                    {t(`interview.${interview.status === 'completed' ? 'completed' : interview.status === 'in_progress' ? 'inProgress' : 'scheduled'}`)}
                  </span>
                </div>
                <div className="interview-card__info">
                  <div className={`interview-card__info-item ${isDark ? 'interview-card__info-item--dark' : ''}`}>
                    <span className="interview-card__info-label">{t('interview.repository')}:</span>
                    {interview.repoUrl || interview.repositoryUrl ? (
                      <a href={interview.repoUrl || interview.repositoryUrl} target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6', wordBreak: 'break-all'}}>
                        {interview.repoUrl || interview.repositoryUrl}
                      </a>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                  <div className={`interview-card__info-item ${isDark ? 'interview-card__info-item--dark' : ''}`}>
                    <span className="interview-card__info-label">{t('interview.difficulty')}:</span>
                    <span>{interview.difficulty}</span>
                  </div>
                  <div className={`interview-card__info-item ${isDark ? 'interview-card__info-item--dark' : ''}`}>
                    <span className="interview-card__info-label">{t('interview.score')}:</span>
                    <span>{interview.totalScore}%</span>
                  </div>
                </div>
                <div className="interview-card__actions">
                  <button
                    onClick={() => navigate(`/interview/${interview._id}`)}
                    className="interview-card__button interview-card__button--view"
                  >
                    <FiEye /> {t('interview.view')}
                  </button>
                  <button
                    onClick={() => handleDeleteInterview(interview._id)}
                    className="interview-card__button interview-card__button--delete"
                  >
                    <FiTrash2 /> {t('common.delete')}
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
