import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { authService } from '../api';
import { useAuthStore, useThemeStore } from '../store';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import '../assets/styles/Register.css';

/**
 * Componente de registro de nuevos usuarios.
 * Maneja creación de cuentas con nombre, apellido, email, contraseña y idioma,
 * almacenamiento de token/usuario y redirección al dashboard.
 * @returns {JSX.Element} Formulario de registro responsive con tema oscuro/claro.
 */
const Register = () => {
  /** Hook de navegación de React Router */
  const navigate = useNavigate();
  
  /** Hook de traducción para internacionalización */
  const { t } = useTranslation();
  
  /** Estado del tema oscuro/claro desde el store */
  const { isDark } = useThemeStore();
  
  /** @type {[boolean, Function]} Estado de carga del formulario de registro */
  const [loading, setLoading] = useState(false);
  
  /**
   * @type {[Object, Function]} Estado del formulario de registro completo.
   * @property {string} email - Dirección de correo electrónico.
   * @property {string} password - Contraseña del usuario.
   * @property {string} firstName - Nombre del usuario.
   * @property {string} lastName - Apellido del usuario.
   * @property {string} language - Idioma preferido ('en'|'es'|'fr'|'de').
   */
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    language: 'en'
  });

  /**
   * Maneja cambios en todos los campos del formulario (input y select).
   * Actualiza formData dinámicamente usando el atributo name del elemento.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - Evento de cambio.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Maneja el envío del formulario de registro.
   * Valida campos obligatorios, realiza petición API, guarda token/usuario y redirige.
   * @param {React.FormEvent<HTMLFormElement>} e - Evento de submit del formulario.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error(t('errors.fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register(formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      useAuthStore.setState({ user, token });
      
      toast.success(t('auth.registerSuccess'));
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`register ${isDark ? 'register--dark' : ''}`}>
      <div className={`register__container ${isDark ? 'register__container--dark' : ''}`}>
        <h2 className={`register__title ${isDark ? 'register__title--dark' : ''}`}>
          {t('auth.registerTitle')}
        </h2>
        <form onSubmit={handleSubmit} className="register__form">
          <div className="register__field">
            <label className={`register__label ${isDark ? 'register__label--dark' : ''}`}>
              {t('common.firstName')}
            </label>
            <div className={`register__input-wrapper ${isDark ? 'register__input-wrapper--dark' : ''}`}>
              <FiUser className="register__icon" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t('common.firstName')}
                className={`register__input ${isDark ? 'register__input--dark' : ''}`}
              />
            </div>
          </div>
          <div className="register__field">
            <label className={`register__label ${isDark ? 'register__label--dark' : ''}`}>
              {t('common.lastName')}
            </label>
            <div className={`register__input-wrapper ${isDark ? 'register__input-wrapper--dark' : ''}`}>
              <FiUser className="register__icon" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t('common.lastName')}
                className={`register__input ${isDark ? 'register__input--dark' : ''}`}
              />
            </div>
          </div>
          <div className="register__field">
            <label className={`register__label ${isDark ? 'register__label--dark' : ''}`}>
              {t('common.email')}
            </label>
            <div className={`register__input-wrapper ${isDark ? 'register__input-wrapper--dark' : ''}`}>
              <FiMail className="register__icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('common.email')}
                className={`register__input ${isDark ? 'register__input--dark' : ''}`}
              />
            </div>
          </div>
          <div className="register__field">
            <label className={`register__label ${isDark ? 'register__label--dark' : ''}`}>
              {t('common.password')}
            </label>
            <div className={`register__input-wrapper ${isDark ? 'register__input-wrapper--dark' : ''}`}>
              <FiLock className="register__icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('common.password')}
                className={`register__input ${isDark ? 'register__input--dark' : ''}`}
              />
            </div>
          </div>
          <div className="register__field">
            <label className={`register__label ${isDark ? 'register__label--dark' : ''}`}>
              {t('common.language')}
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className={`register__select ${isDark ? 'register__select--dark' : ''}`}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="register__submit"
          >
            {loading ? t('common.loading') : t('common.register')}
          </button>
        </form>
        <p className={`register__link ${isDark ? 'register__link--dark' : ''}`}>
          {t('auth.haveAccount')}
          <span
            onClick={() => navigate('/login')}
            className={`register__link-text ${isDark ? 'register__link-text--dark' : ''}`}
          >
            {t('common.login')}
          </span>
        </p>
      </div>
    </div>
  );
};

/**
 * Exporta el componente Register como módulo por defecto.
 * @type {React.FC}
 */
export default Register;
