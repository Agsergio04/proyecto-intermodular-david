# Documentación de Funciones del Backend

> **Nota:** Esta referencia fue generada a partir de la documentación JSDoc y solo incluye funciones encontradas en los primeros resultados. Puede que la lista no sea completa. [Ver más archivos en GitHub](https://github.com/Agsergio04/proyecto-intermodular-david/tree/db802aab54808b2ad0dd9197fef044a7c445c724/docs/GitHub-Action/backend/)

---

## Tabla de Contenidos

- [Modelos y Esquemas](#modelos-y-esquemas)
  - [Question (models/Question.js)](#question-modelsquestionjs)
- [Rutas y Controladores](#rutas-y-controladores)
  - [Servicios de IA (routes/ai.js)](#servicios-de-ia-routesaijs)
- [Clases y Utilidades Generales](#clases-y-utilidades-generales)
  - [Error (MongooseError)](#error-mongooseerror)
  - [AbortError](#aborterror)
  - [Collection (MongoDB)](#collection-mongodb)
  - [EvalOperation (MongoDB)](#evaloperation-mongodb)
  - [Headers (HTTP headers)](#headers-http-headers)
  - [IdTokenClient (Google Auth)](#idtokenclient-google-auth)
  - [SrvPollingEvent (MongoDB)](#srvpollingevent-mongodb)
  - [noop (Lodash)](#noop-lodash)

---

## Modelos y Esquemas

### Question (models/Question.js)

> **Modelo de Mongoose para preguntas individuales en una entrevista.**

- **Definición:**  
  [Ver código fuente](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/models/Question.js)

#### Propiedades

| Nombre           | Tipo                         | Descripción                                    |
|------------------|-----------------------------|------------------------------------------------|
| `interviewId`    | ObjectId (`Interview`)      | Referencia a la Entrevista. *(Requerido)*      |
| `questionText`   | `string`                    | Contenido de la pregunta. *(Requerido)*        |
| `questionAudio`  | `string \| null`            | URL del audio asociado a la pregunta.          |
| `order`          | `number`                    | Secuencia de la pregunta en la entrevista. *(Requerido)* |
| `difficulty`     | `'easy'`, `'medium'`, `'hard'`, `'manual'` | Nivel de dificultad. *(Por defecto: manual)* |
| `responses`      | Array<ObjectId> (`Response`)| Referencias a respuestas asociadas.            |
| `timeLimit`      | `number`                    | Tiempo límite de respuesta en segundos *(Por defecto: 300)* |
| `createdAt`      | `Date`                      | Fecha de creación *(Por defecto: ahora)*       |

#### Ejemplo de Uso

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

---

## Rutas y Controladores

### Servicios de IA (routes/ai.js)

> **Rutas para funcionalidades IA con Google Gemini:**  
> Transcripción de audio, sugerencia de preguntas y evaluación.

#### Endpoints y Ejemplo de Uso

##### POST `/transcribe`
Transcribe audio a texto usando Gemini.

- **Parámetros (`req.body`):**
  - `audioBase64` (`string`, requerido): Audio codificado en base64.
  - `language` (`string`, opcional): Código de idioma.
- **Respuesta (`res.body`):**
  - `{ text: string }`

```js
// Ejemplo de solicitud (fetch)
fetch('/transcribe', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ audioBase64: '...', language: 'es' })
})
.then(r => r.json())
.then(json => console.log(json.text));
```

##### Otras rutas
Hay endpoints similares para:
- Generación de próxima pregunta (NextQuestion)
- Evaluación de respuestas (EvaluateResponse)

Revisar el archivo [routes/ai.js](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/routes/ai.js) para ejemplos y más detalles.

---

## Clases y Utilidades Generales

### Error (MongooseError)

- **Descripción:** Clase base para todos los errores específicos de Mongoose.

#### Constructor

```js
const err = new mongoose.Error('Mensaje de error');
```

- **Parámetros:**
  - `msg` (`String`): Mensaje descriptivo

[Ver JSDoc](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/docs/GitHub-Action/backend/global.html#L1)

---

### AbortError

- **Descripción:** Error lanzado al cancelar peticiones, por ejemplo con `AbortController`.

```js
throw new AbortError();
```

[Ver JSDoc](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/docs/GitHub-Action/backend/global.html#AbortError)

---

### Collection (MongoDB)

- **Descripción:** Clase interna para operaciones con colecciones MongoDB: insert, find, update, etc.

#### Uso ejemplo

```js
import { MongoClient } from 'mongodb';
const client = new MongoClient('mongodb://localhost:27017');
const pets = client.db().collection('pets');

const petCursor = pets.find();
for await (const pet of petCursor) {
  console.log(`${pet.name} is a ${pet.kind}!`);
}
```

[Ver JSDoc](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/docs/GitHub-Action/backend/global.html#Collection)

---

### EvalOperation (MongoDB)

- **Descripción:** Operación interna de MongoDB para evaluar código JavaScript directamente en el motor.

[Ver JSDoc](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/docs/GitHub-Action/backend/EvalOperation.html)

---

### Headers (HTTP headers)

- **Descripción:** Clase para operaciones con cabeceras HTTP (similar a Fetch API).

#### Uso ejemplo

```js
const headers = new Headers({ 'Content-Type': 'application/json' });
headers.append('X-Custom-Header', 'valor');
```

[Ver JSDoc](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/docs/GitHub-Action/backend/Headers.html)

---

### IdTokenClient (Google Auth)

- **Descripción:** Cliente para obtener Google ID tokens del Metadata Server.
- [Ver docs Google](https://cloud.google.com/docs/authentication/get-id-token#metadata-server)

```js
const client = new IdTokenClient();
```

[Ver JSDoc](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/docs/GitHub-Action/backend/IdTokenClient.html)

---

### SrvPollingEvent (MongoDB)

- **Descripción:** Evento interno de MongoDB usado en la gestión de descubrimiento y polling DNS SRV.

[Ver JSDoc](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/docs/GitHub-Action/backend/SrvPollingEvent.html)

---

### noop (Lodash)

- **Descripción:** Función que no hace nada y retorna `undefined`. Útil como callback por defecto.

```js
_.noop(); // => undefined
```

[Ver JSDoc](https://github.com/Agsergio04/proyecto-intermodular-david/blob/db802aab54808b2ad0dd9197fef044a7c445c724/docs/GitHub-Action/backend/node_modules_lodash_noop.js.html)

---

---

**Importante:**  
La documentación cubre solo los archivos y funciones localizados en los primeros resultados. Para una referencia más completa, revisa directamente el [repositorio backend en GitHub](https://github.com/Agsergio04/proyecto-intermodular-david/tree/db802aab54808b2ad0dd9197fef044a7c445c724/docs/GitHub-Action/backend).
