import React from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiDownload, FiTrendingUp, FiAward, FiClock, FiPlus } from 'react-icons/fi';
import { useDashboard } from '../hooks/useDashboard';
import { useThemeStore } from '../store';
import { StatCard } from '../components/StatCard';
import '../assets/styles/Dashboard.css';

const COLORS = ['#3b82f6', '#8b5cf6', '#ef4444', '#10b981'];

const Dashboard = () => {
  const { t } = useTranslation();
  const { isDark } = useThemeStore();
  const {
    stats,
    trends,
    loading,
    showCreateForm,
    formLoading,
    formData,
    downloadReport,
    handleCreateInterview,
    toggleCreateForm,
    updateFormData,
    navigateToInterviews
  } = useDashboard();

  if (loading) {
    return (
        <div className="dashboard__loading">
          <div className="dashboard__loading-spinner"></div>
        </div>
    );
  }

  return (
      <div className={`dashboard ${isDark ? 'dashboard--dark' : ''}`}>
        <div className="dashboard__container">
          <div className="dashboard__header">
            <h1 className={`dashboard__title ${isDark ? 'dashboard__title--dark' : ''}`}>
              {t('dashboard.title')}
            </h1>
            <div className="dashboard__actions">
              <button
                  onClick={toggleCreateForm}
                  disabled={formLoading}
                  className="dashboard__button dashboard__button--new"
              >
                <FiPlus /> {t('interview.newInterview')}
              </button>
              <button
                  onClick={navigateToInterviews}
                  className="dashboard__button dashboard__button--interviews"
              >
                <FiAward /> {t('interview.myInterviews')}
              </button>
            </div>
          </div>

          {showCreateForm && (
              <div className={`dashboard__form ${isDark ? 'dashboard__form--dark' : ''}`}>
                <h2 className={`dashboard__form-title ${isDark ? 'dashboard__form-title--dark' : ''}`}>
                  {t('interview.newInterview')}
                </h2>
                <form onSubmit={handleCreateInterview} className="dashboard__form-grid">
                  <input
                      type="text"
                      placeholder="Título de la entrevista"
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                      className={`dashboard__form-input ${isDark ? 'dashboard__form-input--dark' : ''}`}
                      required
                      disabled={formLoading}
                  />
                  <input
                      type="url"
                      placeholder="URL del repositorio (GitHub, GitLab, etc.)"
                      value={formData.repoUrl}
                      onChange={(e) => updateFormData('repoUrl', e.target.value)}
                      className={`dashboard__form-input ${isDark ? 'dashboard__form-input--dark' : ''}`}
                      required
                      disabled={formLoading}
                  />
                  <select
                      value={formData.type}
                      onChange={(e) => updateFormData('type', e.target.value)}
                      className={`dashboard__form-input ${isDark ? 'dashboard__form-input--dark' : ''}`}
                      disabled={formLoading}
                  >
                    <option value="ai_generated">AI Generated</option>
                    <option value="custom">Custom</option>
                  </select>
                  <select
                      value={formData.difficulty}
                      onChange={(e) => updateFormData('difficulty', e.target.value)}
                      className={`dashboard__form-input ${isDark ? 'dashboard__form-input--dark' : ''}`}
                      disabled={formLoading}
                  >
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                  </select>
                  <select
                      value={formData.language}
                      onChange={(e) => updateFormData('language', e.target.value)}
                      className={`dashboard__form-input ${isDark ? 'dashboard__form-input--dark' : ''}`}
                      disabled={formLoading}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                  <div className="dashboard__form-info" style={{gridColumn: '1 / -1', marginBottom: '8px'}}>
                    <span style={{color: isDark ? '#fff' : '#333', fontWeight: 'bold'}}>
                      Introduce la URL del repositorio (GitHub, GitLab, etc.) para generar preguntas técnicas con IA.
                    </span>
                  </div>
                  <div className="dashboard__form-actions">
                    <button
                        type="submit"
                        disabled={formLoading}
                        className="dashboard__button dashboard__button--save"
                    >
                      {formLoading ? (
                          <>
                            <div className="dashboard__spinner"></div>
                            Creating...
                          </>
                      ) : (
                          'Create Interview'
                      )}
                    </button>
                    <button
                        type="button"
                        onClick={toggleCreateForm}
                        disabled={formLoading}
                        className="dashboard__button dashboard__button--cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
          )}

          <div className="dashboard__stats-grid">
            <StatCard
                title={t('dashboard.totalInterviews')}
                value={stats?.totalInterviews || 0}
                icon={<FiTrendingUp className="text-2xl" />}
                color="stat-card--gray"
                isDark={isDark}
            />
            <StatCard
                title={t('dashboard.completedInterviews')}
                value={stats?.completedInterviews || 0}
                icon={<FiAward className="text-2xl" />}
                color="stat-card--yellow"
                isDark={isDark}
            />
            <StatCard
                title={t('dashboard.averageScore')}
                value={`${stats?.averageScore || 0}%`}
                icon={<FiAward className="text-2xl" />}
                color="stat-card--purple"
                isDark={isDark}
            />
            <StatCard
                title={t('dashboard.totalDuration')}
                value={`${Math.round((stats?.totalDuration || 0) / 60)} min`}
                icon={<FiClock className="text-2xl" />}
                color="stat-card--orange"
                isDark={isDark}
            />
          </div>

          <div className="dashboard__charts-grid">
            <div className={`dashboard__chart-card ${isDark ? 'dashboard__chart-card--dark' : ''}`}>
              <h2 className={`dashboard__chart-title ${isDark ? 'dashboard__chart-title--dark' : ''}`}>
                {t('dashboard.performanceTrends')}
              </h2>
              {trends && trends.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#3b82f6" name={t('interview.score')} />
                    </LineChart>
                  </ResponsiveContainer>
              ) : (
                  <p className={`dashboard__chart-empty ${isDark ? 'dashboard__chart-empty--dark' : ''}`}>{t('interview.noInterviews')}</p>
              )}
            </div>

            <div className={`dashboard__chart-card ${isDark ? 'dashboard__chart-card--dark' : ''}`}>
              <h2 className={`dashboard__chart-title ${isDark ? 'dashboard__chart-title--dark' : ''}`}>
                {t('dashboard.scoreDistribution')}
              </h2>
              {stats?.interviewsByProfession && Object.keys(stats.interviewsByProfession).length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                          data={Object.entries(stats.interviewsByProfession).map(([profession, count]) => ({
                            name: profession,
                            value: count
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                      >
                        {Object.keys(stats.interviewsByProfession).map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
              ) : (
                  <p className={`dashboard__chart-empty ${isDark ? 'dashboard__chart-empty--dark' : ''}`}>{t('interview.noInterviews')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
