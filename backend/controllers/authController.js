/**
 * @fileoverview Authentication controller handling user registration, login, profile management,
 * and JWT token generation with subscription integration.
 * 
 * @module controllers/authController
 */

const User = require('../models/User');
const Subscription = require('../models/Subscription');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
/**
 * Generates JWT token for user authentication
 * @function generateToken
 * @param {string} userId - User MongoDB ObjectId
 * @returns {string} Signed JWT token valid for 7 days
 * @private
 */
const generateToken = (userId) => {
  return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
  );
};
/**
 * Register new user with free subscription
 * POST /api/auth/register
 * @function register
 * @param {import('express').Request} req - Express request with validated body
 * @param {import('express').Response} res - Express response
 * @returns {201} User data and token or 400/500 error
 * @access Public
 */
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, language } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      email,
      password,
      firstName,
      lastName,
      language: language || 'en'
    });

    await user.save();

    // Create free subscription
    const subscription = new Subscription({
      userId: user._id,
      plan: 'free',
      status: 'active',
      features: {
        customInterviews: true,
        voiceInterview: true,
        aiGeneratedQuestions: true,
        downloadReports: false,
        viewStatistics: false
      }
    });

    await subscription.save();
    user.subscription = subscription._id;
    user.subscriptionStatus = 'free';
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language,
        subscriptionStatus: user.subscriptionStatus,
        freeTrialEndDate: user.freeTrialEndDate
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};
/**
 * Login user with subscription status check
 * POST /api/auth/login
 * @function login
 * @param {import('express').Request} req - Express request with email/password
 * @param {import('express').Response} res - Express response
 * @returns {200} User data and token or 401/500 error
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password').populate('subscription');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check subscription status
    if (user.subscriptionStatus === 'free' && user.freeTrialEndDate < new Date()) {
      user.subscriptionStatus = 'expired';
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language,
        subscriptionStatus: user.subscriptionStatus,
        freeTrialEndDate: user.freeTrialEndDate,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
/**
 * Get authenticated user profile
 * GET /api/auth/me
 * @function getMe
 * @param {import('express').Request} req - Request with req.userId from auth middleware
 * @param {import('express').Response} res - Express response
 * @returns {200} User profile with subscription or 404/500 error
 * @access Private
 */

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('subscription');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check subscription status
    if (user.subscriptionStatus === 'free' && user.freeTrialEndDate < new Date()) {
      user.subscriptionStatus = 'expired';
      await user.save();
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language,
        subscriptionStatus: user.subscriptionStatus,
        freeTrialEndDate: user.freeTrialEndDate,
        profileImage: user.profileImage,
        interviews: user.interviews,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};
/**
 * Update user profile information
 * PUT /api/auth/profile
 * @function updateProfile
 * @param {import('express').Request} req - Request with profile updates
 * @param {import('express').Response} res - Express response
 * @returns {200} Updated profile or 404/500 error
 * @access Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, language, profileImage } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (language) user.language = language;
    if (profileImage) user.profileImage = profileImage;

    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};
/**
 * Change user password
 * PUT /api/auth/password
 * @function changePassword
 * @param {import('express').Request} req - Request with current/new password
 * @param {import('express').Response} res - Express response
 * @returns {200} Success message or 401/404/500 error
 * @access Private
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};