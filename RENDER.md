# Despliegue en Render

##  Guía Completa de Despliegue en Render

Render es una plataforma modern para hospedar aplicaciones web. Esta guía te ayudará a desplegar el proyecto completo en Render.

##  Requisitos

- Cuenta en [Render](https://render.com) (gratis)
- Repositorio GitHub conectado a Render
- Variables de entorno configuradas

##  Arquitectura de Despliegue

```
┌─────────────────────────────────────────┐
│           Render Dashboard              │
├─────────────────────────────────────────┤
│  Frontend (React)  │  Backend (Node.js) │
│  puerto: 3000      │  puerto: 5000      │
└─────────────────────────────────────────┘
         ↓                    ↓
    ↓
   MongoDB Atlas (Base de datos en la nube)
```

## 1️ Preparar el Backend

### 1.1 Conectar MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un cluster gratuito
4. Obtén la URI de conexión:
   - Ve a "Connect" → "Connect your application"
   - Copia la URI: `mongodb+srv://usuario:contraseña@cluster.mongodb.net/nombre-bd`

### 1.2 Crear Servicio Web para Backend en Render

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en "New" → "Web Service"
3. Conecta tu repositorio GitHub
4. Configura:
   - **Name**: `ai-interview-backend`
   - **Repository**: `proyecto-intermodular-david`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (gratuito)

### 1.3 Configurar Variables de Entorno del Backend

En Render, ve a "Environment" y agrega:

```bash
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/ai-interview
PORT=5000
NODE_ENV=production
JWT_SECRET=una-clave-secreta-muy-segura-y-aleatoria
GEMINI_API_KEY=tu-api-key-de-google-gemini
PAYPAL_CLIENT_ID=tu-paypal-client-id-produccion
PAYPAL_CLIENT_SECRET=tu-paypal-client-secret-produccion
PAYPAL_MODE=live
FRONTEND_URL=https://tu-frontend-url.onrender.com
```

## 2️ Preparar el Frontend

### 2.1 Crear Servicio Web para Frontend en Render

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en "New" → "Web Service"
3. Conecta tu repositorio GitHub
4. Configura:
   - **Name**: `ai-interview-frontend`
   - **Repository**: `proyecto-intermodular-david`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start` (o usa `serve -s build`)
   - **Instance Type**: Free (gratuito)

### 2.2 Configurar Variables de Entorno del Frontend

En Render, ve a "Environment" y agrega:

```bash
REACT_APP_API_URL=https://tu-backend-url.onrender.com/api
REACT_APP_GEMINI_API_KEY=tu-api-key-de-google-gemini
REACT_APP_PAYPAL_CLIENT_ID=tu-paypal-client-id-produccion
REACT_APP_DEFAULT_LANGUAGE=es
```

## 3️ Configurar el Dockerfile (Opcional pero Recomendado)

Si quieres un despliegue más controlado, usa Docker:

### Backend - `backend/Dockerfile`
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Frontend - `frontend/Dockerfile`
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

## 4️ GitHub Actions - Deploy Automático

Crea un workflow para desplegar automáticamente con cada push a `main`:

`.github/workflows/deploy-render.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Trigger Render deployment
        run: |
          curl https://api.render.com/deploy/srv-${{ secrets.RENDER_BACKEND_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}
          curl https://api.render.com/deploy/srv-${{ secrets.RENDER_FRONTEND_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}
```

## 5️ URLs Finales

Después del despliegue, tendrás URLs como:

- **Backend**: `https://ai-interview-backend-xxx.onrender.com`
- **Frontend**: `https://ai-interview-frontend-xxx.onrender.com`

##  Monitoreo

### En Render Dashboard:

1. **Logs**: Ve a "Logs" para ver errores en tiempo real
2. **Metrics**: Monitorea CPU, memoria y requests
3. **Health Checks**: Verifica que los servicios estén activos

##  Problemas Comunes

### "Build failed"
```
✗ El build command falló
→ Verifica que package.json esté en el directorio correcto
→ Asegúrate de que npm install funcione localmente
```

### "Connection to MongoDB refused"
```
✗ No se puede conectar a MongoDB
→ Verifica que MONGODB_URI sea correcto
→ Verifica que el cluster esté activo en MongoDB Atlas
→ Agrega la IP de Render a whitelist en MongoDB Atlas
```

### "Frontend not loading"
```
✗ La URL del API es incorrecta
→ Verifica REACT_APP_API_URL en variables de entorno
→ Verifica que el backend esté corriendo
```

##  Actualizaciones

Cada vez que hagas `git push` a `main`:

1. GitHub Actions detecta el push
2. Inicia el deploy automático
3. Render redeploy el servicio
4. Verifica en Render Dashboard que todo esté corriendo

##  Costos

- **Backend**: $0.10/hora si está activo (capa gratuita: durmiente después de 15 min inactivo)
- **Frontend**: $0.10/hora si está activo (capa gratuita: durmiente después de 15 min inactivo)
- **MongoDB Atlas**: Gratuito hasta 5GB

##  Próximos Pasos

1. Verifica que ambos servicios estén en "Running"
2. Abre la URL del frontend en el navegador
3. Prueba registrarte y generar preguntas
4. Verifica los logs si hay problemas

