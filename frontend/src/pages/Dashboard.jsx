import React from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiDownload, FiTrendingUp, FiAward, FiClock, FiPlus, FiTrash2 } from 'react-icons/fi';
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
    manualFormData,
    newQuestion,
    handleCreateInterview,
    handleCreateManualInterview,
    handleAddQuestion,
    handleRemoveQuestion,
    toggleCreateForm,
    updateFormData,
    updateManualFormData,
    updateNewQuestion,
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
            </div>
          </div>

          {showCreateForm && (
              <div className={`dashboard__forms-wrapper ${isDark ? 'dashboard__forms-wrapper--dark' : ''}`}>
                <h2 className={`dashboard__forms-wrapper-title ${isDark ? 'dashboard__forms-wrapper-title--dark' : ''}`}>
                  🎯 Nueva Entrevista
                </h2>

                {/* Card para Entrevistas por IA */}
                <div className={`dashboard__form-card dashboard__form-card--ai ${isDark ? 'dashboard__form-card--dark' : ''}`}>
                  <h3 className={`dashboard__form-title ${isDark ? 'dashboard__form-title--dark' : ''}`}>
                    🤖 Generación por IA
                  </h3>
                  <p className={`dashboard__form-subtitle ${isDark ? 'dashboard__form-subtitle--dark' : ''}`}>
                    Genera preguntas automáticamente usando IA
                  </p>
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
                        value={formData.difficulty}
                        onChange={(e) => updateFormData('difficulty', e.target.value)}
                        className={`dashboard__form-input ${isDark ? 'dashboard__form-input--dark' : ''}`}
                        disabled={formLoading}
                    >
                      <option value="junior">Fácil (5 preguntas)</option>
                      <option value="mid">Intermedio (10 preguntas)</option>
                      <option value="senior">Difícil (20 preguntas)</option>
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
                    <div className="dashboard__form-actions">
                      <button
                          type="submit"
                          disabled={formLoading}
                          className="dashboard__button dashboard__button--save"
                      >
                        {formLoading ? (
                            <>
                              <div className="dashboard__spinner"></div>
                              Creando...
                            </>
                        ) : (
                            '🚀 Crear Entrevista'
                        )}
                      </button>
                      <button
                          type="button"
                          onClick={toggleCreateForm}
                          disabled={formLoading}
                          className="dashboard__button dashboard__button--cancel"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>

                {/* Card para Entrevistas Manuales */}
                <div className={`dashboard__form-card dashboard__form-card--manual ${isDark ? 'dashboard__form-card--dark' : ''}`}>
                  <h3 className={`dashboard__form-title ${isDark ? 'dashboard__form-title--dark' : ''}`}>
                    ✏️ Generación Manual
                  </h3>
                  <p className={`dashboard__form-subtitle ${isDark ? 'dashboard__form-subtitle--dark' : ''}`}>
                    Crea tus propias preguntas manualmente
                  </p>
                  <form onSubmit={handleCreateManualInterview} className="dashboard__form-grid">
                    <input
                        type="text"
                        placeholder="Título de la entrevista"
                        value={manualFormData.title}
                        onChange={(e) => updateManualFormData('title', e.target.value)}
                        className={`dashboard__form-input ${isDark ? 'dashboard__form-input--dark' : ''}`}
                        required
                        disabled={formLoading}
                    />
                    <input
                        type="url"
                        placeholder="URL del repositorio (GitHub, GitLab, etc.)"
                        value={manualFormData.repoUrl}
                        onChange={(e) => updateManualFormData('repoUrl', e.target.value)}
                        className={`dashboard__form-input ${isDark ? 'dashboard__form-input--dark' : ''}`}
                        required
                        disabled={formLoading}
                    />
                    <select
                        value={manualFormData.language}
                        onChange={(e) => updateManualFormData('language', e.target.value)}
                        className={`dashboard__form-input ${isDark ? 'dashboard__form-input--dark' : ''}`}
                        disabled={formLoading}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>

                    {/* Sección para añadir preguntas */}
                    <div className="dashboard__questions-section">
                      <h3 className={`dashboard__questions-title ${isDark ? 'dashboard__questions-title--dark' : ''}`}>
                        📝 Preguntas ({manualFormData.questions.length})
                      </h3>

                      <div className="dashboard__add-question">
                        <textarea
                            placeholder="Escribe tu pregunta aquí..."
                            value={newQuestion.questionText}
                            onChange={(e) => updateNewQuestion('questionText', e.target.value)}
                            className={`dashboard__question-input ${isDark ? 'dashboard__question-input--dark' : ''}`}
                            rows="3"
                            disabled={formLoading}
                        />
                        <div className="dashboard__add-question-footer">
                          <button
                              type="button"
                              onClick={handleAddQuestion}
                              disabled={formLoading}
                              className="dashboard__add-question-button"
                          >
                            <FiPlus /> Añadir Pregunta
                          </button>
                        </div>
                      </div>

                      {manualFormData.questions.length > 0 && (
                          <div className="dashboard__questions-list">
                            {manualFormData.questions.map((q, index) => {
                              console.log(`📋 Pregunta ${index + 1}:`, q);
                              return (
                                <div key={index} className={`dashboard__question-item ${isDark ? 'dashboard__question-item--dark' : ''}`}>
                                  <div className="dashboard__question-header">
                                    <span className="dashboard__question-number">{index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveQuestion(index)}
                                        disabled={formLoading}
                                        className="dashboard__question-remove"
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </div>
                                  <p className="dashboard__question-text">{q.questionText || 'Sin texto'}</p>
                                </div>
                              );
                            })}
                          </div>
                      )}
                    </div>

                    <div className="dashboard__form-actions">
                      <button
                          type="submit"
                          disabled={formLoading || manualFormData.questions.length === 0}
                          className="dashboard__button dashboard__button--save"
                      >
                        {formLoading ? (
                            <>
                              <div className="dashboard__spinner"></div>
                              Creando...
                            </>
                        ) : (
                            '🚀 Crear Entrevista'
                        )}
                      </button>
                      <button
                          type="button"
                          onClick={toggleCreateForm}
                          disabled={formLoading}
                          className="dashboard__button dashboard__button--cancel"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
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
