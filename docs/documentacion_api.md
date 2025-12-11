# Documentación de la API

> **Nota:** Esta documentación solo hace referencia a los endpoints encontrados en los primeros archivos de rutas y middleware identificados de tu backend. Los resultados están limitados, y podrían existir otros endpoints. Consulta [el repositorio](https://github.com/Agsergio04/proyecto-intermodular-david/search?q=router) para más detalles actualizados.

## Prefijo base de la API
Todos los endpoints se encuentran bajo el prefijo: `/api/`

---

## Autenticación - `/api/auth`

### Registro de usuario

- **Método:** `POST`
- **Endpoint:** `/api/auth/register`
- **Descripción:** Registra un nuevo usuario.
- **Parámetros requeridos (body, JSON):**
  - `email` (string, requerido)
  - `password` (string, mínimo 6 caracteres)
  - `firstName` (string)
  - `lastName` (string)
- **Ejemplo de respuesta (éxito, 201):**
  ```json
  {
    "message": "User registered successfully",
    "user": { "id": "...", "email": "...", "firstName": "...", "lastName": "..." }
  }
  ```
- **Ejemplo de respuesta (error, 400/409):**
  ```json
  { "message": "Email already exists" }
  ```

### Inicio de sesión

- **Método:** `POST`
- **Endpoint:** `/api/auth/login`
- **Descripción:** Inicia sesión y devuelve un JWT.
- **Parámetros requeridos (body, JSON):**
  - `email` (string)
  - `password` (string)
- **Ejemplo de respuesta (éxito, 200):**
  ```json
  { "token": "<JWT>", "user": { "id": "...", "email": "..." } }
  ```
- **Ejemplo de respuesta (error, 401):**
  ```json
  { "message": "Invalid credentials" }
  ```

### Información de perfil autenticado

- **Método:** `GET`
- **Endpoint:** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Descripción:** Devuelve los datos del usuario autenticado.
- **Ejemplo de respuesta (éxito, 200):**
  ```json
  { "user": { "id": "...", "email": "...", "firstName": "...", "lastName": "..." } }
  ```

### Actualización de perfil

- **Método:** `PUT`
- **Endpoint:** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body opcional:** `{ "firstName": "...", "lastName": "..." }`
- **Descripción:** Actualiza el perfil del usuario autenticado.

### Cambio de contraseña

- **Método:** `PUT`
- **Endpoint:** `/api/auth/change-password`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "currentPassword": "...", "newPassword": "..." }`
- **Descripción:** Cambia la contraseña del usuario autenticado.

---

## Entrevistas - `/api/interviews`

### Crear una nueva entrevista

- **Método:** `POST`
- **Endpoint:** `/api/interviews/`
- **Headers:** `Authorization: Bearer <token>`
- **Descripción:** Crea una nueva entrevista.

### Obtener entrevistas del usuario

- **Método:** `GET`
- **Endpoint:** `/api/interviews/`
- **Headers:** `Authorization: Bearer <token>`
- **Descripción:** Lista todas las entrevistas.

### Consultar entrevista por ID

- **Método:** `GET`
- **Endpoint:** `/api/interviews/:interviewId`
- **Headers:** `Authorization: Bearer <token>`
- **Descripción:** Detalles de una entrevista.

### Actualizar estado o repositorio
- **PUT** `/api/interviews/:interviewId/status`
- **PUT** `/api/interviews/:interviewId/repository`
- Ambos requieren autenticación y actualizan el estado o repo asociado.

### Borrar entrevista
- **DELETE** `/api/interviews/:interviewId`
- Requiere autenticación.

---

## Respuestas de entrevista - `/api/responses`

### Enviar respuesta

- **POST** `/api/responses/`
- **Headers:** `Authorization: Bearer <token>`
- Body: info de la respuesta

### Obtener respuestas por entrevista

- **GET** `/api/responses/interview/:interviewId`

### Generar feedback IA global

- **POST** `/api/responses/interview/:interviewId/generate-feedback`

### Obtener/editar respuesta concreta

- **GET/PUT** `/api/responses/:responseId`

---

## Estadísticas - `/api/stats`

### General del usuario

- **GET** `/api/stats/`
- **Headers:** `Authorization: Bearer <token>`

### Por entrevista

- **GET** `/api/stats/interview/:interviewId`

### Tendencias

- **GET** `/api/stats/trends`

---

## Inteligencia Artificial (IA) - `/api/ai`

### Transcripción (audio a texto)

- **POST** `/api/ai/transcribe`
- **Headers:** `Authorization: Bearer <token>`
- Body: `{ "audioBase64": "...", "language": "es|en" }`

### Próxima pregunta para entrevista

- **POST** `/api/ai/next-question`
- **Headers:** `Authorization: Bearer <token>`
- Body: `{ interviewHistory, profession, language?, difficulty? }`

### Evaluar respuesta

- **POST** `/api/ai/evaluate-response`
- **Headers:** `Authorization: Bearer <token>`
- Body: `{ question, response, profession, language? }`

---

## Análisis de repositorios GitHub (Gitinest) - `/api/gitinest`

### Generar texto y preguntas desde un repo

- **POST** `/api/gitinest/`
- **Body:** `{ "repoUrl": "https://github.com/user/repo" }`
- **Descripción:** Analiza un repositorio y devuelve texto y preguntas generadas por IA.
- **No requiere autenticación.**
- **Ejemplo de uso:**
  ```bash
  curl -X POST http://localhost:5000/api/gitinest \
    -H "Content-Type: application/json" \
    -d '{"repoUrl": "https://github.com/user/repo"}'
  ```

---

## Notas

- La mayoría de endpoints requieren autenticación usando `Authorization: Bearer <token>`.
- Los endpoints pueden responder con códigos de error comunes: `400`, `401`, `404`, `500`.
- Consulta la implementación concreta para detalles de formato y posibles respuestas adicionales: [Ver código fuente y más rutas](https://github.com/Agsergio04/proyecto-intermodular-david/search?q=router)
