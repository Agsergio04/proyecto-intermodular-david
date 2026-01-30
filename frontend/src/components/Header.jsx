/**
 * @fileoverview Header / Navbar component for the application.
 * Provides global navigation, auth actions, language and theme controls.
 * Responsive: adapts for mobile (hamburger menu) and desktop layouts.
 *
 * Features:
 * - Conditional navigation (authenticated vs unauthenticated)
 * - Language selector (EN, ES, FR, DE)
 * - Dark / Light theme toggle
 * - Mobile hamburger menu
 * - Hides navigation during an active interview session
 * - Integrates with `useHeader` hook for global state
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
 * Main Header / Navbar component.
 *
 * Structure:
 * 1. Logo section: clickable logo navigates to home (/)
 * 2. Desktop menu:
 *    - Authenticated users: Interviews/Settings, language, theme
 *    - Unauthenticated users: language, theme, login/register
 * 3. Mobile button: hamburger to open/close mobile menu
 * 4. Mobile menu: responsive version of the desktop menu
 *
 * Special behavior:
 * - When on an interview session route (pathname=/interview/:id) navigation buttons are hidden
 * - Supports four languages via a dropdown
 * - Theme toggle persisted in localStorage (dark/light)
 * - Responsive: desktop menu on wide screens, hamburger on mobile
 *
 * State (from `useHeader` hook):
 * - `isAuthenticated`: boolean
 * - `isDark`: boolean (dark theme active)
 * - `language`: language code ('en'|'es'|'fr'|'de')
 * - `mobileMenuOpen`: boolean
 *
 * @component
 * @returns {React.ReactElement} Header with global navigation and user options
 * @example
 * <Header />
 */
const Header = () => {
  /**
   * Get the current route to detect if we are in an interview session.
   * @type {Object} location - react-router location object
   */
  const location = useLocation();
  
  /**
   * Values and functions extracted from the `useHeader` hook.
   * This hook manages global auth, theme, language and navigation state.
   *
   * @type {Object}
   * @property {boolean} isAuthenticated
   * @property {boolean} isDark
   * @property {string} language
   * @property {boolean} mobileMenuOpen
   * @property {Function} t - translation function
   * @property {Function} handleLanguageChange
   * @property {Function} handleThemeToggle
   * @property {Function} toggleMobileMenu
   * @property {Function} navigateTo
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
   * Detect if the user is inside an active interview session route.
   * This is used to hide navigation buttons to keep focus on the interview.
   * @type {boolean}
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
               * Authenticated user menu.
               *
               * Components:
               * 1. Navigation buttons (Interviews/Settings): hidden when `isInInterviewSession === true`
               * 2. Language selector (EN/ES/FR/DE)
               * 3. Theme toggle (Sun for light, Moon for dark)
               */
            <>
              {/* Hide navigation buttons during an active interview session */}
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
             * Unauthenticated user menu.
             *
             * Components:
             * 1. Language selector
             * 2. Theme toggle
             * 3. Login button -> /login
             * 4. Register button -> /register
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
         * Mobile menu button (hamburger).
         * Visible only on small screens (controlled via CSS media queries).
         *
         * Behavior:
         * - Shows `FiX` icon when menu is open
         * - Shows `FiMenu` (hamburger) when menu is closed
         * - `onClick={toggleMobileMenu}` opens/closes the dropdown menu
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
       * Responsive mobile menu.
       * Visible when `mobileMenuOpen === true` on small screens.
       *
       * Structure:
       * - Authenticated users: navigation buttons (hidden during interview), language selector, theme toggle
       * - Unauthenticated users: language selector, theme toggle, login/register
       *
       * Note: menu closes automatically on navigation (navigateTo triggers toggleMobileMenu)
       */}
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`header__mobile-menu ${isDark ? 'header__mobile-menu--dark' : ''}`}>
          {isAuthenticated ? (
            <>
              {/* Hide navigation buttons on mobile during interview session */}
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
