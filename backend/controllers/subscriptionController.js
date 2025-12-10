/**
 * Controlador de suscripciones y pagos.
 *
 * Gestiona la integración con PayPal para crear y ejecutar pagos,
 * así como la creación, consulta, cancelación y validación del estado
 * de la suscripción de un usuario.
 *
 * @module controllers/subscriptionController
 */

const Subscription = require('../models/Subscription');
const User = require('../models/User');
const axios = require('axios');

/**
 * Endpoint base de la API de PayPal según el modo configurado.
 * Usa el entorno sandbox por defecto y el entorno live en producción.
 * @type {string}
 */s
const PAYPAL_API = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api.paypal.com' 
  : 'https://api.sandbox.paypal.com';

/**
 * Obtiene un access token de PayPal usando OAuth2 client_credentials.
 *
 * Requiere:
 * - PAYPAL_CLIENT_ID en process.env.
 * - PAYPAL_SECRET en process.env.
 *
 * @async
 * @returns {Promise<string>} Access token de PayPal.
 * @throws {Error} Si no se puede obtener el token de PayPal.
 */
const getPayPalAccessToken = async () => {
  try {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');
    
    const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('PayPal token error:', error);
    throw new Error('Failed to get PayPal access token');
  }
};

/**
 * Crea un pago de PayPal para una suscripción premium.
 *
 * Body:
 * - plan {string} Debe ser 'premium'.
 *
 * Requiere:
 * - PAYPAL_CLIENT_ID, PAYPAL_SECRET y FRONTEND_URL configurados.
 *
 * Respuesta:
 * - 200: { approvalUrl, paymentId } URL de aprobación de PayPal y ID del pago.
 * - 400: Plan no válido.
 * - 500: Error al crear el pago.
 *
 * @async
 * @param {import('express').Request} req - Petición HTTP.
 * @param {import('express').Response} res - Respuesta HTTP.
 * @returns {Promise<void>}
 */
exports.createPayment = async (req, res) => {
  try {
    const { plan } = req.body;

    if (plan !== 'premium') {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    const priceMap = {
      premium: '9.99'
    };

    const price = priceMap[plan];

    const paymentData = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      },
      transactions: [
        {
          amount: {
            total: price,
            currency: 'USD',
            details: {
              subtotal: price,
              tax: '0',
              shipping: '0'
            }
          },
          description: `Premium Subscription - ${plan}`,
          item_list: {
            items: [
              {
                name: 'Premium Interview Package',
                sku: plan,
                price: price,
                currency: 'USD',
                quantity: 1
              }
            ]
          }
        }
      ]
    };

    const token = await getPayPalAccessToken();

    const response = await axios.post(`${PAYPAL_API}/v1/payments/payment`, paymentData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const approvalUrl = response.data.links.find(link => link.rel === 'approval_url');
    
    res.status(200).json({
      approvalUrl: approvalUrl.href,
      paymentId: response.data.id
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
};

/**
 * Ejecuta un pago de PayPal previamente aprobado por el usuario
 * y crea/actualiza la suscripción premium del usuario.
 *
 * Body:
 * - paymentId {string} ID del pago devuelto por PayPal.
 * - payerId {string} ID del pagador (PayerID) devuelto por PayPal.
 *
 * Efectos:
 * - Crea o actualiza el documento Subscription del usuario.
 * - Establece plan='premium', status='active', fechas de inicio/fin y renovación.
 * - Guarda precio, moneda y features disponibles.
 * - Actualiza el usuario con subscription y subscriptionStatus='premium'.
 *
 * Respuesta:
 * - 200: { message, subscription, transactionId }
 * - 500: Error al ejecutar el pago o actualizar la suscripción.
 *
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.executePayment = async (req, res) => {
  try {
    const { paymentId, payerId } = req.body;

    const token = await getPayPalAccessToken();

    const response = await axios.post(
      `${PAYPAL_API}/v1/payments/payment/${paymentId}/execute`,
      { payer_id: payerId },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const payment = response.data;
    const transactionId = payment.transactions[0].related_resources[0].sale.id;

    let subscription = await Subscription.findOne({ userId: req.userId });

    if (!subscription) {
      subscription = new Subscription({ userId: req.userId });
    }

    subscription.plan = 'premium';
    subscription.status = 'active';
    subscription.paypalTransactionId = transactionId;
    subscription.paypalSubscriptionId = payment.id;
    subscription.startDate = Date.now();
    subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    subscription.renewalDate = subscription.endDate;
    subscription.price = parseFloat(payment.transactions[0].amount.total);
    subscription.currency = payment.transactions[0].amount.currency;
    subscription.features = {
      downloadReports: true,
      viewStatistics: true,
      customInterviews: true,
      voiceInterview: true,
      aiGeneratedQuestions: true
    };

    await subscription.save();

    const user = await User.findById(req.userId);
    user.subscription = subscription._id;
    user.subscriptionStatus = 'premium';
    await user.save();

    res.status(200).json({
      message: 'Payment successful',
      subscription,
      transactionId
    });
  } catch (error) {
    console.error('Execute payment error:', error);
    res.status(500).json({ message: 'Error executing payment', error: error.message });
  }
};

/**
 * Obtiene la suscripción actual del usuario.
 *
 * Si el usuario no tiene suscripción en BD, se devuelve un objeto
 * virtual de plan 'free' con las características correspondientes
 * y la fecha de fin de prueba gratuita (freeTrialEndDate).
 *
 * Requiere:
 * - req.userId establecido por autenticación.
 *
 * Respuesta:
 * - 200: { subscription }
 *   donde subscription incluye al menos:
 *   - plan {'free'|'premium'}
 *   - status {string}
 *   - features {Object} mapa de flags de funcionalidad.
 * - 500: Error al consultar la suscripción.
 *
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.getSubscription = async (req, res) => {
  try {
    let subscription = await Subscription.findOne({ userId: req.userId });

    if (!subscription) {
      const user = await User.findById(req.userId);
      subscription = {
        plan: 'free',
        status: 'active',
        freeTrialEndDate: user.freeTrialEndDate,
        features: {
          downloadReports: false,
          viewStatistics: false,
          customInterviews: true,
          voiceInterview: true,
          aiGeneratedQuestions: true
        }
      };
    }

    res.status(200).json({ subscription });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ message: 'Error fetching subscription', error: error.message });
  }
};

/**
 * Cancela la suscripción premium del usuario.
 *
 * Efectos:
 * - Actualiza Subscription: status='cancelled', endDate=Date.now().
 * - Actualiza User: subscriptionStatus='free', subscription=null.
 *
 * Requiere:
 * - req.userId establecido.
 *
 * Respuesta:
 * - 200: { message }
 * - 404: Suscripción no encontrada.
 * - 500: Error al cancelar la suscripción.
 *
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.userId });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.status = 'cancelled';
    subscription.endDate = Date.now();
    await subscription.save();

    const user = await User.findById(req.userId);
    user.subscriptionStatus = 'free';
    user.subscription = null;
    await user.save();

    res.status(200).json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Error cancelling subscription', error: error.message });
  }
};
/**
 * Comprueba si el usuario tiene acceso premium y qué features están activas.
 *
 * Requiere:
 * - req.userId establecido.
 *
 * Respuesta:
 * - 200: {
 *     isPremium: boolean,
 *     subscriptionStatus: string,
 *     features: {
 *       downloadReports?: boolean,
 *       viewStatistics?: boolean,
 *       customInterviews?: boolean,
 *       voiceInterview?: boolean,
 *       aiGeneratedQuestions?: boolean
 *     }
 *   }
 * - 404: Usuario no encontrado.
 * - 500: Error al comprobar el estado premium.
 *
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.checkPremiumAccess = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('subscription');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPremium = user.subscriptionStatus === 'premium';

    res.status(200).json({
      isPremium,
      subscriptionStatus: user.subscriptionStatus,
      features: user.subscription?.features || {
        downloadReports: false,
        viewStatistics: false
      }
    });
  } catch (error) {
    console.error('Check premium error:', error);
    res.status(500).json({ message: 'Error checking premium status', error: error.message });
  }
};
