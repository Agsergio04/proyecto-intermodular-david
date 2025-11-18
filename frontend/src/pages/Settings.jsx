import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLanguageStore, useThemeStore } from '../store';
import { toast } from 'react-toastify';
import { authService } from '../api';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import '../assets/styles/Settings.css';

// Planes de suscripción
const SubscriptionPlans = [
  {
    key: 'free',
    name: 'Cuenta gratuita',
    description: 'Acceso básico y limitado a preguntas AI',
    price: '0€',
    features: [
      'Preguntas AI limitadas',
      'Gestión básica de entrevistas',
      'Sin estadísticas avanzadas',
    ],
  },
  {
    key: 'premium',
    name: 'Premium',
    description: 'Acceso completo a todas las funciones',
    price: '7.99€/mes',
    features: [
      'Preguntas AI ilimitadas',
      'Estadísticas avanzadas',
      'Descarga de informes',
      'Prioridad de soporte',
    ],
  },
];

const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguageStore();
  const { isDark } = useThemeStore();
  const [loading, setLoading] = useState(false);

  // Carga inicial desde localStorage solo si no hay usuario
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : {};
  });
  const [showPlans, setShowPlans] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    profession: user?.profession || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // GET actual del usuario SIEMPRE desde backend al cargar Settings
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authService.getMe(); // GET /auth/me
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setProfileData({
          firstName: res.data.user?.firstName || '',
          lastName: res.data.user?.lastName || '',
          profession: res.data.user?.profession || ''
        });
      } catch (error) {
        toast.error('No se pudo actualizar el usuario.');
      }
    };
    fetchProfile();
  }, []);

  // Suscripción
  const subscription = user?.subscriptionStatus || 'free';

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
      toast.warning('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const response = await authService.updateProfile(profileData);
      const updatedUser = {
        ...user,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        profession: profileData.profession,
        ...response.data,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('userUpdated'));
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error updating profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword.trim() || !passwordData.newPassword.trim()) {
      toast.warning('Please fill in all fields');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error(t('auth.passwordMismatch') || 'Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.warning('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error changing password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    const updatedUser = { ...user, language: lang };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    toast.success(`Language changed to ${lang}`);
  };

  // Upgrade usuario (solo lógica de frontend)
  const handleUpgrade = () => {
    toast.info('Redirigir a gestión de pago / upgrade');
  };

  return (
    <div className={`settings ${isDark ? 'settings--dark' : ''}`}>
      <div className="settings__container">
        <div className="settings__header">
          <button
            onClick={() => navigate('/dashboard')}
            className="settings__back-button"
          >
            <FiArrowLeft /> {t('common.back')}
          </button>
          <h1 className={`settings__title ${isDark ? 'settings__title--dark' : ''}`}>
            {t('settings.title')}
          </h1>
        </div>

        {/* SUSCRIPCIÓN */}
        <div className={`settings__subscription ${isDark ? 'settings__subscription--dark' : ''}`}>
          <h2 className={`settings__section-title ${isDark ? 'settings__section-title--dark' : ''}`}>
            {t('settings.subscription')}
          </h2>
          <div className="settings__subscription-status">
            <FiCheckCircle className={`settings__subscription-icon ${
              subscription === 'premium' ? 'settings__subscription-icon--premium' : 'settings__subscription-icon--free'
            }`} />
            <span className={`settings__subscription-label ${isDark ? 'settings__subscription-label--dark' : ''}`}>
              {subscription === 'premium' ? t('subscription.premiumPlan') : t('subscription.freePlan')}
            </span>
          </div>
          <button
            onClick={() => setShowPlans(!showPlans)}
            className="settings__manage-button"
          >
            {t('settings.manageSubscription')}
          </button>
          {showPlans && (
            <div className="settings__plans-grid">
              {SubscriptionPlans.map((plan) => (
                <div key={plan.key} className={`plan-card ${isDark ? 'plan-card--dark' : ''} ${
                  subscription === plan.key ? `plan-card--active ${isDark ? 'plan-card--active--dark' : ''}` : ''
                }`}>
                  <div className="plan-card__header">
                    <h3 className={`plan-card__name ${isDark ? 'plan-card__name--dark' : ''}`}>
                      {plan.name}
                      {subscription === plan.key && (
                        <span className="plan-card__badge">
                          {t('settings.currentPlan')}
                        </span>
                      )}
                    </h3>
                  </div>
                  <p className={`plan-card__description ${isDark ? 'plan-card__description--dark' : ''}`}>
                    {plan.description}
                  </p>
                  <div className={`plan-card__price ${isDark ? 'plan-card__price--dark' : ''}`}>
                    {plan.price}
                  </div>
                  <ul className={`plan-card__features ${isDark ? 'plan-card__features--dark' : ''}`}>
                    {plan.features.map((feat) => (
                      <li key={feat}>{feat}</li>
                    ))}
                  </ul>
                  {subscription !== plan.key && plan.key === 'premium' && (
                    <button
                      onClick={handleUpgrade}
                      className="plan-card__upgrade-button"
                    >
                      {t('settings.upgradeToPremium')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="settings__grid">
          {/* Perfil */}
          <div className={`settings__form-card ${isDark ? 'settings__form-card--dark' : ''}`}>
            <h2 className={`settings__section-title ${isDark ? 'settings__section-title--dark' : ''}`}>
              {t('settings.profile')}
            </h2>
            <form onSubmit={handleUpdateProfile} className="settings__form">
              <div className="settings__field">
                <label className={`settings__label ${isDark ? 'settings__label--dark' : ''}`}>
                  {t('common.firstName')}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  className={`settings__input ${isDark ? 'settings__input--dark' : ''}`}
                  required
                />
              </div>
              <div className="settings__field">
                <label className={`settings__label ${isDark ? 'settings__label--dark' : ''}`}>
                  {t('common.lastName')}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  className={`settings__input ${isDark ? 'settings__input--dark' : ''}`}
                  required
                />
              </div>
              <div className="settings__field">
                <label className={`settings__label ${isDark ? 'settings__label--dark' : ''}`}>
                  {t('common.profession')}
                </label>
                <input
                  type="text"
                  name="profession"
                  value={profileData.profession}
                  onChange={handleProfileChange}
                  className={`settings__input ${isDark ? 'settings__input--dark' : ''}`}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="settings__submit-button"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    {t('common.loading')}
                  </>
                ) : (
                  t('settings.updateProfile')
                )}
              </button>
            </form>
          </div>
          {/* Contraseña */}
          <div className={`settings__form-card ${isDark ? 'settings__form-card--dark' : ''}`}>
            <h2 className={`settings__section-title ${isDark ? 'settings__section-title--dark' : ''}`}>
              {t('settings.security')}
            </h2>
            <form onSubmit={handleChangePassword} className="settings__form">
              <div className="settings__field">
                <label className={`settings__label ${isDark ? 'settings__label--dark' : ''}`}>
                  {t('settings.currentPassword')}
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`settings__input ${isDark ? 'settings__input--dark' : ''}`}
                  required
                />
              </div>
              <div className="settings__field">
                <label className={`settings__label ${isDark ? 'settings__label--dark' : ''}`}>
                  {t('settings.newPassword')}
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`settings__input ${isDark ? 'settings__input--dark' : ''}`}
                  required
                />
              </div>
              <div className="settings__field">
                <label className={`settings__label ${isDark ? 'settings__label--dark' : ''}`}>
                  {t('settings.confirmNewPassword')}
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className={`settings__input ${isDark ? 'settings__input--dark' : ''}`}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="settings__submit-button"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    {t('common.loading')}
                  </>
                ) : (
                  t('settings.changePassword')
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Preferencias */}
        <div className={`settings__language-section ${isDark ? 'settings__language-section--dark' : ''}`}>
          <h2 className={`settings__section-title ${isDark ? 'settings__section-title--dark' : ''}`}>
            {t('settings.preferences')}
          </h2>
          <div className="settings__field">
            <label className={`settings__label ${isDark ? 'settings__label--dark' : ''}`}>
              {t('settings.language')}
            </label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className={`settings__select ${isDark ? 'settings__select--dark' : ''}`}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        {/* Current User Info */}
        <div className={`settings__full-section ${isDark ? 'settings__full-section--dark' : ''}`}>
          <p className={`settings__label ${isDark ? 'settings__label--dark' : ''}`}>
            <strong>Current User Email:</strong> {user?.email || 'N/A'}
          </p>
          <p className={`settings__label ${isDark ? 'settings__label--dark' : ''}`}>
            <strong>User ID:</strong> {user?._id || user?.id || 'N/A'}
          </p>
        </div>

        {/* Cerrar Sesión */}
        <div className={`settings__full-section ${isDark ? 'settings__full-section--dark' : ''}`}>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              toast.success(t('common.logoutSuccess'));
              navigate('/login');
            }}
            className="settings__submit-button"
            style={{ backgroundColor: 'var(--color-danger)', width: '100%' }}
          >
            <FiArrowLeft className="rotate-180" />
            {t('common.logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
