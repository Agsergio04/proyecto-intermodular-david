# Configuración de Variables de Entorno Locales

## 📋 Descripción

Este documento explica cómo configurar las variables de entorno para ejecutar el proyecto localmente en tu máquina.

## 🔧 Backend - Variables de Entorno

### Archivo: `backend/.env.local`

```bash
# Base de Datos - MongoDB Local
MONGODB_URI=mongodb://localhost:27017/ai-interview

# Servidor
PORT=5000
NODE_ENV=development

# JWT - Autenticación
JWT_SECRET=tu-clave-secreta-muy-segura-aqui-cambiala-en-produccion

# Google Gemini AI - Generación de preguntas
GEMINI_API_KEY=tu-api-key-de-google-gemini

# PayPal - Testing
PAYPAL_CLIENT_ID=tu-client-id-paypal-testing
PAYPAL_CLIENT_SECRET=tu-client-secret-paypal-testing
PAYPAL_MODE=sandbox

# Email (Opcional)
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-app

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Instrucciones de Setup

1. **Copia el archivo de plantilla:**
```bash
cp backend/.env.example backend/.env.local
```

2. **Rellena los valores:**
   - `MONGODB_URI`: Asegúrate de que MongoDB esté ejecutándose localmente en el puerto 27017
   - `JWT_SECRET`: Genera una cadena aleatoria segura
   - `GEMINI_API_KEY`: Obtén tu clave desde [Google Cloud Console](https://console.cloud.google.com)
   - `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET`: Obtén del [PayPal Developer](https://developer.paypal.com)

## 🎨 Frontend - Variables de Entorno

### Archivo: `frontend/.env.local`

```bash
# API Backend
REACT_APP_API_URL=http://localhost:5000/api

# Google Gemini AI
REACT_APP_GEMINI_API_KEY=tu-api-key-de-google-gemini

# PayPal - Testing
REACT_APP_PAYPAL_CLIENT_ID=tu-client-id-paypal-testing

# Idioma por defecto
REACT_APP_DEFAULT_LANGUAGE=es
```

### Instrucciones de Setup

1. **Copia el archivo de plantilla:**
```bash
cp frontend/.env.example frontend/.env.local
```

2. **Rellena los valores:**
   - `REACT_APP_API_URL`: Puerto donde corre el backend (por defecto 5000)
   - `REACT_APP_GEMINI_API_KEY`: La misma que en el backend
   - `REACT_APP_PAYPAL_CLIENT_ID`: Cliente ID de PayPal sandbox

## 🐳 Docker Local

Si prefieres usar Docker para ejecutar MongoDB localmente:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## ✅ Verificación

Para verificar que todo está configurado correctamente:

### Backend
```bash
cd backend
npm install
npm start
```

Deberías ver: `✅ Servidor ejecutándose en http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
npm start
```

Se abrirá automáticamente `http://localhost:3000`

## 🔑 Obtener las Claves API

### Google Gemini API
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto
3. Activa la API de Google Generative AI
4. Crea una clave de API

### PayPal Developer
1. Ve a [PayPal Developer](https://developer.paypal.com)
2. Crea una cuenta
3. Ve a "Apps & Credentials"
4. Copia los credenciales de Sandbox

## 📝 Notas Importantes

- **NUNCA** subas archivos `.env.local` al repositorio
- Las claves en desarrollo pueden ser simples, pero en producción deben ser muy seguras
- MongoDB debe estar corriendo en la máquina local o en Docker

