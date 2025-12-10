/**
 * @fileoverview Express middleware for JWT authentication. Extracts and verifies Bearer tokens,
 * attaching decoded user data to the request object for protected routes.
 * 
 * @module middleware/auth
 */

const jwt = require('jsonwebtoken');
/**
 * Middleware to authenticate JWT tokens from Authorization header
 * @function authMiddleware
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware callback
 * @returns {Promise<void|Response>} Continues middleware chain or sends 401 error
 * 
 * @example
 * app.get('/protected', authMiddleware, protectedHandler);
 */
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
