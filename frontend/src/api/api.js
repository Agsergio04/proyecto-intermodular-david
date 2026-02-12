/**
 * Cliente HTTP configurado con Axios para interactuar con la API backend.
 * Incluye manejo automático de tokens JWT, logging detallado y configuración robusta de URLs.
 * @module apiClient
 * @example
 * import api from './api';
 * 
 * // GET request
 * const response = await api.get('/users');
 * 
 * // POST request
 * const newUser = await api.post('/users', { name: 'John' });
 */
import axios from 'axios';

/**
 * URL base de la API. Se construye dinámicamente desde variables de entorno.
 * Siempre asegura que termine en `/api` para consistencia.
 * @type {string}
 * @default 'http://localhost:5000/api'
 */
let API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Normaliza la URL base asegurando que siempre termine en `/api`.
 * Elimina barras finales duplicadas y agrega `/api` si es necesario.
 */

if (API_URL && !API_URL.endsWith('/api')) {
  API_URL = API_URL.replace(/\/$/, '') + '/api';
}

/**
 * Instancia principal de Axios configurada para todas las peticiones HTTP.
 * @type {import('axios').AxiosInstance}
 * @property {string} baseURL - URL base de todas las peticiones
 * @property {Object} defaults.headers - Headers por defecto
 * @property {number} timeout - Timeout de 120 segundos (2 minutos) para operaciones largas
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 120000 // 120 segundos (2 minutos) timeout para operaciones de IA
});

/**
 * Interceptor de peticiones salientes.
 * @param {import('axios').AxiosRequestConfig} config - Configuración de la petición
 * @returns {Promise<import('axios').AxiosRequestConfig>} Configuración modificada
 * @description
 * - Agrega token JWT desde localStorage como `Authorization: Bearer`
 * - Loggea método, URL y body de la petición
 * - Aplica timeout más largo para endpoints de IA (generate-feedback, generate-questions)
 */
api.interceptors.request.use(
  /** @param {import('axios').AxiosRequestConfig} config */
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Apply longer timeout for AI operations
    if (config.url?.includes('generate-feedback') || config.url?.includes('generate-questions')) {
      config.timeout = 180000; // 3 minutes for AI operations
    }
    
    return config;
  },
  /** @param {Error} error */
  error => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de respuestas entrantes.
 * @param {import('axios').AxiosResponse} response - Respuesta exitosa
 * @returns {Promise<import('axios').AxiosResponse>} Respuesta procesada
 */
api.interceptors.response.use(
  /** @param {import('axios').AxiosResponse} response */
  response => {
    return response;
  },
  /**
   * @param {import('axios').AxiosError} error - Error de respuesta
   * @returns {Promise<never>} Error rechazado
   */
  error => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message
      });
    }
    return Promise.reject(error);
  }
);
/**
 * Cliente HTTP listo para usar con toda la configuración aplicada.
 * @type {import('axios').AxiosInstance}
 * @example
 * // Todas las peticiones incluirán automáticamente el token y logging
 * const users = await api.get('/users');
 * const newPost = await api.post('/posts', postData);
 */
export default api;
