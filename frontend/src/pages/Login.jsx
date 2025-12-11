import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { authService } from '../api';
import { useAuthStore, useThemeStore } from '../store';
import { FiMail, FiLock } from 'react-icons/fi';
import '../assets/styles/Login.css';

/**
 * Componente de login de usuario.
 * Maneja autenticación mediante email y contraseña,
 * almacenamiento de token/usuario y redirección al dashboard.
 * @returns {JSX.Element} Formulario de login responsive con tema oscuro/claro.
 */
const Login = () => {
  /** Hook de navegación de React Router */
  const navigate = useNavigate();
  
  /** Hook de traducción para internacionalización */
  const { t } = useTranslation();
  
  /** Estado del tema oscuro/claro desde el store */
  const { isDark } = useThemeStore();
  
  /** @type {[boolean, Function]} Estado de carga del formulario de login */
  const [loading, setLoading] = useState(false);
  
  /**
   * @type {[Object, Function]} Estado del formulario con email y password.
   * @property {string} email - Dirección de correo electrónico.
   * @property {string} password - Contraseña del usuario.
   */
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  /**
   * Maneja cambios en los campos del formulario.
   * Actualiza formData dinámicamente usando el atributo name del input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio del input.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Maneja el envío del formulario de login.
   * Valida campos, realiza petición API, guarda token/usuario y redirige.
   * @param {React.FormEvent<HTMLFormElement>} e - Evento de submit del formulario.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error(t('errors.fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(formData);
      const { token, user } = response.data;
      
      /** Almacena token en localStorage para persistencia */
      localStorage.setItem('token', token);
      /** Almacena datos de usuario serializados */
      localStorage.setItem('user', JSON.stringify(user));
      
      /** Actualiza estado global de autenticación */
      useAuthStore.setState({ user, token });
      
      toast.success(t('auth.loginSuccess'));
      navigate('/dashboard');
    } catch (error) {
      /** Manejo de errores con mensaje personalizado desde API o fallback */
      const message = error.response?.data?.message || t('errors.serverError');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    /**
     * Contenedor principal del formulario de login.
     * Aplica clases CSS condicionales para tema oscuro/claro.
     */
    <div className={`login ${isDark ? 'login--dark' : ''}`}>
      
       
      <div className={`login__container ${isDark ? 'login__container--dark' : ''}`}>
        
        <h2 className={`login__title ${isDark ? 'login__title--dark' : ''}`}>
          {t('auth.loginTitle')}
        </h2>

      
        <form onSubmit={handleSubmit} className="login__form">
          
          <div className="login__field">
            <label className={`login__label ${isDark ? 'login__label--dark' : ''}`}>
              {t('common.email')}
            </label>
            <div className={`login__input-wrapper ${isDark ? 'login__input-wrapper--dark' : ''}`}>
              <FiMail className="login__icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('common.email')}
                className={`login__input ${isDark ? 'login__input--dark' : ''}`}
              />
            </div>
          </div>

         
          <div className="login__field">
            <label className={`login__label ${isDark ? 'login__label--dark' : ''}`}>
              {t('common.password')}
            </label>
            <div className={`login__input-wrapper ${isDark ? 'login__input-wrapper--dark' : ''}`}>
              <FiLock className="login__icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('common.password')}
                className={`login__input ${isDark ? 'login__input--dark' : ''}`}
              />
            </div>
          </div>

          
          <button
            type="submit"
            disabled={loading}
            className="login__submit"
          >
            {loading ? t('common.loading') : t('common.login')}
          </button>
        </form>

        
        <p className={`login__link ${isDark ? 'login__link--dark' : ''}`}>
          {t('auth.noAccount')}
          <span
            onClick={() => navigate('/register')}
            className={`login__link-text ${isDark ? 'login__link-text--dark' : ''}`}
          >
            {t('common.register')}
          </span>
        </p>
      </div>
    </div>
  );
};

/**
 * Exporta el componente Login como módulo por defecto.
 * @type {React.FC}
 */
export default Login;
