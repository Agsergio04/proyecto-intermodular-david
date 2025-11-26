const User = require('../models/User');
const Subscription = require('../models/Subscription');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (userId) => {
  return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
  );
};

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