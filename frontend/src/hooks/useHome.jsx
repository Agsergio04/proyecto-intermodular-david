import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const useHome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  const navigateToRegister = () => {
    navigate('/register');
  };

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
    t,
    isAuthenticated,
    navigateToRegister,
    freePlan,
    premiumPlan
  };
};
