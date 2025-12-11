/**
 * Custom hook para la página de inicio.
 * Maneja autenticación, navegación a registro y planes de precios internacionalizados.
 * 
 * @module useHome
 * @returns {Object} Estado y datos de la página principal
 * @example
 * const {
 *   isAuthenticated, freePlan, premiumPlan,
 *   navigateToRegister, t
 * } = useHome();
 */

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const useHome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  /**
   * Navega a la página de registro.
   * @returns {void}
   */
  const navigateToRegister = () => {
    navigate('/register');
  };

  /**
   * Plan gratuito con características básicas.
   * @type {Object}
   * @property {string} plan - Nombre del plan traducido
   * @property {string} price - Precio ($0)
   * @property {string[]} features - Lista de características traducidas
   * @property {string} cta - Texto del botón de acción
   * @property {boolean} featured - Plan destacado (false)
   */
  const freePlan = {
    plan: t('home.freePlan'),
    price: '$0',
    features: [
      t('home.freeFeature1'),
      t('home.freeFeature2'),
      t('home.freeFeature3')
    ],
    cta: t('home.getStarted'),
    featured: false
  };

  /**
   * Plan premium con características avanzadas.
   * @type {Object}
   * @property {string} plan - Nombre del plan traducido
   * @property {string} price - Precio ($9.99)
   * @property {string} period - Período de facturación traducido
   * @property {string[]} features - Lista de características traducidas
   * @property {string} cta - Texto del botón de acción
   * @property {boolean} featured - Plan destacado (true)
   */
  const premiumPlan = {
    plan: t('home.premiumPlan'),
    price: '$9.99',
    period: t('home.perMonth'),
    features: [
      t('home.premiumFeature1'),
      t('home.premiumFeature2'),
      t('home.premiumFeature3'),
      t('home.premiumFeature4'),
      t('home.premiumFeature5')
    ],
    cta: t('home.upgradeToPremium'),
    featured: true
  };

  return {
    /**
     * @type {import('react-i18next').TFunction} Función de traducción
     */
    t,
    
    /**
     * @type {boolean} Usuario autenticado (token presente)
     */
    isAuthenticated,
    
    /**
     * @type {Function} Navega a página de registro
     */
    navigateToRegister,
    
    /**
     * @type {Object} Configuración del plan gratuito
     */
    freePlan,
    
    /**
     * @type {Object} Configuración del plan premium
     */
    premiumPlan
  };
};
