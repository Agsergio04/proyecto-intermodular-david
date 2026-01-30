/**
 * @fileoverview Rutas de autenticación (registro, login, perfil y cambio de contraseña).
 * @module routes/auth
 */

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

/**
 * Registra un nuevo usuario.
 *
 * @name POST /register
 * @function
 * @memberof module:routes/auth
 * @param {express.Request} req Petición HTTP con datos de registro.
 * @param {express.Response} res Respuesta HTTP.
 * @access Public
 */
router.post(
  '/register',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty()
  ],
  authController.register
);

/**
 * Inicia sesión y devuelve un token JWT.
 *
 * @name POST /login
 * @function
 * @memberof module:routes/auth
 * @param {express.Request} req Petición HTTP con credenciales.
 * @param {express.Response} res Respuesta HTTP.
 * @access Public
 */
router.post(
  '/login',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').notEmpty()
  ],
  authController.login
);

/**
 * Obtiene el usuario autenticado a partir del token.
 *
 * @name GET /me
 * @function
 * @memberof module:routes/auth
 * @param {express.Request} req Petición HTTP con usuario en `req.user`.
 * @param {express.Response} res Respuesta HTTP.
 * @access Private
 */
router.get('/me', authMiddleware, authController.getMe);

/**
 * Actualiza el perfil del usuario autenticado.
 *
 * @name PUT /profile
 * @function
 * @memberof module:routes/auth
 * @param {express.Request} req Petición HTTP con campos de perfil opcionales.
 * @param {express.Response} res Respuesta HTTP.
 * @access Private
 */
router.put(
  '/profile',
  authMiddleware,
  [
    check('firstName').optional().notEmpty(),
    check('lastName').optional().notEmpty()
  ],
  authController.updateProfile
);

/**
 * Cambia la contraseña del usuario autenticado.
 *
 * @name PUT /change-password
 * @function
 * @memberof module:routes/auth
 * @param {express.Request} req Petición HTTP con contraseña actual y nueva.
 * @param {express.Response} res Respuesta HTTP.
 * @access Private
 */
router.put(
  '/change-password',
  authMiddleware,
  [
    check('currentPassword', 'Current password is required').notEmpty(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  authController.changePassword
);

module.exports = router;
