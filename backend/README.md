# AI Interview Platform - Backend

API backend para la plataforma de entrevistas con IA.

## 🚀 Tecnologías

- **Node.js** + **Express**: Framework del servidor
- **MongoDB**: Base de datos
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación
- **Google Gemini AI**: Generación de preguntas y feedback
- **bcryptjs**: Hash de contraseñas

## 📁 Estructura

```
backend/
├── controllers/      # Lógica de negocio
├── models/          # Modelos de MongoDB
├── routes/          # Rutas de la API
├── middleware/      # Middleware (auth, validación)
├── scripts/         # Scripts de utilidad
└── server.js        # Punto de entrada
```

## 🔧 Instalación

```bash
cd backend
npm install
```

## 🏃 Ejecutar

```bash
# Desarrollo
npm run dev

# Producción
npm start

# Seed datos
npm run seed
```

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual

### Interviews
- `GET /api/interviews` - Listar entrevistas
- `POST /api/interviews` - Crear entrevista
- `GET /api/interviews/:id` - Obtener entrevista
- `PUT /api/interviews/:id` - Actualizar entrevista
- `DELETE /api/interviews/:id` - Eliminar entrevista

### Responses
- `POST /api/responses` - Enviar respuesta
- `GET /api/responses/interview/:id` - Respuestas de entrevista
- `POST /api/responses/interview/:id/generate-feedback` - Generar feedback

## 🔐 Variables de Entorno

Ver `.env.example` o `.env.local` para configuración completa.
