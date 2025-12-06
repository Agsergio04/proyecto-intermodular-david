import React from 'react';
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
        <li key={i} className={`pricing-card__feature ${featured ? 'pricing-card__feature--featured' : isDark ? 'pricing-card__feature--dark' : ''}`}>
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
