// Test Gemini API Connection
const path = require('path');
const fs = require('fs');

// Cargar .env.local si existe, sino .env
const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(envLocalPath)) {
    console.log('✅ Loading .env.local');
    require('dotenv').config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
    console.log('✅ Loading .env');
    require('dotenv').config({ path: envPath });
}

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;

console.log('🔍 Testing Gemini API...');
console.log('API Key exists:', !!API_KEY);
console.log('API Key length:', API_KEY?.length);

async function testGemini() {
    try {
        if (!API_KEY) {
            throw new Error('GEMINI_API_KEY not found in environment');
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        console.log('📤 Sending test prompt...');

        const result = await model.generateContent({
            contents: [{
                role: 'user',
                parts: [{ text: 'Say "Hello, Gemini is working!" in JSON format: {"message": "..."}' }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 100,
                responseMimeType: 'application/json'
            }
        });

        const response = await result.response;
        const text = response.text();

        console.log('✅ Gemini response:', text);
        console.log('✅ Test passed!');

        return JSON.parse(text);
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('❌ Error details:', error);
        throw error;
    }
}

testGemini()
    .then(data => {
        console.log('🎉 Success:', data);
        process.exit(0);
    })
    .catch(err => {
        console.error('💥 Fatal error:', err);
        process.exit(1);
    });

