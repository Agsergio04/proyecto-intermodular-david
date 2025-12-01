// Script de prueba para verificar la API
const axios = require('axios');

const testGenerateQuestions = async () => {
  try {
    console.log('🧪 Testing /api/interviews/generate-questions endpoint...\n');

    const token = 'YOUR_TOKEN_HERE'; // Reemplaza con un token válido

    const requestBody = {
      repoUrl: 'https://github.com/facebook/react',
      difficulty: 'mid',
      language: 'es',
      count: 5
    };

    console.log('📤 Enviando request:', JSON.stringify(requestBody, null, 2));

    const response = await axios.post(
      'http://localhost:5001/api/interviews/generate-questions',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('\n✅ Respuesta exitosa:', response.status);
    console.log('📥 Datos recibidos:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('📥 Status:', error.response.status);
      console.error('📥 Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
};

testGenerateQuestions();

