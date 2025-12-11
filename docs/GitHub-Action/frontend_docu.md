# Documentación de funciones del código (Backend y Frontend)

## Backend

La documentación se encuentra centralizada en [`docs/GitHub-Action/backend_docu.md`](https://github.com/Agsergio04/proyecto-intermodular-david/blob/6737734988737469907c7fb850daeae9aeb0d41b/docs/GitHub-Action/backend_docu.md) y referencias directas a los archivos generados con JSDoc en la carpeta `docs/GitHub-Action/backend/`.

### Modelos y Esquemas

#### Question (`models/Question.js`)
- **Propiedades**:
  | Nombre       | Tipo      | Descripción                                   |
  | ------------ | --------- | --------------------------------------------- |
  | interviewId  | ObjectId  | Referencia a la entrevista                    |
  | questionText | String    | Texto de la pregunta                          |
  | questionAudio| String    | URL de audio de la pregunta                   |
  | order        | Number    | Orden en la entrevista                        |
  | difficulty   | String    | Dificultad (“easy”, “medium”, “hard”)         |
  | responses    | Array     | Respuestas asociadas                          |
  | timeLimit    | Number    | Tiempo límite en segundos (Def: 300)          |
  | createdAt    | Date      | Fecha de creación (Def: ahora)                |

- **Ejemplo de uso**:
  ```js
  const question = new Question({
    interviewId: someInterviewId,
    questionText: "¿Cuál es tu mayor fortaleza?",
    questionAudio: "https://audio.example.com/q1.mp3",
    order: 1,
    difficulty: "medium",
    responses: [],
    timeLimit: 120
  });
  await question.save();
  ```
- [Ver JSDoc](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/docs/GitHub-Action/backend/models_Question.js.html)

---

### Rutas y Controladores

#### Servicios de IA (`routes/ai.js`)

> **Rutas para IA con Google Gemini:** Transcripción de audio, sugerencia de preguntas y evaluación.

- **POST `/transcribe`**: Transcribe audio a texto usando Gemini.
  - **Parámetros** (`req.body`):
    - `audioBase64` (`string`, requerido): Audio codificado en base64.
    - `language` (`string`, opcional): Código de idioma.
  - **Respuesta**: `{ text: string }`
  - **Ejemplo**:
    ```js
    fetch('/transcribe', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64: '...', language: 'es' })
    }).then(r => r.json()).then(json => console.log(json.text));
    ```
  - Otros endpoints similares:
    - **NextQuestion**: generación de próxima pregunta IA
    - **EvaluateResponse**: evaluación automática de respuesta
  - [Ver archivo completo](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/routes/ai.js)
  - [JSDoc detalles](https://github.com/Agsergio04/proyecto-intermodular-david/blob/6737734988737469907c7fb850daeae9aeb0d41b/docs/GitHub-Action/backend/module-routes_ai.html)

---

### Clases y Utilidades Generales

- **EvalOperation (MongoDB)**
  - Operación interna para evaluar código JavaScript en MongoDB.
  - [JSDoc](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/docs/GitHub-Action/backend/EvalOperation.html)

- **Headers (HTTP headers)**
  - Clase para manejo de cabeceras (similar Fetch API).
  - **Ejemplo**:
    ```js
    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-Custom-Header', 'valor');
    ```
  - [JSDoc y métodos](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/docs/GitHub-Action/backend/Headers.html)

- **IdTokenClient (Google Auth)**
  - Cliente para obtener Google ID tokens.
  - **Ejemplo**:
    ```js
    const client = new IdTokenClient();
    ```
  - [JSDoc](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/docs/GitHub-Action/backend/IdTokenClient.html)

- **noop (Lodash)**
  - Función vacía (`undefined`).
  - **Ejemplo**:
    ```js
    _.noop(); // => undefined
    ```
  - [JSDoc](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/docs/GitHub-Action/backend/node_modules_lodash_noop.js.html)

---

**Notas generales:**  
Consulta la [documentación API](https://github.com/Agsergio04/proyecto-intermodular-david/blob/6737734988737469907c7fb850daeae9aeb0d41b/docs/documentacion_api.md) para ver rutas detalladas, requerimientos de autenticación y ejemplos adicionales.

---

## Frontend

La documentación de funciones frontend está en la carpeta [`docs/GitHub-Action/frontend/`](https://github.com/Agsergio04/proyecto-intermodular-david/tree/6737734988737469907c7fb850daeae9aeb0d41b/docs/GitHub-Action/frontend).

### Módulos principales

- **apiClient** (`api/api.js`)
  - Cliente HTTP basado en Axios.
  - Maneja token JWT, logging, reintentos, y URLs base.
  - La instancia de `api` se usa para consumir la API backend.
  - **Ejemplo**:
    ```js
    // Peticiones con token, logging y handlers automáticos
    const users = await api.get('/users');
    const newPost = await api.post('/posts', postData);
    ```
  - [Ver JSDoc y detalles](https://github.com/Agsergio04/proyecto-intermodular-david/blob/6737734988737469907c7fb850daeae9aeb0d41b/docs/GitHub-Action/frontend/module-apiClient.html)

---

- **services** (`frontend/services/`)
  - Servicios especializados para autenticación, entrevistas, respuestas, estadísticas, IA, etc.
  - [Ver JSDoc](https://github.com/Agsergio04/proyecto-intermodular-david/blob/6737734988737469907c7fb850daeae9aeb0d41b/docs/GitHub-Action/frontend/module-services.html)

- **authService.logout()**
  - Cierra la sesión local (borra datos y token en el frontend).
  - No involucra requerimiento HTTP.
  - **Retorna:** `void`
  - [Ver JSDoc](https://github.com/Agsergio04/proyecto-intermodular-david/blob/6737734988737469907c7fb850daeae9aeb0d41b/docs/GitHub-Action/frontend/module-services-authService.html)

---

- **useHeader()** (`hooks/useHeader.jsx`)
  - Hook React para gestionar estado de cabecera: autenticación, idioma, tema, menú móvil.
  - **Retorna:**
    - `isAuthenticated` (`boolean`)
    - `isDark` (`boolean`)
    - `language` (`string`)
    - `mobileMenuOpen` (`boolean`)
    - `handleLanguageChange`, `handleThemeToggle`, `navigateTo` (`function`)
  - **Ejemplo:**
    ```js
    const {
      isAuthenticated, isDark, language, mobileMenuOpen,
      handleLanguageChange, handleThemeToggle, navigateTo
    } = useHeader();
    ```
  - [Ver JSDoc](https://github.com/Agsergio04/proyecto-intermodular-david/blob/6737734988737469907c7fb850daeae9aeb0d41b/docs/GitHub-Action/frontend/module-useHeader.html)

---

- **Ejemplo de parámetros de componentes**

  En varios componentes se documenta el nombre, tipo y descripción clara de cada parámetro.  
  Ejemplo (de PlanComponent):

  | Nombre    | Tipo            | Descripción                      |
  |-----------|-----------------|----------------------------------|
  | period    | string (opcional)     | Periodo de facturación         |
  | features  | Array.<string>  | Lista de características         |
  | cta       | string          | Llamada a la acción              |

  [Ver tabla ejemplo](https://github.com/Agsergio04/proyecto-intermodular-david/blob/6737734988737469907c7fb850daeae9aeb0d41b/docs/GitHub-Action/frontend/module-Home.html)

---

- **Localización / i18n**
  - La función `t` y los objetos de traducción incluyen descripción y props por cada clave.
  - [Ver ejemplo](https://github.com/Agsergio04/proyecto-intermodular-david/blob/6737734988737469907c7fb850daeae9aeb0d41b/docs/GitHub-Action/frontend/global.html)

---

**Referencia completa**  
Para visualizar toda la documentación, revisa los archivos `.html` generados por JSDoc en las carpetas mencionadas.

- [Backend JSDoc (listado)](https://github.com/Agsergio04/proyecto-intermodular-david/tree/6737734988737469907c7fb850daeae9aeb0d41b/docs/GitHub-Action/backend)
- [Frontend JSDoc (listado)](https://github.com/Agsergio04/proyecto-intermodular-david/tree/6737734988737469907c7fb850daeae9aeb0d41b/docs/GitHub-Action/frontend)

---
