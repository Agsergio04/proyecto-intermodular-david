/**
 * @fileoverview Mongoose schema for User model with authentication, subscription
 * management, and interview history. Includes password hashing middleware.
 * 
 * @module models/User
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Schema for User documents
 * @typedef {Object} UserSchema
 * @property {string} email - Unique user email with validation [required]
 * @property {string} password - Hashed password (not selected by default) [required]
 * @property {string} firstName - User's first name [required]
 * @property {string} lastName - User's last name [required]
 * @property {('en'|'es'|'fr'|'de'|'pt'|'it'|'ja'|'zh')} [language='en'] - Preferred language
 * @property {mongoose.Types.ObjectId} [subscription=null] - Subscription reference
 * @property {('free'|'premium'|'expired')} [subscriptionStatus='free'] - Current status
 * @property {Date} [freeTrialEndDate] - Free trial expiration (defaults to 7 days)
 * @property {mongoose.Types.ObjectId[]} interviews - Array of Interview references
 * @property {string} [profileImage=null] - Profile image URL
 * @property {Date} [createdAt] - Creation timestamp
 * @property {Date} [updatedAt] - Last update timestamp
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  language: {
    type: String,
    enum: ['en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'zh'],
    default: 'en'
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null
  },
  subscriptionStatus: {
    type: String,
    enum: ['free', 'premium', 'expired'],
    default: 'free'
  },
  freeTrialEndDate: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  },
  interviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  }],
  profileImage: {
    type: String,
    default: null
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

/**
 * Pre-save hook to ensure the password is hashed before storing.
 * @function
 * @memberof userSchema
 * @param {function} next - Mongoose middleware next callback
 * @returns {Promise<void>}
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare the entered password with the hashed password.
 * @function matchPassword
 * @memberof userSchema
 * @instance
 * @param {string} enteredPassword - Password to validate
 * @returns {Promise<boolean>} True if passwords match
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Check if the user's subscription or free trial is active.
 * @function isSubscriptionActive
 * @memberof userSchema
 * @instance
 * @returns {boolean} True if subscription or trial is active
 */
userSchema.methods.isSubscriptionActive = function() {
  if (this.subscriptionStatus === 'premium' && this.subscription) {
    return true;
  }
  if (this.subscriptionStatus === 'free' && this.freeTrialEndDate > new Date()) {
    return true;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);
