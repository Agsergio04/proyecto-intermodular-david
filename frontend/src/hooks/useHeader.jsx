/**
 * Custom hook para gestionar el header de la aplicación.
 * Maneja autenticación, tema oscuro/claro, idioma, menú móvil y navegación.
 * 
 * @module useHeader
 * @returns {Object} Estado y handlers del header
 * @example
 * const {
 *   isAuthenticated, isDark, language, mobileMenuOpen,
 *   handleLanguageChange, handleThemeToggle, navigateTo
 * } = useHeader();
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore, useLanguageStore } from '../store';

export const useHeader = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(/** @type {boolean} */ false);

  const { isDark, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();

  /**
   * Estado de autenticación basado en token del localStorage.
   * @type {boolean}
   */
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  /**
   * Cambia el idioma de la aplicación.
   * Actualiza tanto el store como react-i18next.
   * @param {'en'|'es'|'fr'|string} lang - Código del idioma
   * @returns {void}
   */
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  /**
   * Alterna entre tema oscuro y claro.
   * @returns {void}
   */
  const handleThemeToggle = () => {
    toggleTheme();
  };

  /**
   * Alterna visibilidad del menú móvil.
   * @returns {void}
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  /**
   * Navega a una ruta específica y cierra menú móvil.
   * @param {string} path - Ruta de destino
   * @returns {void}
   */
  const navigateTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return {
    /**
     * @type {boolean} Usuario autenticado (token presente)
     */
    isAuthenticated,
    
    /**
     * @type {boolean} Tema oscuro activado
     */
    isDark,
    
    /**
     * @type {string} Idioma actual ('en', 'es', etc.)
     */
    language,
    
    /**
     * @type {boolean} Menú móvil abierto
     */
    mobileMenuOpen,
    
    /**
     * @type {import('react-i18next').TFunction} Función de traducción
     */
    t,
    
    /**
     * @type {Function} Handler para cambio de idioma
     */
    handleLanguageChange,
    
    /**
     * @type {Function} Handler para alternar tema
     */
    handleThemeToggle,
    
    /**
     * @type {Function} Handler para menú móvil
     */
    toggleMobileMenu,
    
    /**
     * @type {Function} Handler para navegación
     */
    navigateTo
  };
};
