/**
 * @fileoverview Rutas de suscripciones y pagos (`/api/subscriptions`).
 * @module routes/subscriptions
 * @description Gestión completa de suscripciones premium, pagos Stripe y acceso privilegiado.
 * @author Tu Nombre
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const subscriptionController = require('../controllers/subscriptionController');

/**
 * @typedef {Object} CreatePaymentRequest
 * @property {string} plan - Plan a contratar ('premium')
 * @property {string} [paymentMethod] - Método de pago opcional ('card', 'paypal')
 */

/**
 * @typedef {Object} CreatePaymentResponse
 * @property {string} sessionId - ID de sesión Stripe
 * @property {string} url - URL de checkout Stripe
 * @property {number} price - Precio
 * @property {string} currency - Moneda ('EUR', 'USD')
 */

/**
 * Crea sesión de pago Stripe para suscripción premium.
 *
 * @name POST /create-payment
 * @function
 * @memberof module:routes/subscriptions
 * @param {express.Request<any, any, CreatePaymentRequest>} req
 * @param {express.Response<CreatePaymentResponse>} res
 * @access Private (JWT requerido)
 * 
 * @example
 * curl -X POST http://localhost:5000/api/subscriptions/create-payment \
 *   -H "Authorization: Bearer <token>" \
 *   -H "Content-Type: application/json" \
 *   -d '{"plan": "premium"}'
 */
router.post('/create-payment', authMiddleware, subscriptionController.createPayment);

/**
 * Confirma pago Stripe y activa suscripción premium.
 *
 * @name POST /execute-payment
 * @function
 * @memberof module:routes/subscriptions
 * @param {express.Request} req - Con `sessionId` en body
 * @param {express.Response} res
 * @access Private (JWT requerido)
 * 
 * @example
 * curl -X POST http://localhost:5000/api/subscriptions/execute-payment \
 *   -H "Authorization: Bearer <token>" \
 *   -d '{"sessionId": "cs_test..."}'
 */
router.post('/execute-payment', authMiddleware, subscriptionController.executePayment);

/**
 * Obtiene el estado actual de la suscripción del usuario.
 *
 * @name GET /
 * @function
 * @memberof module:routes/subscriptions
 * @param {express.Request} req
 * @param {express.Response} res
 * @access Private (JWT requerido)
 */
router.get('/', authMiddleware, subscriptionController.getSubscription);

/**
 * Verifica acceso premium (middleware ligero).
 *
 * @name GET /premiumcheck
 * @function
 * @memberof module:routes/subscriptions
 * @param {express.Request} req
 * @param {express.Response} res
 * @access Private (JWT requerido)
 */
router.get('/premiumcheck', authMiddleware, subscriptionController.checkPremiumAccess);

/**
 * Cancela la suscripción premium actual.
 *
 * @name DELETE /
 * @function
 * @memberof module:routes/subscriptions
 * @param {express.Request} req
 * @param {express.Response} res
 * @access Private (JWT requerido)
 */
router.delete('/', authMiddleware, subscriptionController.cancelSubscription);

module.exports = router;
