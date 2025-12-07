# ✅ Configuración Completada - Uso de .env.local

## Cambios Realizados

### 1. Backend Configurado para Usar .env.local

**Archivo**: `backend/server.js`

El servidor ahora busca archivos en este orden de prioridad:
1. `.env.local` (desarrollo local - **TU CONFIGURACIÓN**)
2. `.env` (fallback)
3. Variables de entorno del sistema

```javascript
// Código añadido al inicio de server.js
const envLocalPath = path.resolve(__dirname, '.env.local');
const envPath = path.resolve(__dirname, '.env');

if (fs.existsSync(envLocalPath)) {
  console.log('✅ Loading .env.local');
  require('dotenv').config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  console.log('✅ Loading .env');
  require('dotenv').config({ path: envPath });
}
```

---

### 2. Estructura de Archivos de Entorno

| Archivo | Propósito | Git |
|---------|-----------|-----|
| `.env.example` | Template para nuevos desarrolladores | ✅ Incluir |
| `.env.local` | **Configuración local (TU KEY)** | ❌ Ignorado |
| `.env.production` | Referencia para Render | ✅ Incluir |

---

### 3. Archivos .env.local Actuales

#### Backend (`.env.local`)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://mongo:27017/ai-interview
JWT_SECRET=dev_secret_key_change_in_production
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=AIzaSyBfPjHcJLo1u9e3fDx7iU9SgNvhiKnXIsA
```

#### Frontend (`.env.local`)
```env
# Para desarrollo con Render backend:
REACT_APP_API_URL=https://ai-interview-backend-lxv2.onrender.com/api

# Para desarrollo con backend local (descomenta):
# REACT_APP_API_URL=http://localhost:5000/api

REACT_APP_GEMINI_API_KEY=AIzaSyBfPjHcJLo1u9e3fDx7iU9SgNvhiKnXIsA
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id_here
```

---

### 4. .gitignore Actualizado

```gitignore
# Environment variables
.env.local
.env*.local
.env.production
```

Esto asegura que **tus API keys locales NO se suben a GitHub**.

---

## 🚀 Cómo Usar

### Desarrollo Local

1. **Backend**:
   ```bash
   cd backend
   # Edita .env.local con tus API keys
   npm start
   ```
   
   Verás en consola: `✅ Loading .env.local`

2. **Frontend**:
   ```bash
   cd frontend
   # Edita .env.local según necesites (local o Render backend)
   npm start
   ```

### Nuevo Desarrollador

1. Copia `.env.example` → `.env.local`
2. Completa tus propias API keys
3. ¡Listo!

---

## 🔧 Verificar Configuración

### Test de Backend
```bash
cd backend
node scripts/testGemini.js
```

Deberías ver:
```
✅ Loading .env.local
✅ GEMINI_API_KEY found (length: 39)
📤 Sending test prompt...
✅ Gemini response: {"message":"Hello, Gemini is working!"}
```

---

## 📝 Modelos Gemini Disponibles

Actualmente usando: **`gemini-pro`**

Para cambiar el modelo, edita:
- `backend/controllers/GitinestController.js` (línea ~203)
- `backend/scripts/testGemini.js` (línea ~22)

Modelos disponibles:
- `gemini-pro` ✅ **(actualmente configurado)**
- `gemini-1.5-pro` 
- `gemini-1.5-flash-latest`

---

## 🌐 Render (Producción)

En Render, configura estas variables manualmente en:
**Dashboard → Service → Environment**

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<generar_clave_segura>
FRONTEND_URL=https://ai-interview-frontend.onrender.com
GEMINI_API_KEY=<tu_key_con_cuota>
```

Render **NO usa** `.env.local` - usa las variables del Dashboard.

---

## ✅ Ventajas de Esta Configuración

1. **Seguridad**: Las API keys locales no se suben a Git
2. **Flexibilidad**: Cada desarrollador usa sus propias keys
3. **Claridad**: `.env.example` documenta qué variables se necesitan
4. **Producción**: Render usa sus propias variables (no archivos)

---

## 🆘 Troubleshooting

### "GEMINI_API_KEY not found"
- Verifica que `.env.local` existe en `backend/`
- Verifica que la key está correcta
- Reinicia el servidor

### "Loading .env" en vez de ".env.local"
- El archivo `.env.local` no existe o está en la ubicación incorrecta
- Debe estar en: `backend/.env.local`

### Modelo no disponible
- El modelo `gemini-2.0-flash-exp` puede no estar disponible
- Usa `gemini-pro` (modelo estable y gratuito)

