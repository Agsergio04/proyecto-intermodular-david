/**
 * @fileoverview Componente Header/Navbar de la aplicación.
 * Proporciona navegación global, autenticación, preferencias de idioma y tema.
 * Se adapta responsivamente a móvil y escritorio.
 * 
 * Características:
 * - Menú de navegación condicional (autenticado vs no autenticado)
 * - Selector de idioma (EN, ES, FR, DE)
 * - Toggle de tema oscuro/claro
 * - Menú móvil responsive con hamburguesa
 * - Oculta navegación durante sesión de entrevista activa
 * - Sincronización con hooks personalizados y Zustand store
 * 
 * @module components/Header
 * @requires react
 * @requires react-router-dom
 * @requires react-icons/fi
 * @requires ../hooks/useHeader
 * @requires ../assets/styles/Header.css
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { FiMoon, FiSun, FiMenu, FiX, FiUser, FiClock } from 'react-icons/fi';
import { useHeader } from '../hooks/useHeader';
import '../assets/styles/Header.css';

/**
 * Componente Header/Navbar principal de la aplicación.
 * 
 * Estructura:
 * 1. **Sección Logo**: Logo clickeable que navega a home (/)
 * 2. **Menú Desktop**: 
 *    - Usuarios autenticados: Botones de entrevistas/settings, idioma, tema
 *    - Usuarios sin autenticar: Idioma, tema, botones login/register
 * 3. **Botón Mobile**: Hamburguesa que abre/cierra menú en móvil
 * 4. **Menú Mobile**: Versión responsive del menú desktop
 * 
 * Comportamiento especial:
 * - Durante sesión de entrevista (pathname=/interview/:id), oculta botones de navegación
 * - Soporta 4 idiomas con selector dropdown
 * - Toggle entre modo claro y oscuro persistido en localStorage
 * - Responsive: Menú desktop en pantallas grandes, hamburguesa en móvil
 * 
 * Estados (desde useHeader hook):
 * - isAuthenticated: Boolean de autenticación del usuario
 * - isDark: Estado del tema (true=oscuro, false=claro)
 * - language: Código de idioma actual ('en', 'es', 'fr', 'de')
 * - mobileMenuOpen: Controla visibilidad del menú móvil
 * 
 * @component
 * @returns {React.ReactElement} Header con navegación global y opciones de usuario
 * 
 * @example
 * // Uso en App.js o layout principal
 * <Header />
 */
const Header = () => {
  /**
   * Obtiene la ruta actual para detectar si estamos en sesión de entrevista.
   * @type {Object} location - Objeto de react-router con pathname, search, etc
   */
  const location = useLocation();
  
  /**
   * Valores y funciones extraídas del hook personalizado useHeader.
   * Este hook gestiona el estado global de autenticación, tema, idioma y navegación.
   * 
   * @type {Object}
   * @property {boolean} isAuthenticated - Usuario autenticado o no
   * @property {boolean} isDark - Tema oscuro activo
   * @property {string} language - Idioma actual ('en'|'es'|'fr'|'de')
   * @property {boolean} mobileMenuOpen - Menú móvil visible
   * @property {Function} t - Función de traducción (i18n)
   * @property {Function} handleLanguageChange - Cambia idioma global
   * @property {Function} handleThemeToggle - Cambia tema dark/light
   * @property {Function} toggleMobileMenu - Abre/cierra menú móvil
   * @property {Function} navigateTo - Navega a ruta y cierra menú móvil
   */
  const {
    isAuthenticated,
    isDark,
    language,
    mobileMenuOpen,
    t,
    handleLanguageChange,
    handleThemeToggle,
    toggleMobileMenu,
    navigateTo
  } = useHeader();

  /**
   * Detecta si el usuario está en una sesión de entrevista activa.
   * Se usa para ocultar botones de navegación y dejar foco total en la entrevista.
   * 
   * @type {boolean}
   * @example
   * // true si pathname = '/interview/123abc'
   * // false si pathname = '/interviews' o '/dashboard'
   */
  const isInInterviewSession = location.pathname.startsWith('/interview/');

  return (
    <header className={`header ${isDark ? 'header--dark' : ''}`}>
      <div className="header__container">
        <div
          onClick={() => navigateTo('/')}
          className={`header__logo ${isDark ? 'header__logo--dark' : ''}`}
        >
          <span className={`header__logo-text ${isDark ? 'header__logo-text--dark' : ''}`}>
            {t('common.appName')}
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="header__menu">
          {isAuthenticated ? (
            /**
             * Menú para usuarios autenticados.
             * 
             * Componentes:
             * 1. Botones de navegación (Entrevistas/Settings): Se ocultan si isInInterviewSession=true
             * 2. Selector de idioma con 4 opciones (EN/ES/FR/DE)
             * 3. Toggle de tema (Sun icon para pasar a light, Moon para dark)
             * 
             * La ocultación de botones durante entrevista asegura que el usuario
             * pueda concentrarse completamente sin distracciones de navegación.
             */
            <>
              {/* Ocultar botones de navegación durante entrevista */}
              {!isInInterviewSession && (
                <div className="header__nav-buttons">
                  <button
                    onClick={() => navigateTo('/interviews')}
                    className={`header__nav-button ${isDark ? 'header__nav-button--dark' : ''}`}
                  >
                    <FiClock />
                    {t('interview.myInterviews')}
                  </button>
                  <button
                    onClick={() => navigateTo('/settings')}
                    className={`header__nav-button ${isDark ? 'header__nav-button--dark' : ''}`}
                  >
                    <FiUser />
                    {t('settings.profile')}
                  </button>
                </div>
              )}

              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={`header__language-select ${isDark ? 'header__language-select--dark' : ''}`}
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
                <option value="de">DE</option>
              </select>

              {/* Theme Toggle */}
              <button
                onClick={handleThemeToggle}
                className={`header__theme-button ${isDark ? 'header__theme-button--dark' : ''}`}
              >
                {isDark ? (
                  <FiSun className="header__theme-icon header__theme-icon--sun" />
                ) : (
                  <FiMoon className={`header__theme-icon header__theme-icon--moon ${isDark ? 'header__theme-icon--moon--dark' : ''}`} />
                )}
              </button>
            </>
          ) : (
            /**
             * Menú para usuarios sin autenticar.
             * 
             * Componentes:
             * 1. Selector de idioma con 4 opciones
             * 2. Toggle de tema (Sun/Moon)
             * 3. Botón "Login": Navega a /login
             * 4. Botón "Register": Navega a /register
             * 
             * No hay acceso a Entrevistas ni Settings sin autenticación.
             */
            <div className="header__auth-buttons">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={`header__language-select ${isDark ? 'header__language-select--dark' : ''}`}
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
                <option value="de">DE</option>
              </select>

              {/* Theme Toggle */}
              <button
                onClick={handleThemeToggle}
                className={`header__theme-button ${isDark ? 'header__theme-button--dark' : ''}`}
              >
                {isDark ? (
                  <FiSun className="header__theme-icon header__theme-icon--sun" />
                ) : (
                  <FiMoon className={`header__theme-icon header__theme-icon--moon ${isDark ? 'header__theme-icon--moon--dark' : ''}`} />
                )}
              </button>

              <button
                onClick={() => navigateTo('/login')}
                className={`header__login-button ${isDark ? 'header__login-button--dark' : ''}`}
              >
                {t('common.login')}
              </button>
              <button
                onClick={() => navigateTo('/register')}
                className={`header__register-button ${isDark ? 'header__register-button--dark' : ''}`}
              >
                {t('common.register')}
              </button>
            </div>
          )}
        </div>

        {/**
         * Botón de hamburguesa para menú móvil.
         * Visible solo en pantallas pequeñas (handled por CSS media queries).
         * 
         * Comportamiento:
         * - Icono FiX (X) cuando menú está abierto
         * - Icono FiMenu (hamburguesa) cuando menú está cerrado
         * - onClick={toggleMobileMenu} abre/cierra el menú desplegable
         */}
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className={`header__mobile-button ${isDark ? 'header__mobile-button--dark' : ''}`}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/**
       * Menú responsive para dispositivos móviles.
       * Visible solo cuando mobileMenuOpen=true y en pantallas pequeñas.
       * 
       * Estructura:
       * 1. Para usuarios autenticados:
       *    - Botones de navegación (Entrevistas/Settings) - ocultos en sesión de entrevista
       *    - Selector de idioma con etiquetas largas (English, Español, etc)
       *    - Toggle tema con texto (Light/Dark Mode)
       * 
       * 2. Para usuarios no autenticados:
       *    - Selector de idioma
       *    - Toggle tema con texto
       *    - Botón Login
       *    - Botón Register
       * 
       * Nota: Se cierra automáticamente al navegar (toggleMobileMenu en navigateTo)
       */}
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`header__mobile-menu ${isDark ? 'header__mobile-menu--dark' : ''}`}>
          {isAuthenticated ? (
            <>
              {/* Ocultar botones de navegación en móvil durante entrevista */}
              {!isInInterviewSession && (
                <>
                  <button
                    onClick={() => navigateTo('/interviews')}
                    className={`header__mobile-menu-item ${isDark ? 'header__mobile-menu-item--dark' : ''}`}
                  >
                    <FiClock />
                    {t('interview.myInterviews')}
                  </button>
                  <button
                    onClick={() => navigateTo('/settings')}
                    className={`header__mobile-menu-item ${isDark ? 'header__mobile-menu-item--dark' : ''}`}
                  >
                    <FiUser />
                    {t('settings.profile')}
                  </button>
                </>
              )}
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={`header__language-select ${isDark ? 'header__language-select--dark' : ''}`}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
              <button
                onClick={handleThemeToggle}
                className={`header__mobile-menu-item ${isDark ? 'header__mobile-menu-item--dark' : ''}`}
              >
                {isDark ? <FiSun /> : <FiMoon />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
            </>
          ) : (
            <>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={`header__language-select ${isDark ? 'header__language-select--dark' : ''}`}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
              <button
                onClick={handleThemeToggle}
                className={`header__mobile-menu-item ${isDark ? 'header__mobile-menu-item--dark' : ''}`}
              >
                {isDark ? <FiSun /> : <FiMoon />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                onClick={() => navigateTo('/login')}
                className={`header__mobile-menu-item ${isDark ? 'header__mobile-menu-item--dark' : ''}`}
              >
                {t('common.login')}
              </button>
              <button
                onClick={() => navigateTo('/register')}
                className={`header__register-button ${isDark ? 'header__register-button--dark' : ''}`}
              >
                {t('common.register')}
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
