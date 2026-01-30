/**
 * @fileoverview Mongoose schema for Subscription model. Manages user billing,
 * PayPal integration, and feature access control.
 * 
 * @module models/Subscription
 */

const mongoose = require('mongoose');
/**
 * Schema for Subscription documents
 * @typedef {Object} SubscriptionSchema
 * @property {mongoose.Types.ObjectId} userId - Owning User reference [required, unique]
 * @property {('free'|'premium')} [plan='free'] - Subscription plan
 * @property {('active'|'inactive'|'cancelled'|'expired')} [status='active'] - Status
 * @property {string} [paypalSubscriptionId=null] - PayPal subscription ID
 * @property {string} [paypalTransactionId=null] - PayPal transaction ID
 * @property {Date} startDate - Start timestamp
 * @property {Date} [endDate=null] - End timestamp
 * @property {Date} [renewalDate=null] - Next renewal
 * @property {number} [price=0] - Subscription price
 * @property {string} [currency='USD'] - Currency code
 * @property {Object} features - Feature flags
 * @property {boolean} [features.downloadReports=false] - Report download access
 * @property {boolean} [features.viewStatistics=false] - Stats viewing access
 * @property {boolean} [features.customInterviews=true] - Custom interview access
 * @property {boolean} [features.voiceInterview=true] - Voice interview access
 * @property {boolean} [features.aiGeneratedQuestions=true] - AI question generation
 * @property {Date} [createdAt] - Creation timestamp
 * @property {Date} [updatedAt] - Last update timestamp
 */
const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'expired'],
    default: 'active'
  },
  paypalSubscriptionId: {
    type: String,
    default: null
  },
  paypalTransactionId: {
    type: String,
    default: null
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  renewalDate: {
    type: Date,
    default: null
  },
  price: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  features: {
    downloadReports: {
      type: Boolean,
      default: false
    },
    viewStatistics: {
      type: Boolean,
      default: false
    },
    customInterviews: {
      type: Boolean,
      default: true
    },
    voiceInterview: {
      type: Boolean,
      default: true
    },
    aiGeneratedQuestions: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
