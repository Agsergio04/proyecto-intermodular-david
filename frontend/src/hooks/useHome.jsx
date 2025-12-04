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


  const features = [
    {
      icon: 'FiMic',
      title: 'Voice Interviews',
      description: 'Practice with real-time voice interaction and get transcribed feedback'
    },
    {
      icon: 'FiBarChart2',
      title: 'Analytics & Tracking',
      description: 'Monitor your progress with detailed statistics and performance trends'
    },
    {
      icon: 'FiLock',
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure with industry-standard security'
    }
  ];


  const freePlan = {
    plan: 'Free',
    price: '$0',
    features: [
      'Unlimited voice interviews',
      'AI-generated questions',
      '7 days free trial',
      'Basic feedback'
    ],
    cta: 'Start Free',
    featured: false
  };


  const premiumPlan = {
    plan: 'Premium',
    price: '$9.99',
    period: 'per month',
    features: [
      'Everything in Free',
      'Download reports',
      'Advanced analytics',
      'Priority support'
    ],
    cta: 'Upgrade Now',
    featured: true
  };


  return {
    t,
    isAuthenticated,
    navigateToRegister,
    features,
    freePlan,
    premiumPlan
  };
};
