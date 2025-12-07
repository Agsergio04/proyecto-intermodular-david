# Análisis de Errores en el Frontend - Entrevistas

## Problemas Encontrados

### 1. **Variable de Entorno Incorrecta** ⚠️ CRÍTICO
**Archivo**: `frontend/.env.local`

```dotenv
REACT_APP_API_URL=http://localhost:5001/api
```

**Problema**: El puerto es `5001` pero el backend corre en puerto `5000`.

**Solución**: Cambiar a:
```dotenv
REACT_APP_API_URL=http://localhost:5000/api
```

---

### 2. **Paths de las Rutas API Incorrectos** ⚠️ CRÍTICO
**Archivo**: `frontend/src/api/index.js`

Las rutas están duplicando `/api`:

```javascript
// INCORRECTO - llama a /api/interviews/generate-questions
generateQuestions: (data) => api.post('/interviews/generate-questions', data),

// CORRECTO - debería ser solo /interviews/generate-questions
// porque baseURL ya tiene /api
```

**Problema**: El `baseURL` de axios ya es `http://localhost:5000/api`, así que al poner `/interviews/generate-questions` hace la llamada correcta. **ESTO ESTÁ BIEN**.

---

### 3. **Inconsistencia en el Nombre del Campo de Pregunta** ⚠️ IMPORTANTE
**Archivo**: `frontend/src/hooks/useDashboard.jsx`

Línea ~125-130:
```javascript
questions = [
    { question: "Pregunta 1", difficulty: formData.difficulty },  // ❌ "question"
    { question: "Pregunta 2", difficulty: formData.difficulty },
    // ...
];
```

**Problema**: El backend espera `questionText` pero se está enviando `question`.

**Solución**: Cambiar a:
```javascript
questions = [
    { questionText: "Pregunta 1", difficulty: formData.difficulty },  // ✅ "questionText"
    { questionText: "Pregunta 2", difficulty: formData.difficulty },
    // ...
];
```

---

### 4. **Falta de Manejo de Errores en InterviewSession** ⚠️
**Archivo**: `frontend/src/pages/InterviewSession.jsx`

En la función `handleSaveResponse()` no se valida si `question._id` existe.

**Solución**: Añadir validación:
```javascript
const handleSaveResponse = async () => {
    if (!question?._id) {
        toast.error('Error: No se encontró el ID de la pregunta');
        return;
    }
    // ... resto del código
};
```

---

### 5. **Estado de localStorage No Sincronizado** ⚠️
**Archivo**: `frontend/src/hooks/useDashboard.jsx`

Línea ~53:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
setIsPremium(user?.subscriptionStatus === 'premium');
```

**Problema**: Si el usuario no está en localStorage, causará un error silencioso.

**Solución**: Añadir validación:
```javascript
const user = JSON.parse(localStorage.getItem('user') || '{}');
setIsPremium(user?.subscriptionStatus === 'premium');
```

---

## Resumen de Cambios Necesarios

| # | Archivo | Problema | Severidad |
|---|---------|----------|-----------|
| 1 | `.env.local` | Puerto API incorrecto (5001 → 5000) | 🔴 CRÍTICO |
| 2 | `useDashboard.jsx` | Campo `question` en vez de `questionText` | 🟠 ALTA |
| 3 | `InterviewSession.jsx` | Falta validación de question._id | 🟡 MEDIA |
| 4 | `useDashboard.jsx` | Manejo inseguro de user en localStorage | 🟡 MEDIA |


