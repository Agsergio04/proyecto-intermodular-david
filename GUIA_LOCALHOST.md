# 🔧 Guía: Ejecutar el Proyecto en Localhost

## ❌ Problema Actual

Estás intentando usar el frontend en **localhost** pero está apuntando al backend de **Render**, que:
- Puede tener problemas con la cuota de Gemini
- Tiene más latencia
- Está más limitado en el plan gratuito

## ✅ Solución: Ejecutar TODO en Localhost

---

## Paso 1: Configuración de Variables de Entorno

### Ya está configurado ✅

El archivo `frontend/.env.local` ahora apunta a localhost:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

El archivo `backend/.env.local` tiene la configuración correcta:
```env
GEMINI_API_KEY=AIzaSyBfPjHcJLo1u9e3fDx7iU9SgNvhiKnXIsA
MONGODB_URI=mongodb://mongo:27017/ai-interview
PORT=5000
```

---

## Paso 2: Iniciar el Proyecto

### Opción A: Con Docker Compose (Recomendado)

Abre una terminal en la raíz del proyecto:

```powershell
# Iniciar backend + MongoDB
docker-compose up

# O en segundo plano:
docker-compose up -d
```

Esto iniciará:
- ✅ MongoDB en puerto 27017
- ✅ Backend en puerto 5000
- ✅ Frontend en puerto 3000

**Espera** hasta ver:
```
✅ Loading .env.local
✅ Server running on port 5000
✅ MongoDB connected
```

---

### Opción B: Sin Docker (Manual)

**Terminal 1 - MongoDB:**
```powershell
# Si tienes MongoDB instalado localmente
mongod
```

O usa MongoDB Atlas (cloud):
1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. Copia la connection string
4. Actualiza `backend/.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ai-interview
   ```

**Terminal 2 - Backend:**
```powershell
cd backend
npm install
npm start
```

Deberías ver:
```
✅ Loading .env.local
✅ GEMINI_API_KEY found (length: 39)
✅ Server running on port 5000
✅ MongoDB connected
```

**Terminal 3 - Frontend:**
```powershell
cd frontend
npm install
npm start
```

El navegador se abrirá en `http://localhost:3000`

---

## Paso 3: Verificar que Funciona

### Test 1: Backend Health Check

Abre en el navegador:
```
http://localhost:5000/api/health
```

Deberías ver:
```json
{"status": "Backend is running"}
```

### Test 2: Prueba de Gemini

```powershell
cd backend
node scripts/testGemini.js
```

Deberías ver:
```
✅ Loading .env.local
✅ GEMINI_API_KEY found
✅ Gemini response: {"message":"Hello, Gemini is working!"}
```

Si ves **error 429** (cuota excedida), necesitas una nueva API key.

---

## Paso 4: Crear Entrevista

1. Ve a `http://localhost:3000`
2. Inicia sesión o regístrate
3. Crea una nueva entrevista
4. Usa tu repositorio:
   ```
   https://github.com/Agsergio04/proyecto-intermodular-david
   ```

---

## 🐛 Solución de Problemas

### Error: "ERR_CONNECTION_REFUSED"
**Causa**: El backend no está corriendo en localhost:5000

**Solución**:
```powershell
cd backend
npm start
```

---

### Error: "MongoDB connection error"
**Causa**: MongoDB no está corriendo

**Soluciones**:
- **Docker**: `docker-compose up`
- **Local**: `mongod`
- **Cloud**: Usa MongoDB Atlas y actualiza `MONGODB_URI`

---

### Error: "GEMINI_API_KEY not found"
**Causa**: El archivo `.env.local` no se está cargando

**Solución**:
```powershell
cd backend
# Verifica que existe
ls .env.local

# Reinicia el servidor
npm start
```

---

### Error: "429 Too Many Requests" (Gemini)
**Causa**: La API key agotó su cuota gratuita

**Solución**:
1. Ve a [Google AI Studio](https://aistudio.google.com/apikey)
2. Crea una nueva API key
3. Actualiza `backend/.env.local`:
   ```env
   GEMINI_API_KEY=tu_nueva_key_aqui
   ```
4. Reinicia el servidor

---

### Error 500: "Could not fetch repository"
**Causa**: El backend no puede acceder al repositorio

**Soluciones**:
1. **Repositorio privado**: Hazlo público temporalmente
2. **Repositorio público**: Usa la solución ya implementada (preguntas genéricas)
3. **Usa otro repo**: Prueba con `https://github.com/facebook/react`

---

## 📊 Estado de Servicios

| Servicio | URL | Estado Esperado |
|----------|-----|-----------------|
| Frontend | `http://localhost:3000` | ✅ Interfaz visible |
| Backend | `http://localhost:5000` | ✅ API funcionando |
| Health Check | `http://localhost:5000/api/health` | ✅ `{"status":"Backend is running"}` |
| MongoDB | `localhost:27017` | ✅ Conectado |

---

## 🔄 Reiniciar Todo

Si algo no funciona, reinicia todo:

```powershell
# Detener Docker
docker-compose down

# Limpiar y reiniciar
docker-compose up --build

# En otra terminal
cd frontend
npm start
```

---

## ✅ Checklist Final

Antes de crear una entrevista, verifica:

- [ ] Backend corriendo en `http://localhost:5000`
- [ ] Health check responde correctamente
- [ ] MongoDB conectado (ver logs: `✅ MongoDB connected`)
- [ ] `GEMINI_API_KEY` cargada (ver logs)
- [ ] Frontend apunta a `http://localhost:5000/api`
- [ ] Test de Gemini funciona (`node scripts/testGemini.js`)

Si todo está ✅, **ya puedes crear entrevistas sin problemas**.

---

## 💡 Ventajas de Localhost vs Render

| Aspecto | Localhost | Render |
|---------|-----------|--------|
| Velocidad | ⚡ Instantánea | 🐌 Más lenta |
| Logs | 👀 Visibles en tiempo real | 📝 En dashboard |
| Debugging | 🐛 Más fácil | 🔍 Más difícil |
| Cuota Gemini | ✅ Puedes cambiar key fácilmente | ⚠️ Requiere redeploy |
| Gratuito | ✅ 100% gratis | ✅ Plan free (limitado) |

**Recomendación**: Desarrolla en localhost, despliega en Render cuando esté listo.

