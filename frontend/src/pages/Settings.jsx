/**
 * @fileoverview User Settings and Preferences page.
 * Provides UI to manage profile, password, language, theme and subscription.
 * Integrations and behaviors:
 * - Sync profile from backend (GET /auth/me)
 * - Update profile (PUT /auth/profile)
 * - Change password (POST /auth/change-password)
 * - Subscription management (Free and Premium plans)
 * - Internationalization (i18n) with multiple languages
 * - Dark/Light theme persisted in localStorage
 *
 * @module pages/Settings
 * @requires react
 * @requires react-i18next
 * @requires react-router-dom
 * @requires react-toastify
 * @requires react-icons/fi
 * @requires ../api (authService)
 * @requires ../store (useLanguageStore, useThemeStore)
 * @requires ../assets/styles/Settings.css
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLanguageStore, useThemeStore } from '../store';
import { toast } from 'react-toastify';
import { authService } from '../api';
import { FiArrowLeft, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import '../assets/styles/Settings.css';

/**
 * Array de planes de suscripción disponibles para el usuario.
 * Define dos niveles: Gratuito y Premium con características diferenciadas.
 * 
 * Estructura de cada plan:
 * @typedef {Object} SubscriptionPlan
 * @property {string} key - Identificador único del plan ('free' o 'premium')
 * @property {string} name - Nombre legible del plan para mostrar en UI
 * @property {string} description - Descripción breve del plan
 * @property {string} price - Precio mostrado (ej: "0€" o "7.99€/mes")
 * @property {Array<string>} features - Lista de características incluidas
 * 
 * @type {SubscriptionPlan[]}
 * @constant
 */
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

/**
 * Componente de página de Configuración del Usuario.
 * 
 * Funcionalidades principales:
 * 1. **Gestión de Suscripción**: Mostrar plan actual y opciones de upgrade
 * 2. **Perfil**: Actualizar nombre y apellido del usuario
 * 3. **Seguridad**: Cambiar contraseña con validaciones
 * 4. **Preferencias**: Cambiar idioma (EN, ES, FR, DE)
 * 5. **Información de Usuario**: Mostrar email e ID
 * 6. **Cerrar Sesión**: Limpiar localStorage y redirigir a login
 * 
 * Estados gestionados:
 * - user: Información actual del usuario desde backend
 * - profileData: Datos de perfil temporales antes de guardar
 * - passwordData: Datos de cambio de contraseña temporales
 * - loading: Indica si hay petición al backend en progreso
 * - showPlans: Controla visibilidad del grid de planes de suscripción
 * 
 * Sincronizaciones:
 * - localStorage: Persiste usuario y token
 * - Backend (authService): Sincroniza perfil en cada carga
 * - Event 'userUpdated': Notifica a Header cuando cambia el usuario
 * 
 * @component
 * @returns {React.ReactElement} Página de settings con formularios y opciones
 * 
 * @example
 * // Uso en rutas de App.js
 * <Route path="/settings" element={<Settings />} />
 */
const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguageStore();
  const { isDark } = useThemeStore();
  /** @type {[boolean, Function]} Indica si hay petición al backend en progreso */
  const [loading, setLoading] = useState(false);

  /**
   * @type {[Object, Function]}
   * Estado del usuario actual. Se inicializa desde localStorage y se sincroniza
   * con backend en el useEffect de carga.
   * Contiene: _id, email, firstName, lastName, subscriptionStatus, language
   */
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : {};
  });
  /** @type {[boolean, Function]} Controla visibilidad del grid de planes de suscripción */
  const [showPlans, setShowPlans] = useState(false);

  /**
   * @type {[Object, Function]}
   * Datos temporales del perfil antes de ser guardados en backend.
   * Estructura: { firstName: string, lastName: string }
   */
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });

  /**
   * @type {[Object, Function]}
   * Datos temporales para cambio de contraseña antes de enviar al backend.
   * Estructura: { currentPassword: string, newPassword: string, confirmNewPassword: string }
   */
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  /**
   * Hook de inicialización: sincroniza usuario desde backend al cargar Settings.
   * Ejecutado una sola vez al montar el componente.
   * 
   * Flujo:
   * 1. Realiza GET /auth/me al backend
   * 2. Actualiza estado user con datos frescos
   * 3. Persiste en localStorage para acceso offline
   * 4. Actualiza profileData con datos del usuario
   * 5. Maneja errores con toast
   * 
   * @dependencies [] - Se ejecuta solo una vez al montar
   * @sideEffects
   * - GET /auth/me: Obtiene usuario del backend
   * - setUser(): Actualiza estado
   * - localStorage.setItem('user'): Persiste datos
   * - setProfileData(): Rellena formulario
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authService.getMe(); // GET /auth/me
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setProfileData({
          firstName: res.data.user?.firstName || '',
          lastName: res.data.user?.lastName || ''
        });
      } catch (error) {
        toast.error('No se pudo actualizar el usuario.');
      }
    };
    fetchProfile();
  }, []);

  /**
   * Extrae nivel de suscripción actual del usuario.
   * Valores: 'premium' o 'free' (por defecto)
   * @type {string}
   */
  const subscription = user?.subscriptionStatus || 'free';

  /**
   * Actualiza estado temporal profileData al cambiar inputs del formulario.
   * Esta función NO envía a backend; solo actualiza estado local.
   * 
   * @function handleProfileChange
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio del input
   * @sideEffects Actualiza state: profileData[name] = value
   * 
   * @example
   * <input name="firstName" onChange={handleProfileChange} />
   */
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Actualiza estado temporal passwordData al cambiar inputs del formulario.
   * Esta función NO envía a backend; solo actualiza estado local.
   * 
   * @function handlePasswordChange
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio del input
   * @sideEffects Actualiza state: passwordData[name] = value
   * 
   * @example
   * <input name="newPassword" type="password" onChange={handlePasswordChange} />
   */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Envía cambios de perfil al backend y actualiza estado local.
   * 
   * Validaciones:
   * - firstName y lastName no pueden estar vacíos (trim)
   * 
   * Proceso:
   * 1. Valida que ambos campos tengan contenido
   * 2. Envia PUT /auth/profile con { firstName, lastName }
   * 3. Actualiza estado user y profileData
   * 4. Persiste en localStorage
   * 5. Dispara evento 'userUpdated' para notificar a Header
   * 6. Muestra toast de éxito/error
   * 
   * @async
   * @function handleUpdateProfile
   * @param {React.FormEvent<HTMLFormElement>} e - Evento del formulario
   * @returns {Promise<void>}
   * @sideEffects
   * - PUT /auth/profile: Actualiza perfil en backend
   * - setUser(): Actualiza estado
   * - localStorage.setItem(): Persiste usuario
   * - window.dispatchEvent('userUpdated'): Notifica componentes
   * - toast.*(): Muestra notificaciones
   */
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

  /**
   * Cambiar contraseña del usuario con validaciones.
   * 
   * Validaciones realizadas:
   * 1. currentPassword y newPassword no pueden estar vacíos
   * 2. newPassword === confirmNewPassword (deben coincidir)
   * 3. newPassword.length >= 6 (mínimo 6 caracteres)
   * 
   * Proceso:
   * 1. Ejecuta validaciones (si falla, muestra toast y retorna)
   * 2. Envia POST /auth/change-password con contraseñas
   * 3. Limpia formulario (resetea passwordData)
   * 4. Muestra toast de éxito
   * 5. Maneja errores del backend
   * 
   * Nota: Después de cambio exitoso, usuario debe usar nueva contraseña en próximo login.
   * 
   * @async
   * @function handleChangePassword
   * @param {React.FormEvent<HTMLFormElement>} e - Evento del formulario
   * @returns {Promise<void>}
   * @sideEffects
   * - POST /auth/change-password: Cambia contraseña en backend
   * - setPasswordData(): Limpia formulario
   * - setLoading(): Muestra estado durante petición
   * - toast.*(): Notificaciones de validación/éxito/error
   */
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

  /**
   * Cambia idioma de la aplicación y persiste la preferencia.
   * 
   * Idiomas soportados: 'en' | 'es' | 'fr' | 'de'
   * 
   * Proceso:
   * 1. Actualiza Zustand store con setLanguage(lang)
   * 2. Cambia idioma en i18next (i18n.changeLanguage)
   * 3. Persiste preferencia en localStorage
   * 4. Muestra toast de confirmación
   * 
   * @function handleLanguageChange
   * @param {string} lang - Código de idioma ('en', 'es', 'fr', 'de')
   * @returns {void}
   * @sideEffects
   * - setLanguage(): Actualiza store global de lenguaje
   * - i18n.changeLanguage(): Cambia idioma de traducción
   * - localStorage.setItem(): Persiste preferencia en user
   * - toast.success(): Muestra confirmación
   * 
   * @example
   * handleLanguageChange('es'); // Cambia a Español
   */
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    const updatedUser = { ...user, language: lang };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    toast.success(`Language changed to ${lang}`);
  };

  /**
   * Handler para upgrade a plan Premium.
   * Actualmente muestra mensaje informativo; integración de pago pending.
   * 
   * TODO: Integrar con servicio de pago (PayPal, Stripe, etc)
   * 
   * @function handleUpgrade
   * @returns {void}
   * @sideEffects toast.info(): Muestra mensaje informativo
   */
  const handleUpgrade = () => {
    toast.info('Redirigir a gestión de pago / upgrade');
  };

  /**
   * Cierra sesión del usuario.
   * 
   * Proceso:
   * 1. Elimina token de autenticación de localStorage
   * 2. Elimina información del usuario de localStorage
   * 3. Muestra toast de confirmación
   * 4. Redirige a página de login (/login)
   * 
   * Nota: También llamado desde "Danger Zone" que dice "deleteAccount"
   * (en realidad es logout, no elimina cuenta del servidor)
   * 
   * @function handleLogout
   * @returns {void}
   * @sideEffects
   * - localStorage.removeItem(): Limpia autenticación y usuario
   * - toast.success(): Muestra confirmación
   * - navigate('/login'): Redirige a login
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success(t('common.logoutSuccess'));
    navigate('/login');
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
              <button
                type="submit"
                disabled={loading}
                className={`settings__submit-button ${isDark ? 'settings__submit-button--dark' : ''}`}
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
                className={`settings__submit-button ${isDark ? 'settings__submit-button--dark' : ''}`}
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

        {/* Zona de Peligro - Cerrar Sesión */}
        <div className={`settings__danger-zone ${isDark ? 'settings__danger-zone--dark' : ''}`}>
          <div className="settings__danger-header">
            <FiAlertTriangle className="settings__danger-icon" />
            <h3 className="settings__danger-title">
              {t('settings.dangerZone')}
            </h3>
          </div>
          <p className="settings__danger-description">
            {t('settings.dangerZoneWarning')}
          </p>
          <button
            onClick={handleLogout}
            className="settings__danger-button"
          >
            {t('settings.deleteAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
