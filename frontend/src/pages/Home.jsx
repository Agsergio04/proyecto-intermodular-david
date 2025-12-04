import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiMic, FiBarChart2, FiLock } from 'react-icons/fi';
import { useHome } from '../hooks/useHome';
import { useThemeStore } from '../store';
import '../assets/styles/Home.css';


const Home = () => {
  const { t } = useTranslation();
  const { isDark } = useThemeStore();
  const {
    isAuthenticated,
    navigateToRegister
  } = useHome();


  const freePlan = {
    plan: t('home.freePlan'),
    price: t('home.freePrice'),
    period: t('home.freePeriod'),
    features: t('home.freeFeatures', { returnObjects: true }),
    cta: t('home.freeButton'),
    featured: false
  };


  const premiumPlan = {
    plan: t('home.premiumPlan'),
    price: t('home.premiumPrice'),
    period: t('home.premiumPeriod'),
    features: t('home.premiumFeatures', { returnObjects: true }),
    cta: t('home.premiumButton'),
    featured: true
  };


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
              title={t('home.voiceInterviews')}
              description={t('home.voiceInterviewsDesc')}
            />
            <FeatureCard
              icon={<FiBarChart2 className="text-3xl" />}
              title={t('home.analyticsTracking')}
              description={t('home.analyticsTrackingDesc')}
            />
            <FeatureCard
              icon={<FiLock className="text-3xl" />}
              title={t('home.securePrivate')}
              description={t('home.securePrivateDesc')}
            />
          </div>
        </div>
      </section>


      {/* Pricing Section */}
      <section className="home__pricing">
        <div className="home__pricing-container">
          <h3 className={`home__pricing-title ${isDark ? 'home__pricing-title--dark' : ''}`}>
            {t('home.pricingTitle')}
          </h3>
          <div className="home__pricing-grid">
            <PricingCard {...freePlan} />
            <PricingCard {...premiumPlan} />
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="home__cta">
        <div className="home__cta-container">
          <h3 className="home__cta-title">
            {t('home.ctaTitle')}
          </h3>
          <p className="home__cta-description">
            {t('home.ctaDescription')}
          </p>
          {!isAuthenticated && (
            <button
              onClick={navigateToRegister}
              className="home__cta-button"
            >
              {t('home.ctaButton')}
            </button>
          )}
        </div>
      </section>


      {/* Footer */}
      <footer className="home__footer">
        <div className="home__footer-container">
          <p>{t('home.footerCopyright')}</p>
        </div>
      </footer>
    </div>
  );
};


const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card feature-card--dark">
    <div className="feature-card__icon">
      {icon}
    </div>
    <h4 className="feature-card__title feature-card__title--dark">
      {title}
    </h4>
    <p className="feature-card__description feature-card__description--dark">
      {description}
    </p>
  </div>
);


const PricingCard = ({ plan, price, period, features, cta, featured }) => (
  <div className={`pricing-card ${featured ? 'pricing-card--featured' : 'pricing-card--dark'}`}>
    <h4 className={`pricing-card__plan ${featured ? 'pricing-card__plan--featured' : 'pricing-card__plan--dark'}`}>
      {plan}
    </h4>
    <div className={`pricing-card__price ${featured ? 'pricing-card__price--featured' : 'pricing-card__price--dark'}`}>
      {price}
    </div>
    {period && (
      <p className={`pricing-card__period ${featured ? 'pricing-card__period--featured' : 'pricing-card__period--dark'}`}>
        {period}
      </p>
    )}
    <ul className="pricing-card__features">
      {features.map((feature, i) => (
        <li key={i} className={`pricing-card__feature ${featured ? 'pricing-card__feature--featured' : 'pricing-card__feature--dark'}`}>
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
