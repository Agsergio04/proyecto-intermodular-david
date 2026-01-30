/**
 * @fileoverview Rutas específicas del usuario autenticado (`/api/users`).
 * @module routes/users
 * @description Endpoints para obtener la información del usuario actual (perfil).
 * @example
 * // GET /api/users
 * // Retorna el perfil del usuario autenticado
 */

const express = require('express');

/**
 * Router de Express para rutas de usuarios.
 * @type {import('express').Router}
 */
const router = express.Router();

/**
 * Middleware de autenticación JWT requerido.
 * @type {import('express').RequestHandler}
 */
const authMiddleware = require('../middleware/auth');

/**
 * Controlador con el método `getMe` para devolver datos del usuario.
 * @type {{getMe: import('express').RequestHandler}}
 */
const userController = require('../controllers/authController');

/**
 * Obtiene el perfil completo del usuario autenticado.
 *
 * - Requiere un token JWT válido en el header `Authorization`.
 * - Devuelve información básica de usuario y datos relacionados.
 *
 * @name GET /
 * @function
 * @memberof module:routes/users
 * @param {import('express').Request} req Petición HTTP con el usuario en `req.user`.
 * @param {import('express').Response} res Respuesta HTTP con el perfil.
 * @returns {Promise<void>}
 * @access Private
 *
 * @example
 * curl -H "Authorization: Bearer <token>" http://localhost:5000/api/users
 */
router.get('/', authMiddleware, userController.getMe);

module.exports = router;
