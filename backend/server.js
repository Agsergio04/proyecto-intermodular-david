/**
 * @fileoverview Servidor principal de Express.js para AI Interview Platform
 * @description Configuración completa del servidor backend con MongoDB, seguridad y rutas API
 * @version 1.0.0
 * @docker JsDock: Node.js + MongoDB + Nginx (trust proxy enabled)
 */

// ============================================================================
// IMPORTS Y DEPENDENCIAS
// ============================================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

/**
 * Carga variables de entorno con prioridad:
 * 1. .env.local (Docker/Desarrollo local)
 * 2. .env (Producción/Alternativa)
 * 3. Variables de sistema (fallback)
 * @returns {void}
 */
function loadEnvironment() {
  const envLocalPath = path.resolve(__dirname, '.env.local');
  const envPath = path.resolve(__dirname, '.env');

  if (fs.existsSync(envLocalPath)) {
    console.log('✅ Loading .env.local');
    require('dotenv').config({ path: envLocalPath });
  } else if (fs.existsSync(envPath)) {
    console.log('✅ Loading .env');
    require('dotenv').config({ path: envPath });
  } else {
    console.log('⚠️  No .env file found, using environment variables');
  }
}

loadEnvironment();

// ============================================================================
// IMPORTACIÓN DE RUTAS
// ============================================================================

/**
 * Rutas modularizadas de la API
 * @type {import('express').Router}
 */
const authRoutes = require('./routes/auth');
/** @type {import('express').Router} */
const interviewRoutes = require('./routes/interviews');
/** @type {import('express').Router} */
const responseRoutes = require('./routes/responses');
/** @type {import('express').Router} */
const subscriptionRoutes = require('./routes/subscriptions');
/** @type {import('express').Router} */
const userRoutes = require('./routes/users');
/** @type {import('express').Router} */
const statsRoutes = require('./routes/stats');
/** @type {import('express').Router} */
const aiRoutes = require('./routes/ai');
/** @type {import('express').Router} */
const gitinestRoutes = require('./routes/gitinest');

// ============================================================================
// INICIALIZACIÓN DE EXPRESS
// ============================================================================

/** @type {import('express').Express} */
const app = express();

/**
 * Configuración crítica para Docker/Nginx reverse proxy
 * @see https://expressjs.com/en/guide/behind-proxies.html
 * @returns {void}
 */
app.set('trust proxy', 1); // ✅ Esencial para deployments en contenedores

// ============================================================================
// MIDDLEWARE DE SEGURIDAD
// ============================================================================

/** Helmet: Headers de seguridad HTTP */
app.use(helmet());

/**
 * Lista de orígenes permitidos para CORS
 * @type {string[]}
 */
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

/**
 * Middleware de configuración CORS flexible
 * @param {string|null} origin - Origen de la petición HTTP
 * @param {import('cors').CorsCallback} callback - Callback de CORS
 * @returns {void}
 */
function corsOriginValidator(origin, callback) {
  // ✅ Permite requests sin origen (mobile apps, Postman, curl)
  if (!origin) return callback(null, true);

  if (allowedOrigins.indexOf(origin) !== -1) {
    callback(null, true);
  } else {
    console.log('⚠️  CORS blocked origin:', origin);
    callback(null, true); // ✅ Development: allow anyway
  }
}

app.use(cors({
  origin: corsOriginValidator,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Configuración de Rate Limiting para protección DDoS
 * @type {import('express-rate-limit').RateLimitRequestHandler}
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo requests por IP
  standardHeaders: true,
  legacyHeaders: false,
  /**
   * Skip rate limiting para health checks
   * @param {import('express').Request} req - Request object
   * @returns {boolean}
   */
  skip: (req) => req.path === '/api/health'
});
app.use('/api', limiter);

/** Body parsers - Soporte archivos grandes (50MB) */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/**
 * Middleware de logging de requests
 * @param {import('express').Request} req - Objeto de request
 * @param {import('express').Response} res - Objeto de response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {void}
 */
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log(`📦 Body:`, JSON.stringify(req.body));
  }
  next();
});

// ============================================================================
// CONEXIÓN BASE DE DATOS MONGODB
// ============================================================================

/**
 * Conexión MongoDB con fallback Docker
 * @throws {Error} Si falla la conexión, el proceso termina
 * @returns {Promise<void>}
 */
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/ai-interview')
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => {
    console.error('✗ MongoDB connection error:', err);
    process.exit(1);
  });

// ============================================================================
// RUTAS DE LA API (Prefijo /api)
// ============================================================================

app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/gitinest', gitinestRoutes);

/**
 * Health Check Endpoint - Docker/Kubernetes readiness probe
 * @param {import('express').Request} req - Request object
 * @param {import('express').Response} res - Response object
 * @returns {void}
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Backend is running' });
});

// ============================================================================
// GESTIÓN DE ERRORES
// ============================================================================

/**
 * Global Error Handler
 * @param {Error} err - Error capturado
 * @param {import('express').Request} req - Request object
 * @param {import('express').Response} res - Response object
 * @param {import('express').NextFunction} next - Next function
 * @returns {void}
 */
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/**
 * 404 Handler - Catch-all para rutas no encontradas
 * @param {import('express').Request} req - Request object
 * @param {import('express').Response} res - Response object
 * @returns {void}
 */
app.use((req, res) => {
  console.log(`⚠️  404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ message: 'Route not found' });
});

// ============================================================================
// INICIO DEL SERVIDOR
// ============================================================================

/**
 * Puerto de escucha del servidor
 * @type {number}
 */
const PORT = process.env.PORT || 5000;

/**
 * Inicia el servidor Express
 * @param {number} port - Puerto para escuchar conexiones
 * @returns {import('http').Server}
 */
const server = app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});

/**
 * Configuración de timeouts del servidor para operaciones largas
 * Necesario para operaciones de IA que pueden tomar más tiempo
 */
server.setTimeout(120000); // 120 segundos timeout total
server.headersTimeout = 125000; // Headers timeout ligeramente mayor

module.exports = server;