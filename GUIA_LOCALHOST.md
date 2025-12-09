# Guía de Despliegue en Localhost

## 🏠 Ejecución Local Completa

Esta guía te ayudará a ejecutar el proyecto completo (backend + frontend) en tu máquina local.

## 📋 Requisitos Previos

- **Node.js**: v18 o superior ([Descargar](https://nodejs.org))
- **MongoDB**: Instalado localmente o en Docker
- **Git**: Para clonar el repositorio

## 🚀 Pasos de Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Agsergio04/proyecto-intermodular-david.git
cd proyecto-intermodular-david
```

### 2. Configurar MongoDB

#### Opción A: MongoDB Local (Linux/Mac)
```bash
# Iniciar MongoDB
mongod
```

#### Opción B: MongoDB con Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. Configurar Variables de Entorno

Consulta [ENV_LOCAL_CONFIGURATION.md](./ENV_LOCAL_CONFIGURATION.md) para detalles.

#### Backend
```bash
cd backend
cp .env.example .env.local
# Edita .env.local con tus valores
```

#### Frontend
```bash
cd frontend
cp .env.example .env.local
# Edita .env.local con tus valores
```

### 4. Instalar Dependencias

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 5. Ejecutar la Aplicación

Abre dos terminales, una para cada servicio:

#### Terminal 1 - Backend
```bash
cd backend
npm start
```

Espera el mensaje: `✅ Servidor ejecutándose en http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

Se abrirá automáticamente: `http://localhost:3000`

## 🧪 Testing de Features

### Generar Preguntas con IA
1. Inicia sesión o regístrate
2. Ve a "Crear Entrevista"
3. Selecciona una tecnología y cantidad de preguntas
4. Las preguntas se generarán usando Google Gemini

### Realizar una Entrevista
1. Ve a "Mis Entrevistas"
2. Selecciona una entrevista
3. Responde las preguntas (el sistema grabará audio)
4. Al finalizar obtendrás puntuación y feedback

### Suscripción a Premium
1. Ve a "Suscripciones"
2. Haz clic en "Mejorar a Premium"
3. Completa el pago de prueba con PayPal (Sandbox)

## 🔍 Troubleshooting

### "Port 5000 already in use"
```bash
# Mata el proceso en el puerto 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### "MongoDB connection refused"
```bash
# Verifica que MongoDB esté corriendo
mongosh  # Intenta conectar
# Si no funciona, inicia MongoDB
```

### "Module not found errors"
```bash
# Limpia caché y reinstala
rm -rf node_modules package-lock.json
npm install
```

### "GEMINI_API_KEY not found"
1. Verifica que `.env.local` exista
2. Verifica que la clave esté correctamente configurada
3. Reinicia el servidor

## 📊 Estructura de Directorios Locales

```
proyecto-intermodular-david/
├── backend/
│   ├── .env.local          # ← Tu configuración local
│   ├── server.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── package.json
├── frontend/
│   ├── .env.local          # ← Tu configuración local
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## 🛠️ Comandos Útiles

### Backend
```bash
npm start          # Inicia el servidor
npm run dev        # Modo desarrollo (si disponible)
npm test           # Ejecuta tests
```

### Frontend
```bash
npm start          # Abre en http://localhost:3000
npm run build      # Crea build de producción
npm test           # Ejecuta tests
```

## 📝 Notas Importantes

- Los archivos `.env.local` NO se suben al repositorio
- Para desarrollo, las claves pueden ser simples
- En producción, usa valores seguros y secretos
- MongoDB por defecto está en `mongodb://localhost:27017`

## 🚪 Puertos Utilizados

| Servicio | Puerto | URL |
|----------|--------|-----|
| Backend | 5000 | http://localhost:5000 |
| Frontend | 3000 | http://localhost:3000 |
| MongoDB | 27017 | localhost:27017 |

