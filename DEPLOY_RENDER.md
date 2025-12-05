# Despliegue en Render - AI Interview Platform

## Requisitos previos

1. Cuenta en [Render](https://render.com) (gratis)
2. Cuenta en [MongoDB Atlas](https://mongodb.com/atlas) (gratis - plan M0)
3. Repositorio en GitHub conectado a Render

---

## Paso 1: Crear base de datos en MongoDB Atlas

1. Ve a [MongoDB Atlas](https://mongodb.com/atlas)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo **Cluster** gratuito (M0 Sandbox)
4. En **Database Access**: crea un usuario con contraseña
5. En **Network Access**: añade `0.0.0.0/0` para permitir todas las IPs
6. Obtén la **Connection String**:
   - Click en "Connect" → "Connect your application"
   - Copia la URI: `mongodb+srv://<usuario>:<contraseña>@cluster.xxxxx.mongodb.net/ai-interview?retryWrites=true&w=majority`

---

## Paso 2: Desplegar el Backend

### Configuración del Web Service

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub: `proyecto-intermodular-david`

4. **Configuración básica:**

   | Campo | Valor |
   |-------|-------|
   | **Name** | `ai-interview-backend` |
   | **Language** | `Node` |
   | **Branch** | `main` |
   | **Region** | `Frankfurt (EU Central)` |
   | **Root Directory** | `backend` |
   | **Instance Type** | `Free` |

5. **Build & Start Commands:**

   | Campo | Valor |
   |-------|-------|
   | **Build Command** | `npm install` |
   | **Start Command** | `node server.js` |

6. **Configuración avanzada (Advanced):**

   | Campo | Valor |
   |-------|-------|
   | **Health Check Path** | `/api/health` |
   | **Auto-Deploy** | `On Commit` ✅ |

   > ✅ **Nota**: Usamos Node en lugar de Docker porque es más sencillo de configurar en Render.

6. **Environment Variables** - Añade estas variables:

   | Variable | Valor |
   |----------|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://<usuario>:<contraseña>@cluster.xxxxx.mongodb.net/ai-interview?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `<genera_una_clave_secreta_larga>` (puedes usar el botón "Generate") |
   | `FRONTEND_URL` | `https://ai-interview-frontend.onrender.com` |
   | `OPENAI_API_KEY` | `<tu_api_key>` (opcional) |
   | `GOOGLE_API_KEY` | `<tu_api_key>` (opcional) |

7. Click en **"Deploy web service"**

---

## Paso 3: Desplegar el Frontend

1. En Render Dashboard, click en **"New +"** → **"Static Site"**
2. Conecta el mismo repositorio

3. **Configuración básica:**

   | Campo | Valor |
   |-------|-------|
   | **Name** | `ai-interview-frontend` |
   | **Branch** | `main` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `build` |

4. **Environment Variables** - Añade:

   | Variable | Valor |
   |----------|-------|
   | `REACT_APP_API_URL` | `https://ai-interview-backend-lxv2.onrender.com/api` |

   > ⚠️ Reemplaza con la URL real de tu backend una vez desplegado

5. Click en **"Create Static Site"**

---

## Paso 4: Configurar redirecciones SPA

En el frontend de Render, ve a **"Redirects/Rewrites"** y añade:

| Source | Destination | Action |
|--------|-------------|--------|
| `/*`   | `/index.html` | Rewrite |

Esto permite que React Router funcione correctamente.

---

## Paso 5: Actualizar CORS del Backend

Después de desplegar, actualiza la variable `FRONTEND_URL` del backend con la URL real del frontend:

```
FRONTEND_URL=https://ai-interview-frontend.onrender.com
```

---

## URLs de tu aplicación

Una vez desplegado:

- **Backend**: `https://ai-interview-backend-lxv2.onrender.com` ✅ (ya funcionando)
- **Frontend**: `https://ai-interview-frontend.onrender.com` (pendiente)
- **Health Check**: `https://ai-interview-backend-lxv2.onrender.com/api/health`

---

## Notas importantes

### Plan gratuito de Render
- Los servicios gratuitos se **"duermen"** después de 15 minutos de inactividad
- La primera petición después de dormir tarda ~30 segundos
- Para evitar esto, puedes usar [UptimeRobot](https://uptimerobot.com) para hacer ping cada 5 minutos

### Logs y depuración
- Ve a tu servicio en Render → **"Logs"** para ver errores
- Usa **"Shell"** para acceder a la terminal del servidor

### Actualizar la aplicación
- Cada push a la rama `main` desplegará automáticamente

---

## Solución de problemas

### Error: "CORS blocked"
- Verifica que `FRONTEND_URL` en el backend coincida exactamente con la URL del frontend

### Error: "MongoDB connection failed"
- Verifica que la IP `0.0.0.0/0` esté permitida en MongoDB Atlas Network Access
- Verifica que el usuario y contraseña en `MONGODB_URI` sean correctos

### Error: "Cannot GET /ruta"
- Asegúrate de configurar la redirección SPA en el frontend (`/* → /index.html`)

### El frontend no conecta con el backend
- Verifica que `REACT_APP_API_URL` apunte a la URL correcta del backend
- Recuerda que las variables de React requieren **rebuild** para aplicarse
