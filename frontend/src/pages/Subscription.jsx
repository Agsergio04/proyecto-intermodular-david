import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { subscriptionService } from '../api';
import { FiCheck, FiX, FiStar, FiZap, FiTrendingUp, FiAward } from 'react-icons/fi';
import { useThemeStore } from '../store';
import '../assets/styles/Subscription.css';


const Subscription = () => {
  const { t } = useTranslation();
  const { isDark } = useThemeStore();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [processing, setProcessing] = useState(false);


  const fetchSubscription = useCallback(async () => {
    try {
      const response = await subscriptionService.getSubscription();
      setSubscription(response.data.subscription);
     
      const premiumResponse = await subscriptionService.checkPremiumAccess();
      setIsPremium(premiumResponse.data.isPremium);
    } catch (error) {
      toast.error(t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  }, [t]);


  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);


  const handleUpgrade = async () => {
    setProcessing(true);
    try {
      const response = await subscriptionService.createPayment({ plan: 'premium' });
      window.location.href = response.data.approvalUrl;
    } catch (error) {
      toast.error(t('errors.serverError'));
      setProcessing(false);
    }
  };


  const handleCancel = async () => {
    if (window.confirm(t('subscription.confirmCancel') || '¿Estás seguro de que quieres cancelar tu suscripción?')) {
      setProcessing(true);
      try {
        await subscriptionService.cancelSubscription();
        toast.success(t('subscription.cancelSuccess') || 'Suscripción cancelada');
        fetchSubscription();
      } catch (error) {
        toast.error(t('errors.serverError'));
      } finally {
        setProcessing(false);
      }
    }
  };


  if (loading) {
    return (
      <div className="subscription">
        <div className="subscription__loading">
          <div className="subscription__spinner"></div>
        </div>
      </div>
    );
  }


  const plans = [
    {
      name: t('subscription.freePlan') || 'Plan Gratuito',
      price: '0',
      period: t('subscription.perMonth') || '/mes',
      description: t('subscription.freeDescription') || 'Acceso básico y limitado a preguntas AI',
      icon: FiStar,
      features: [
        { name: t('subscription.limitedAI') || 'Preguntas AI limitadas', included: true },
        { name: t('subscription.basicInterviews') || 'Gestión básica de entrevistas', included: true },
        { name: t('subscription.noAdvancedStats') || 'Sin estadísticas avanzadas', included: false },
        { name: t('subscription.unlimitedAI') || 'Preguntas AI ilimitadas', included: false },
        { name: t('subscription.advancedStats') || 'Estadísticas avanzadas', included: false },
        { name: t('subscription.reportDownload') || 'Descarga de informes', included: false },
        { name: t('subscription.prioritySupport') || 'Prioridad de soporte', included: false }
      ],
      current: subscription?.plan === 'free',
      action: null,
      popular: false
    },
    {
      name: t('subscription.premiumPlan') || 'Premium',
      price: '7.99',
      period: t('subscription.perMonth') || '/mes',
      description: t('subscription.premiumDescription') || 'Acceso completo a todas las funciones',
      icon: FiZap,
      features: [
        { name: t('subscription.unlimitedAI') || 'Preguntas AI ilimitadas', included: true },
        { name: t('subscription.advancedStats') || 'Estadísticas avanzadas', included: true },
        { name: t('subscription.reportDownload') || 'Descarga de informes', included: true },
        { name: t('subscription.prioritySupport') || 'Prioridad de soporte', included: true }
      ],
      current: subscription?.plan === 'premium',
      action: isPremium ? 'cancel' : 'upgrade',
      popular: true
    }
  ];


  return (
    <div className={`subscription ${isDark ? 'subscription--dark' : ''}`}>
      <div className="subscription__container">
        {/* Header */}
        <div className="subscription__header">
          <h1 className={`subscription__title ${isDark ? 'subscription__title--dark' : ''}`}>
            {t('subscription.title') || 'Suscripción'}
          </h1>
          <p className={`subscription__subtitle ${isDark ? 'subscription__subtitle--dark' : ''}`}>
            {t('subscription.subtitle') || 'Elige el plan que mejor se adapte a tus necesidades'}
          </p>
        </div>


        {/* Pricing Cards */}
        <div className="subscription__grid">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`subscription__card ${
                  plan.popular ? 'subscription__card--popular' : ''
                } ${plan.current ? 'subscription__card--current' : ''} ${
                  isDark ? 'subscription__card--dark' : ''
                }`}
              >
                {plan.popular && (
                  <div className="subscription__badge">
                    <FiAward className="subscription__badge-icon" />
                    <span>{t('subscription.mostPopular') || 'Más popular'}</span>
                  </div>
                )}


                <div className="subscription__card-header">
                  <div className={`subscription__card-icon ${isDark ? 'subscription__card-icon--dark' : ''}`}>
                    <Icon />
                  </div>
                  <h2 className={`subscription__card-title ${isDark ? 'subscription__card-title--dark' : ''}`}>
                    {plan.name}
                  </h2>
                  <p className={`subscription__card-description ${isDark ? 'subscription__card-description--dark' : ''}`}>
                    {plan.description}
                  </p>
                </div>


                <div className="subscription__price">
                  <span className="subscription__price-currency">€</span>
                  <span className={`subscription__price-amount ${isDark ? 'subscription__price-amount--dark' : ''}`}>
                    {plan.price}
                  </span>
                  <span className={`subscription__price-period ${isDark ? 'subscription__price-period--dark' : ''}`}>
                    {plan.period}
                  </span>
                </div>


                {plan.current && (
                  <div className="subscription__current-badge">
                    <FiTrendingUp />
                    <span>{t('subscription.currentPlan') || 'Plan actual'}</span>
                  </div>
                )}


                <button
                  onClick={() => {
                    if (plan.action === 'upgrade') {
                      handleUpgrade();
                    } else if (plan.action === 'cancel') {
                      handleCancel();
                    }
                  }}
                  disabled={plan.current || !plan.action || processing}
                  className={`subscription__button ${
                    plan.current
                      ? 'subscription__button--disabled'
                      : plan.action === 'upgrade'
                      ? 'subscription__button--upgrade'
                      : 'subscription__button--cancel'
                  }`}
                >
                  {processing ? (
                    <>
                      <span className="subscription__button-spinner"></span>
                      {t('common.processing') || 'Procesando...'}
                    </>
                  ) : plan.current ? (
                    t('subscription.currentPlan') || 'Plan actual'
                  ) : plan.action === 'upgrade' ? (
                    t('subscription.upgrade') || 'Upgradear a premium'
                  ) : (
                    t('subscription.cancel') || 'Cancelar suscripción'
                  )}
                </button>


                <ul className="subscription__features">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`subscription__feature ${
                        !feature.included ? 'subscription__feature--disabled' : ''
                      }`}
                    >
                      <div className={`subscription__feature-icon ${
                        feature.included
                          ? 'subscription__feature-icon--included'
                          : 'subscription__feature-icon--excluded'
                      }`}>
                        {feature.included ? <FiCheck /> : <FiX />}
                      </div>
                      <span className={`subscription__feature-text ${
                        isDark ? 'subscription__feature-text--dark' : ''
                      }`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>


        {/* End Date Notice */}
        {subscription?.endDate && (
          <div className={`subscription__notice ${isDark ? 'subscription__notice--dark' : ''}`}>
            <FiTrendingUp className="subscription__notice-icon" />
            <p className={`subscription__notice-text ${isDark ? 'subscription__notice-text--dark' : ''}`}>
              {t('subscription.endsOn') || 'Tu suscripción finaliza el'}: {' '}
              <strong>{new Date(subscription.endDate).toLocaleDateString('es-ES')}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


export default Subscription;
