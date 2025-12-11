import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { subscriptionService } from '../api';
import { FiCheck, FiX } from 'react-icons/fi';

/**
 * Componente de gestión de suscripciones.
 * Muestra planes Free y Premium con características, permite upgrade/cancel
 * y maneja estado de suscripción actual del usuario.
 * @returns {JSX.Element} Interfaz completa de planes de suscripción.
 */
const Subscription = () => {
  /** Hook de traducción para internacionalización */
  const { t } = useTranslation();
  
  /** @type {[object|null, Function]} Datos de la suscripción actual del usuario */
  const [subscription, setSubscription] = useState(null);
  
  /** @type {[boolean, Function]} Estado de carga inicial de datos de suscripción */
  const [loading, setLoading] = useState(true);
  
  /** @type {[boolean, Function]} Indica si el usuario tiene acceso Premium activo */
  const [isPremium, setIsPremium] = useState(false);

  /**
   * Obtiene datos de suscripción y estado Premium desde la API.
   * Se memoiza con useCallback para evitar re-renders innecesarios.
   * @returns {Promise<void>}
   */
  const fetchSubscription = useCallback(async () => {
    try {
      /** Obtiene datos de suscripción actual */
      const response = await subscriptionService.getSubscription();
      setSubscription(response.data.subscription);
      
      /** Verifica acceso Premium activo */
      const premiumResponse = await subscriptionService.checkPremiumAccess();
      setIsPremium(premiumResponse.data.isPremium);
    } catch (error) {
      toast.error(t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  /**
   * Ejecuta fetchSubscription al montar el componente.
   * Dependencia: fetchSubscription memoizado.
   */
  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  /**
   * Inicia proceso de upgrade a plan Premium.
   * Redirige a URL de aprobación de pago de Stripe/PayPal.
   * @returns {Promise<void>}
   */
  const handleUpgrade = async () => {
    try {
      const response = await subscriptionService.createPayment({ plan: 'premium' });
      window.location.href = response.data.approvalUrl;
    } catch (error) {
      toast.error(t('errors.serverError'));
    }
  };

  /**
   * Cancela la suscripción actual con confirmación del usuario.
   * Recarga datos de suscripción tras cancelación exitosa.
   * @returns {Promise<void>}
   */
  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        await subscriptionService.cancelSubscription();
        toast.success('Subscription cancelled');
        fetchSubscription();
      } catch (error) {
        toast.error(t('errors.serverError'));
      }
    }
  };

  /**
   * Vista de carga con spinner centrado en pantalla completa.
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  /**
   * Array de planes disponibles (Free y Premium) con características.
   * Se genera dinámicamente con traducciones y estado actual.
   * @type {Array}
   */
  const plans = [
    {
      name: t('subscription.freePlan'),
      price: 'Free',
      features: [
        { name: t('subscription.customInterviews'), included: true },
        { name: t('subscription.voiceInterview'), included: true },
        { name: t('subscription.aiGeneratedQuestions'), included: true },
        { name: t('subscription.viewStatistics'), included: false },
        { name: t('subscription.downloadReports'), included: false }
      ],
      current: subscription?.plan === 'free',
      action: null
    },
    {
      name: t('subscription.premiumPlan'),
      price: '$9.99',
      period: t('subscription.perMonth'),
      features: [
        { name: t('subscription.customInterviews'), included: true },
        { name: t('subscription.voiceInterview'), included: true },
        { name: t('subscription.aiGeneratedQuestions'), included: true },
        { name: t('subscription.viewStatistics'), included: true },
        { name: t('subscription.downloadReports'), included: true }
      ],
      current: subscription?.plan === 'premium',
      action: isPremium ? 'cancel' : 'upgrade'
    }
  ];

  return (
    /**
     * Contenedor principal de la página de suscripciones.
     * Diseño responsive con Tailwind CSS y tema oscuro.
     */
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          {t('subscription.title')}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            /**
             * Tarjeta individual de plan con hover effects y estado actual.
             * @param {Object} plan - Datos del plan (Free/Premium).
             */
            <div
              key={index}
              className={`rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 ${
                plan.current
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white ring-2 ring-blue-300'
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className="p-8">
                <h2 className={`text-2xl font-bold mb-2 ${!plan.current && 'text-gray-800 dark:text-white'}`}>
                  {plan.name}
                </h2>
                <div className={`text-3xl font-bold mb-1 ${!plan.current && 'text-gray-800 dark:text-white'}`}>
                  {plan.price}
                </div>
                {plan.period && (
                  <p className={`text-sm mb-6 ${!plan.current && 'text-gray-600 dark:text-gray-400'}`}>
                    {plan.period}
                  </p>
                )}
                {plan.current && (
                  <div className="mb-6 bg-white bg-opacity-20 rounded px-3 py-2">
                    <p className="text-sm font-semibold">Current Plan</p>
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
                  disabled={plan.current || !plan.action}
                  className={`w-full py-3 rounded-lg font-bold mb-6 transition ${
                    plan.current
                      ? 'bg-white bg-opacity-20 cursor-default'
                      : plan.action === 'upgrade'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white hover:from-blue-700 hover:to-purple-800'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {plan.current ? 'Current Plan' : plan.action === 'upgrade' ? t('subscription.upgrade') : 'Cancel'}
                </button>
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {feature.included ? (
                        /**
                         * Icono check verde para características incluidas.
                         */
                        <FiCheck className={`text-xl ${plan.current ? 'text-white' : 'text-green-500'}`} />
                      ) : (
                        /**
                         * Icono cross rojo para características no incluidas.
                         */
                        <FiX className={`text-xl ${plan.current ? 'text-white text-opacity-50' : 'text-red-500'}`} />
                      )}
                      <span className={`text-sm ${!plan.current && 'text-gray-700 dark:text-gray-300'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {subscription?.endDate && (
          <div className="mt-8 bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-800 dark:text-blue-200">
              Subscription ends on: {new Date(subscription.endDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Exporta el componente Subscription como módulo por defecto.
 * @type {React.FC}
 */
export default Subscription;
