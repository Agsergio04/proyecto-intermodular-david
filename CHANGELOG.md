# Registro de Cambios

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto sigue [Versionado Semántico](https://semver.org/lang/es/).

## [Sin publicar]

## [1.0.0] - 2025-12-04

### Añadido

- **Sistema de puntuación de respuestas**: Implementación del sistema de puntuación para las respuestas de los usuarios junto con la recepción de feedback personalizado.
- **Soporte para dificultad Manual**: Actualización de las tarjetas (cards) del dashboard para soportar la dificultad "Manual" en las entrevistas.
- **Entrevistas manuales optimizadas**: Mejora en el flujo de entrevistas creadas manualmente.
- **Cards de IA y manuales en Dashboard**: Inclusión en el panel de control de tarjetas diferenciadas para entrevistas generadas por IA y entrevistas manuales.
- **Descarga de reportes**: Nueva funcionalidad para descargar reportes de entrevistas desde el menú de Interview.
- **Visualización única de respuestas**: Sistema mejorado para ver las respuestas generadas de forma individual.
- **Generación de preguntas con Gemini AI**: Creación de preguntas utilizando la inteligencia artificial de Gemini y validación de las respuestas del usuario mediante dicha IA.

### Modificado

- **Refactorización del menú de Interview**: Mejora en la organización y estructura del menú de entrevistas.

---

## Sprints de la Semana (1-4 Diciembre 2025)

### Sprint Actual - Funcionalidades de IA y Feedback

| Fecha | Commit | Descripción |
|-------|--------|-------------|
| 03/12/2025 | Puntuación de respuestas | Sistema de puntuación con feedback |
| 03/12/2025 | Cards para dificultad Manual | Actualización del dashboard |
| 03/12/2025 | Entrevistas manuales optimizadas | Mejora del flujo manual |
| 03/12/2025 | Cards IA/Manual en Dashboard | Diferenciación de tipos de entrevista |
| 03/12/2025 | Menú Interview refactorizado | Reorganización y descarga de reportes |
| 03/12/2025 | Visualización de respuestas | Vista individual mejorada |
| 03/12/2025 | Preguntas con Gemini | Generación y validación con IA |
| 01/12/2025 | Creación de preguntas por IA | Sistema base de generación |
| 01/12/2025 | Paso del prompt al backend | Integración frontend-backend |

### Notas del Release

Este sprint se ha centrado en la implementación completa del sistema de entrevistas inteligentes con las siguientes mejoras clave:

1. **Integración con Gemini AI**: Las preguntas ahora pueden ser generadas automáticamente utilizando la API de Gemini, proporcionando una experiencia más dinámica y personalizada.

2. **Sistema de Feedback**: Los usuarios reciben retroalimentación inmediata sobre sus respuestas, incluyendo una puntuación que les ayuda a evaluar su rendimiento.

3. **Flexibilidad en tipos de entrevista**: El sistema ahora soporta tanto entrevistas generadas por IA como entrevistas creadas manualmente, cada una con su visualización diferenciada en el dashboard.

4. **Mejoras de UX**: Refactorización del menú de entrevistas y nueva funcionalidad de descarga de reportes para facilitar el seguimiento del progreso.

---

## Historial de Versiones Anteriores

### Sprint 4 - Backend (27/11/2025)

- Refactorización de controladores y rutas del backend
- Configuración de Docker y guía de preparación
- Mejoras de seguridad (eliminación de API keys en documentación)

### Sprint 3 - Configuración y Despliegue (25-28/11/2025)

- Configuración completa de Docker
- Integración con Cloudflare Pages
- Optimización de dependencias y lockfiles
- Creación de variables para URL del repositorio

---

*Para más información sobre cómo contribuir a este proyecto, consulte el archivo README.md*
