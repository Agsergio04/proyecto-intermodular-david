import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore, useLanguageStore } from '../store';

export const useHeader = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isDark, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();

  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return {
    isAuthenticated,
    isDark,
    language,
    mobileMenuOpen,
    t,
    handleLanguageChange,
    handleThemeToggle,
    toggleMobileMenu,
    navigateTo
  };
};

