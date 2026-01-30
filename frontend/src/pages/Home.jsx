/**
 * Página de inicio de la aplicación.
 * Muestra hero, características, planes de precios y llamadas a la acción, respetando el tema claro/oscuro.
 *
 * @module Home
 * @returns {JSX.Element} Componente de la página principal
 */

import React from 'react';
/**
 * Home page
 * Public landing with pricing and CTA. Uses `useHome` hook for plans and navigation.
 * @module pages/Home
 */
import { FiArrowRight, FiMic, FiBarChart2, FiLock } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useHome } from '../hooks/useHome';
import { useThemeStore } from '../store';
import '../assets/styles/Home.css';

const Home = () => {
  const { t } = useTranslation();
  const { isDark } = useThemeStore();
  const {
    isAuthenticated,
    navigateToRegister,
    freePlan,
    premiumPlan
  } = useHome();

  return (
    <div className={`home ${isDark ? 'home--dark' : ''}`}>
      {/* Hero Section */}
      <section className="home__hero">
        <h2 className={`home__hero-title ${isDark ? 'home__hero-title--dark' : ''}`}>
          {t('home.heroTitle')}
        </h2>
        <p className={`home__hero-description ${isDark ? 'home__hero-description--dark' : ''}`}>
          {t('home.heroDescription')}
        </p>
        {!isAuthenticated && (
          <button
            onClick={navigateToRegister}
            className="home__hero-button"
          >
            {t('home.getStartedFree')} <FiArrowRight />
          </button>
        )}
      </section>

      {/* Features Section */}
      <section className={`home__features ${isDark ? 'home__features--dark' : ''}`}>
        <div className="home__features-container">
          <h3 className={`home__features-title ${isDark ? 'home__features-title--dark' : ''}`}>
            {t('home.featuresTitle')}
          </h3>
          <div className="home__features-grid">
            <FeatureCard
              icon={<FiMic className="text-3xl" />}
              title={t('home.voiceInterviewsTitle')}
              description={t('home.voiceInterviewsDesc')}
              isDark={isDark}
            />
            <FeatureCard
              icon={<FiBarChart2 className="text-3xl" />}
              title={t('home.analyticsTitle')}
              description={t('home.analyticsDesc')}
              isDark={isDark}
            />
            <FeatureCard
              icon={<FiLock className="text-3xl" />}
              title={t('home.secureTitle')}
              description={t('home.secureDesc')}
              isDark={isDark}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={`home__pricing ${isDark ? 'home__pricing--dark' : ''}`}>
        <div className="home__pricing-container">
          <h3 className={`home__pricing-title ${isDark ? 'home__pricing-title--dark' : ''}`}>
            {t('home.pricingTitle')}
          </h3>
          <div className="home__pricing-grid">
            <PricingCard {...freePlan} isDark={isDark} />
            <PricingCard {...premiumPlan} isDark={isDark} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`home__cta ${isDark ? 'home__cta--dark' : ''}`}>
        <div className="home__cta-container">
          <h3 className={`home__cta-title ${isDark ? 'home__cta-title--dark' : ''}`}>
            {t('home.ctaTitle')}
          </h3>
          <p className={`home__cta-description ${isDark ? 'home__cta-description--dark' : ''}`}>
            {t('home.ctaDescription')}
          </p>
          {!isAuthenticated && (
            <button
              onClick={navigateToRegister}
              className="home__cta-button"
            >
              {t('home.getStartedNow')}
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={`home__footer ${isDark ? 'home__footer--dark' : ''}`}>
        <div className="home__footer-container">
          <p>{t('home.footerRights')}</p>
        </div>
      </footer>
    </div>
  );
};

/**
 * Tarjeta de característica de la sección de features.
 *
 * @param {Object} props - Propiedades del componente
 * @param {JSX.Element} props.icon - Icono representativo de la característica
 * @param {string} props.title - Título de la característica
 * @param {string} props.description - Descripción de la característica
 * @param {boolean} props.isDark - Indica si el tema oscuro está activo
 * @returns {JSX.Element} Tarjeta de feature estilizada
 */
const FeatureCard = ({ icon, title, description, isDark }) => (
  <div className={`feature-card ${isDark ? 'feature-card--dark' : ''}`}>
    <div className="feature-card__icon">
      {icon}
    </div>
    <h4 className={`feature-card__title ${isDark ? 'feature-card__title--dark' : ''}`}>
      {title}
    </h4>
    <p className={`feature-card__description ${isDark ? 'feature-card__description--dark' : ''}`}>
      {description}
    </p>
  </div>
);

/**
 * Tarjeta de precios para mostrar un plan (free o premium).
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.plan - Nombre del plan
 * @param {string} props.price - Precio del plan (por ejemplo "$0" o "$9.99")
 * @param {string} [props.period] - Periodo de facturación (por ejemplo "/mes")
 * @param {string[]} props.features - Lista de características del plan
 * @param {string} props.cta - Texto del botón de llamada a la acción
 * @param {boolean} props.featured - Indica si el plan es destacado (premium)
 * @param {boolean} props.isDark - Indica si el tema oscuro está activo
 * @returns {JSX.Element} Tarjeta de plan de precios
 */
const PricingCard = ({ plan, price, period, features, cta, featured, isDark }) => (
  <div className={`pricing-card ${featured ? 'pricing-card--featured' : isDark ? 'pricing-card--dark' : ''}`}>
    <h4 className={`pricing-card__plan ${featured ? 'pricing-card__plan--featured' : isDark ? 'pricing-card__plan--dark' : ''}`}>
      {plan}
    </h4>
    <div className={`pricing-card__price ${featured ? 'pricing-card__price--featured' : isDark ? 'pricing-card__price--dark' : ''}`}>
      {price}
    </div>
    {period && (
      <p className={`pricing-card__period ${featured ? 'pricing-card__period--featured' : isDark ? 'pricing-card__period--dark' : ''}`}>
        {period}
      </p>
    )}
    <ul className="pricing-card__features">
      {features.map((feature, i) => (
        <li
          key={i}
          className={`pricing-card__feature ${featured ? 'pricing-card__feature--featured' : isDark ? 'pricing-card__feature--dark' : ''}`}
        >
          {feature}
        </li>
      ))}
    </ul>
    <button className={`pricing-card__button ${featured ? 'pricing-card__button--premium' : 'pricing-card__button--free'}`}>
      {cta}
    </button>
  </div>
);

export default Home;
