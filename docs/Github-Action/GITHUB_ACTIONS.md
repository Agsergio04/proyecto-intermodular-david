# GitHub Actions - Despliegue Docker Automático

## Introducción

Este documento explica cómo configurar y usar el **GitHub Action para subir automáticamente las imágenes Docker a Docker Hub** cada vez que haces un push a la rama `main`.

---

## ¿Qué hace este Action?

Cada vez que haces un push al main:

1.  Descarga el código del repositorio
2.  Construye la imagen Docker del **backend**
3.  Construye la imagen Docker del **frontend**
4.  Sube ambas imágenes a **Docker Hub** automáticamente
5.  Las etiqueta como `latest`

**Resultado**: Tus imágenes estarán disponibles en Docker Hub sin hacer nada manual.

---

##  Ubicación del Workflow

```
proyecto-intermodular-david/
└── .github/
    └── workflows/
        └── docker-deploy.yml  
```

---

##  Configuración (Paso a Paso)

### **PASO 1: Crear Cuenta en Docker Hub**

1. Ve a [hub.docker.com](https://hub.docker.com/)
2. Click en **Sign Up**
3. Completa el formulario:
   - **Username**: Tu nombre de usuario (ej: `agsergio04`)
   - **Email**: Tu correo
   - **Password**: Contraseña segura
4. Verifica tu email
5.  **Cuenta creada**

---

### **PASO 2: Crear Access Token en Docker Hub**

Este token permite que GitHub Actions suba imágenes en tu nombre.

1. Inicia sesión en [Docker Hub](https://hub.docker.com/)
2. Ve a tu perfil → **Account Settings**
3. En el menú izquierdo, click en **Security**
4. Click en **New Access Token**
5. Completa:
   - **Access Token Description**: `github-actions` (o cualquier nombre)
   - **Permissions**: Déjalo por defecto (Read, Write, Delete)
6. Click en **Generate**
7.  **COPIA EL TOKEN COMPLETO** (solo aparece una vez)
   - Guárdalo en un lugar seguro (Notepad, 1Password, etc.)

**Ejemplo de token:**
```
dckr_pat_xxxxxxxxxxxxxxxxxxx
```

---

### **PASO 3: Configurar Secrets en GitHub**

Los "Secrets" son valores seguros que GitHub guarda encriptados.

#### **3.1 - Ir a Secrets**

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (pestaña arriba)
3. En el menú izquierdo: **Secrets and variables** → **Actions**

#### **3.2 - Agregar Secret: DOCKER_USERNAME**

1. Click en **New repository secret**
2. **Name**: `DOCKER_USERNAME`
3. **Value**: Tu usuario de Docker Hub (ej: `agsergio04`)
4. Click en **Add secret**

#### **3.3 - Agregar Secret: DOCKER_TOKEN**

1. Click en **New repository secret**
2. **Name**: `DOCKER_TOKEN`
3. **Value**: El token que copiaste en PASO 2
4. Click en **Add secret**

 **Ahora tienes 2 secrets configurados**

---

##  Verificar Configuración

Verifica que tengas todo listo:

- [ ]  Cuenta en Docker Hub creada
- [ ]  Access Token generado
- [ ]  Secret `DOCKER_USERNAME` configurado en GitHub
- [ ]  Secret `DOCKER_TOKEN` configurado en GitHub
- [ ]  Archivos `backend/Dockerfile` existe
- [ ]  Archivos `frontend/Dockerfile` existe

---

##  Usar el GitHub Action

### **Opción 1: Automático (Recomendado)**

Simplemente haz un commit y push a `main`:

```bash
git add .
git commit -m "feat: Nueva funcionalidad"
git push origin main
```

**Automáticamente:**
- El Action se ejecutará
- Las imágenes se construirán
- Se subirán a Docker Hub

### **Opción 2: Manual (Workflow Dispatch)**

Si quieres ejecutar el Action sin hacer push:

1. Ve a tu repositorio en GitHub
2. Click en **Actions** (pestaña arriba)
3. Selecciona **"Despliegue Docker Automático"**
4. Click en **Run workflow** → **Run workflow**

---

##  Ver el Progreso del Action

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **Actions**
3. Verás una lista de ejecuciones recientes
4. Click en la más reciente para ver detalles

**Estados posibles:**
- 🟡 **En progreso** (naranja): Se está ejecutando
- 🟢 **Completado** (verde): Éxito 
- 🔴 **Fallido** (rojo): Error 

---

##  Descargar Imágenes desde Docker Hub

Una vez que se suban las imágenes, cualquiera puede descargarlas:

### **Descargar Backend**
```bash
docker pull agsergio04/ai-interview-backend:latest
```

### **Descargar Frontend**
```bash
docker pull agsergio04/ai-interview-frontend:latest
```

### **Ver en Docker Hub**
```
https://hub.docker.com/r/agsergio04/ai-interview-backend
https://hub.docker.com/r/agsergio04/ai-interview-frontend
```

---

##  Ejecutar las Imágenes Descargadas

### **Backend**
```bash
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://mongo:27017/ai-interview \
  -e JWT_SECRET=tu_secreto \
  -e FRONTEND_URL=http://localhost:3000 \
  -e GEMINI_API_KEY=tu_gemini_key \
  agsergio04/ai-interview-backend:latest
```

### **Frontend**
```bash
docker run -p 3000:3000 \
  -e REACT_APP_API_URL=http://localhost:5000/api \
  -e REACT_APP_GEMINI_API_KEY=tu_gemini_key \
  -e REACT_APP_PAYPAL_CLIENT_ID=tu_paypal_id \
  agsergio04/ai-interview-frontend:latest
```

---

##  Solución de Problemas

### **Problema: "authentication required"**

**Solución:**
- Verifica que `DOCKER_TOKEN` sea el **token**, no la contraseña
- Regenera el token en Docker Hub si olvidaste copiarlo
- Verifica que el nombre del secret sea exacto: `DOCKER_TOKEN`

### **Problema: "Dockerfile not found"**

**Solución:**
- Verifica que exista `backend/Dockerfile`
- Verifica que exista `frontend/Dockerfile`
- El archivo debe llamarse exactamente `Dockerfile` (sin extensión)

### **Problema: El Action no se ejecuta**

**Solución:**
- Verifica que hagas push a la rama `main` (no otra rama)
- Espera unos segundos y refresca la página de Actions
- Ve a Settings → Actions → General → "All workflows have read and write permissions"

### **Problema: Error de build en Docker**

**Solución:**
- Revisa los logs del Action (Actions → click en la ejecución)
- Verifica que el Dockerfile sea válido
- Intenta construir localmente: `docker build -f backend/Dockerfile ./backend`

### **Problema: Las imágenes no aparecen en Docker Hub**

**Solución:**
- Espera 2-5 minutos después de que termine el Action
- Refresca la página de Docker Hub
- Verifica que el Action haya terminado con estado 

---

##  Personalización Avanzada

### **Cambiar nombres de las imágenes**

Edita `.github/workflows/docker-deploy.yml`:

```yaml
# Línea para Backend (cambia "ai-interview-backend")
tags: ${{ secrets.DOCKER_USERNAME }}/nombre-personalizado:latest

# Línea para Frontend (cambia "ai-interview-frontend")
tags: ${{ secrets.DOCKER_USERNAME }}/nombre-personalizado:latest
```

### **Agregar más tags además de "latest"**

```yaml
tags: |
  ${{ secrets.DOCKER_USERNAME }}/ai-interview-backend:latest
  ${{ secrets.DOCKER_USERNAME }}/ai-interview-backend:${{ github.sha }}
```

Esto generaría dos tags:
- `usuario/ai-interview-backend:latest`
- `usuario/ai-interview-backend:abc123def` (commit ID)

### **Ejecutar solo en días específicos**

Agrega al `on:` del workflow:

```yaml
schedule:
  - cron: '0 2 * * 0'  # Cada domingo a las 2 AM UTC
```

---

##  Diagrama del Proceso

```
┌─────────────────────────────────────────┐
│  1. Haces: git push origin main         │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  2. GitHub Actions se activa            │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  3. Se descarga el código               │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   ┌─────────────┐  ┌─────────────┐
   │ Build       │  │ Build       │
   │ Backend IMG │  │ Frontend IMG│
   └────┬────────┘  └────┬────────┘
        │                 │
        └────────┬────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  4. Login a Docker Hub                  │
│     (con secrets)                       │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   ┌──────────────┐ ┌──────────────┐
   │ Push Backend │ │ Push Frontend│
   │ a Hub        │ │ a Hub        │
   └──────────────┘ └──────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  5.  Imágenes disponibles en Hub      │
│     usuario/ai-interview-backend:latest │
│     usuario/ai-interview-frontend:latest│
└─────────────────────────────────────────┘
```

---

##  Enlaces Útiles

- **Docker Hub**: https://hub.docker.com/
- **GitHub Actions Docs**: https://docs.github.com/es/actions
- **Docker Build Action**: https://github.com/docker/build-push-action
- **Docker Login Action**: https://github.com/docker/login-action

---

##  Checklist Final

Antes de hacer push:

- [ ]  Cuenta Docker Hub creada
- [ ]  Token generado y guardado
- [ ]  Secrets `DOCKER_USERNAME` en GitHub
- [ ]  Secrets `DOCKER_TOKEN` en GitHub
- [ ]  Archivos Dockerfile en backend/ y frontend/
- [ ]  Cambios comprometidos localmente
- [ ]  Ready para hacer `git push ` a la rama main

---

**¡Listo! Tu GitHub Action está configurado y funcionando.** 

Cada push a `main` subirá automáticamente las imágenes a Docker Hub.

**Última actualización**: Diciembre 2025
