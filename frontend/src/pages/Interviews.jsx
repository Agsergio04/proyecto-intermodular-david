import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { interviewService } from '../api';
import { FiSearch, FiTrash2, FiEye, FiDownload } from 'react-icons/fi';
import { useThemeStore } from '../store';
import '../assets/styles/Interviews.css';

const Interviews = () => {
  const { t } = useTranslation();
  const { isDark } = useThemeStore();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDownloadReport = async (interviewId) => {
    try {
      toast.info('Preparando reporte para descargar...');
      // Aquí iría la lógica para descargar el reporte
      // Por ahora solo mostramos un mensaje
      toast.success('Funcionalidad de descarga disponible próximamente');
    } catch (error) {
      toast.error('Error al descargar el reporte');
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
              className={`interviews__button interviews__button--dashboard ${isDark ? 'interviews__button--dashboard--dark' : ''}`}
            >
              ← {t('dashboard.title')}
            </button>
          </div>
        </div>

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
                    <span className="interview-card__info-label">Repositorio:</span>
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
                    <span>
                      {interview.difficulty === 'junior' ? 'Fácil' : 
                       interview.difficulty === 'mid' ? 'Intermedio' : 
                       interview.difficulty === 'senior' ? 'Difícil' : 'Manual'}
                    </span>
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
                    onClick={() => handleDownloadReport(interview._id)}
                    className="interview-card__button interview-card__button--download"
                    disabled={interview.status !== 'completed'}
                  >
                    <FiDownload /> {t('dashboard.downloadReport')}
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
