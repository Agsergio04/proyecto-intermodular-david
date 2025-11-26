const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Hash password before saving
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

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if subscription is active
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
