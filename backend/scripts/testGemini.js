/**
 * @fileoverview Script de prueba para conexión API Gemini (Google Generative AI)
 * @description Valida la conexión y funcionalidad básica de Gemini 2.5 Flash con respuesta JSON
 * @version 1.0.0
 * @example node testGemini.js
 */

const path = require('path');
const fs = require('fs');

/**
 * Carga variables de entorno con prioridad para tests
 * 1. .env.local (desarrollo Docker)
 * 2. .env (producción)
 * @private
 * @returns {void}
 */
function loadTestEnvironment() {
  const envLocalPath = path.resolve(__dirname, '../.env.local');
  const envPath = path.resolve(__dirname, '../.env');

  if (fs.existsSync(envLocalPath)) {
    console.log('✅ Loading .env.local');
    require('dotenv').config({ path: envLocalPath });
  } else if (fs.existsSync(envPath)) {
    console.log('✅ Loading .env');
    require('dotenv').config({ path: envPath });
  }
}

loadTestEnvironment();

/**
 * Cliente Google Generative AI
 * @type {import('@google/generative-ai').GoogleGenerativeAI}
 */
const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * API Key de Gemini desde variables de entorno
 * @type {string|undefined}
 */
const API_KEY = process.env.GEMINI_API_KEY;

console.log('🔍 Testing Gemini API...');
console.log('API Key exists:', !!API_KEY);
console.log('API Key length:', API_KEY?.length);

/**
 * Prueba completa de conexión y generación con Gemini 2.5 Flash
 * @returns {Promise<{message: string}>} Respuesta JSON parseada de Gemini
 * @throws {Error} Si falla la autenticación, modelo no disponible o parsing JSON
 * @access Private (CLI utility)
 * @example
 * await testGemini()
 *   .then(data => console.log('Success:', data))
 *   .catch(err => console.error('Failed:', err));
 */
async function testGemini() {
  /**
   * Validación de API Key
   * @type {string}
   */
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY not found in environment');
  }

  /**
   * Instancia del cliente Generative AI
   * @type {import('@google/generative-ai').GoogleGenerativeAI}
   */
  const genAI = new GoogleGenerativeAI(API_KEY);

  /**
   * Modelo Gemini 2.5 Flash configurado
   * @type {import('@google/generative-ai').GenerativeModel}
   */
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  console.log('📤 Sending test prompt...');

  /**
   * Configuración de generación optimizada para JSON
   * @type {import('@google/generative-ai').GenerateContentConfig}
   */
  const generationConfig = {
    temperature: 0.7,
    maxOutputTokens: 100,
    responseMimeType: 'application/json'
  };

  /**
   * Contenido de prueba: Request JSON estructurado
   * @type {import('@google/generative-ai').Content[]}
   */
  const contents = [{
    role: 'user',
    parts: [{ text: 'Say "Hello, Gemini is working!" in JSON format: {"message": "..."}' }]
  }];

  /**
   * Respuesta de generación de contenido
   * @type {import('@google/generative-ai').GenerateContentResult}
   */
  const result = await model.generateContent({
    contents,
    generationConfig
  });

  /**
   * Texto de respuesta crudo
   * @type {string}
   */
  const response = await result.response;
  const text = response.text();

  console.log('✅ Gemini response:', text);
  console.log('✅ Test passed!');

  /**
   * Parse JSON respuesta
   * @type {{message: string}}
   */
  return JSON.parse(text);
}

/**
 * Ejecutor principal del test con manejo completo de errores
 * @type {() => Promise<{message: string}>}
 */
testGemini()
  .then(/** @param {{message: string}} data */ data => {
    console.log('🎉 Success:', data);
    process.exit(0);
  })
  .catch(/** @param {Error} err */ err => {
    console.error('💥 Fatal error:', err.message);
    console.error('❌ Error details:', err);
    process.exit(1);
  });

