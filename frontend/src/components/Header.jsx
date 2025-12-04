import React from 'react';
import { FiMoon, FiSun, FiMenu, FiX, FiUser, FiClock } from 'react-icons/fi';
import { useHeader } from '../hooks/useHeader';
import '../assets/styles/Header.css';


const Header = () => {
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
            // Authenticated User Menu - Botón Perfil
            <>
              <button
                onClick={() => navigateTo('/settings')}
                className={`header__nav-button ${isDark ? 'header__nav-button--dark' : ''}`}
              >
                <FiUser />
                {t('settings.profile')}
              </button>


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
            // Non-Authenticated User Menu - Botones Login/Register
            <>
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
                <span>{t('common.register')}</span>
              </button>
            </>
          )}
        </div>


        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className={`header__mobile-button ${isDark ? 'header__mobile-button--dark' : ''}`}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>


      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`header__mobile-menu ${isDark ? 'header__mobile-menu--dark' : ''}`}>
          <div className="header__mobile-menu-content">
            {isAuthenticated ? (
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
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className={`header__language-select ${isDark ? 'header__language-select--dark' : ''}`}
                  style={{ marginTop: '0.5rem' }}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
                <button
                  onClick={handleThemeToggle}
                  className={`header__mobile-menu-button ${isDark ? 'header__mobile-menu-button--dark' : ''}`}
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
                  className={`header__mobile-menu-button ${isDark ? 'header__mobile-menu-button--dark' : ''}`}
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
                  className={`header__mobile-menu-item ${isDark ? 'header__mobile-menu-item--dark' : ''}`}
                >
                  {t('common.register')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


export default Header;
