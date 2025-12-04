import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore, useThemeStore, useLanguageStore } from './index';
import { FiLogOut, FiMoon, FiSun, FiGlobe, FiMenu, FiX, FiUser } from 'react-icons/fi';
import { useState } from 'react';


const Header = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout
  }));
  const { isDark, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };


  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };


  const handleThemeToggle = () => {
    toggleTheme();
  };


  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="hidden sm:inline font-bold text-lg text-gray-800 dark:text-white">
              {t('common.appName')}
            </span>
          </div>


          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
            </select>


            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {isDark ? (
                <FiSun className="text-yellow-500 text-xl" />
              ) : (
                <FiMoon className="text-gray-700 text-xl" />
              )}
            </button>


            {/* User Info */}
            {user && (
              <button
                onClick={() => navigate('/settings')}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center justify-center"
                title="Configuración de usuario"
              >
                <FiUser className="text-xl text-gray-700 dark:text-gray-300" />
              </button>
            )}




            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              <FiLogOut /> {t('common.logout')}
            </button>
          </div>


          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>


        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-4">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>


            <button
              onClick={handleThemeToggle}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              {isDark ? <FiSun /> : <FiMoon />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>


            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              <FiLogOut /> {t('common.logout')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};


export default Header;
