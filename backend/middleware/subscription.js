/**
 * @fileoverview Express middleware for checking user subscription status. Validates free trial
 * and premium subscriptions, updating expired trials and setting request flags for route protection.
 * 
 * @module middleware/subscription
 */
const User = require('../models/User');
/**
 * Middleware to verify and set subscription status on request object
 * @function checkSubscription
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware callback
 * @returns {Promise<void|Response>} Continues middleware chain or sends error response
 * @throws {Error} Database or validation errors
 * 
 * @example
 * app.get('/premium-route', checkSubscription, premiumHandler);
 */
const checkSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('subscription');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if subscription is still valid
    if (user.subscriptionStatus === 'free') {
      if (user.freeTrialEndDate < new Date()) {
        user.subscriptionStatus = 'expired';
        await user.save();
        req.isPremium = false;
      } else {
        req.isPremium = true;
      }
    } else if (user.subscriptionStatus === 'premium') {
      req.isPremium = true;
    } else {
      req.isPremium = false;
    }

    req.userSubscription = user.subscription;
    req.userSubscriptionStatus = user.subscriptionStatus;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking subscription', error: error.message });
  }
};

module.exports = checkSubscription;
