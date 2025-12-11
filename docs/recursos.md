# Gestión de Recursos Materiales, Humanos y Tiempos - PrepáraT (InterviewAI)

## Índice
1. [Introducción](#introducción)
2. [Recursos Humanos](#recursos-humanos)
3. [Roles y Responsabilidades Rotativas](#roles-y-responsabilidades-rotativas)
4. [Planificación de Sprints](#planificación-de-sprints)
5. [Velocidad del Equipo](#velocidad-del-equipo)
6. [Recursos Materiales](#recursos-materiales)
7. [APIs y Servicios Externos](#apis-y-servicios-externos)
8. [Credenciales y Accesos](#credenciales-y-accesos)
9. [Gestión de Riesgos Temporales](#gestión-de-riesgos-temporales)
10. [GitHub Projects - Configuración](#github-projects-configuración)
11. [Historial de Actualizaciones](#historial-de-actualizaciones)

---

## 1. Introducción

Este documento centraliza toda la información sobre **recursos materiales, humanos y temporales** del proyecto **PrepáraT (InterviewAI)**. Se mantiene actualizado por el **Scrum Master** en cada sprint y es de consulta obligatoria para todo el equipo.

**Última actualización:** 11 de diciembre de 2024  
**Responsable actual:** David Aguilar (Scrum Master Sprint 3)  
**Versión:** 3.2  
**Próxima revisión:** 15 de diciembre de 2024 (Fin Sprint 3)

---

## 2. Recursos Humanos

### 2.1 Equipo del Proyecto

| Miembro | Rol Principal | Especialización | Disponibilidad | Contacto | GitHub |
|---------|---------------|-----------------|----------------|----------|--------|
| **Sergio García** (@Agsergio04) | Full-Stack Developer | Backend Node.js, DevOps, MongoDB, Docker | 40h/semana | sergio.garcia@preparat.com | @Agsergio04 |
| **Pablo Sanz** (@pablitoclavito04) | Full-Stack Developer | Frontend React, UI/UX, Testing, Figma | 40h/semana | pablo.sanz@preparat.com | @pablitoclavito04 |

### 2.2 Estructura del Equipo

**Metodología:** Scrum Ágil con Kanban  
**Duración de Sprints:** 1 semana (7 días naturales)  
**Total de Sprints:** 6 sprints  
**Período del Proyecto:** 31 de octubre - 11 de diciembre de 2024

**Reuniones:**
- **Daily Standup:** Lunes a Viernes 9:00 AM CET (15 min) - Async en GitHub Issues
- **Sprint Planning:** Primer día de Sprint - Lunes 10:00 AM CET (1h)
- **Sprint Review:** Último día de Sprint - Viernes 4:00 PM CET (1h)
- **Sprint Retrospective:** Último día de Sprint - Viernes 5:00 PM CET (30 min)

### 2.3 Capacidad del Equipo

**Horas disponibles por persona:**
- **Disponibilidad teórica:** 40h/semana por persona
- **Disponibilidad real (descontando overhead):** 35h/semana por persona
- **Total equipo:** 70h/semana (2 personas)

**Overhead típico por sprint:**
- Reuniones (Planning, Review, Retro, Dailies): 3h/semana
- Code reviews: 2h/semana
- Testing manual: 2h/semana
- Documentación: 1h/semana
- Debugging imprevisto: 2h/semana
- **Total overhead:** ~10h/semana por persona

---

## 3. Roles y Responsabilidades Rotativas

### 3.1 Sistema de Rotación de Roles

El equipo implementa **rotación de roles cada sprint** para:
- ✅ Desarrollo de habilidades transversales
- ✅ Evitar cuellos de botella en conocimiento
- ✅ Mejor comprensión del proyecto completo
- ✅ Mejora de ownership y autonomía

| Sprint | Período | Scrum Master | Tech Lead | QA Lead | DevOps Lead |
|--------|---------|--------------|-----------|---------|-------------|
| **Sprint 1** | 31/10 - 6/11 | @Agsergio04 | @Agsergio04 | @pablitoclavito04 | @Agsergio04 |
| **Sprint 2** | 7/11 - 13/11 | @pablitoclavito04 | @Agsergio04 | @pablitoclavito04 | @Agsergio04 |
| **Sprint 3** | 14/11 - 20/11 | @Agsergio04 | @pablitoclavito04 | @Agsergio04 | @pablitoclavito04 |
| **Sprint 4** | 21/11 - 27/11 | @pablitoclavito04 | @Agsergio04 | @pablitoclavito04 | @Agsergio04 |
| **Sprint 5** | 28/11 - 4/12 | @Agsergio04 | @pablitoclavito04 | @Agsergio04 | @pablitoclavito04 |
| **Sprint 6** | 5/12 - 11/12 | @pablitoclavito04 | @Agsergio04 | @pablitoclavito04 | @Agsergio04 |

### 3.2 Responsabilidades por Rol

#### Scrum Master
**Responsable:** Mantener el proceso Scrum y remover impedimentos

**Tareas diarias:**
- ✅ **Actualizar GitHub Projects DIARIAMENTE** (obligatorio antes de 10:00 AM)
- ✅ Facilitar Daily Standups (async en GitHub Issues)
- ✅ Identificar y remover impedimentos del equipo
- ✅ Asegurar que se cumplan ceremonias Scrum
- ✅ Mantener este documento `/docs/recursos.md` actualizado
- ✅ Calcular velocidad del sprint al finalizar
- ✅ Gestionar riesgos temporales con buffer

**Entregables del rol:**
- GitHub Projects actualizado en tiempo real
- Documento `/docs/recursos.md` actualizado semanalmente
- Cálculo de velocidad al final de cada sprint
- Identificación de riesgos en Sprint Planning

#### Tech Lead
**Responsable:** Calidad técnica y decisiones arquitectónicas

**Tareas:**
- ✅ Revisar **TODOS** los Pull Requests antes de merge
- ✅ Tomar decisiones arquitectónicas (consultar con equipo)
- ✅ Resolver dudas técnicas del equipo
- ✅ Asegurar estándares de código (ESLint, Prettier)
- ✅ Diseñar estructura de base de datos
- ✅ Revisar integraciones con APIs externas

**Criterios de aprobación de PR:**
- Código sigue convenciones del proyecto
- Tests pasando (>80% cobertura si aplica)
- Sin warnings en consola
- Documentación JSDoc completa
- Sin vulnerabilidades de seguridad

#### QA Lead
**Responsable:** Calidad del producto y testing

**Tareas:**
- ✅ Planificar estrategia de testing por sprint
- ✅ Ejecutar pruebas manuales end-to-end
- ✅ Documentar bugs encontrados en GitHub Issues
- ✅ Validar criterios de aceptación de tareas
- ✅ Crear y mantener casos de prueba
- ✅ Verificar accesibilidad y UX

**Entregables del rol:**
- Reporte de bugs por sprint
- Plan de testing actualizado
- Validación de criterios de aceptación

#### DevOps Lead
**Responsable:** Infraestructura, deploy y CI/CD

**Tareas:**
- ✅ Gestionar deployments a staging/producción
- ✅ Mantener CI/CD pipelines (GitHub Actions)
- ✅ Monitorizar infraestructura (Docker, MongoDB)
- ✅ Gestionar backups de base de datos
- ✅ Configurar variables de entorno
- ✅ Optimizar Dockerfiles

**Entregables del rol:**
- Pipelines de CI/CD funcionales
- Documentación de deployment
- Backups programados

### 3.3 Matriz de Responsabilidades (RACI)

| Tarea | Scrum Master | Tech Lead | QA Lead | DevOps Lead | Ambos Devs |
|-------|--------------|-----------|---------|-------------|------------|
| Actualizar GitHub Projects | **R** | C | I | I | I |
| Code Reviews | C | **R** | I | C | A |
| Testing Manual | I | C | **R** | I | A |
| Deployments | C | C | I | **R** | I |
| Daily Standups | **R** | A | A | A | A |
| Sprint Planning | **R** | C | C | C | A |
| Documentación técnica | C | C | C | C | **R** |
| Gestión de Riesgos | **R** | C | C | C | I |
| Decisiones arquitectura | C | **A** | I | C | C |
| Crear/cerrar Issues | A | C | **R** | C | **R** |

**Leyenda:**
- **R** (Responsible): Responsable de ejecutar la tarea
- **A** (Accountable): Responsable final/aprobador
- **C** (Consulted): Consultado antes de tomar decisión
- **I** (Informed): Informado del resultado

---

## 4. Planificación de Sprints

### 4.1 Calendario Completo de Sprints

| Sprint | Fecha Inicio | Fecha Fin | Días | Estado | Objetivo Principal | Horas Est. |
|--------|--------------|-----------|------|--------|-------------------|------------|
| **Sprint 1** | 31/10/2024 | 06/11/2024 | 7 | ✅ Completado | Setup base e infraestructura | 19.5h |
| **Sprint 2** | 07/11/2024 | 13/11/2024 | 7 | ✅ Completado | CRUD entrevistas + Auth | 25.5h |
| **Sprint 3** | 14/11/2024 | 20/11/2024 | 7 | 🔄 En progreso | Integración OpenAI/Gemini | 41h |
| **Sprint 4** | 21/11/2024 | 27/11/2024 | 7 | 📅 Planificado | Reportes y Analytics | 46.5h |
| **Sprint 5** | 28/11/2024 | 04/12/2024 | 7 | 📅 Planificado | Validación y optimización UX | 29h |
| **Sprint 6** | 05/12/2024 | 11/12/2024 | 7 | 📅 Planificado | Documentación y CI/CD | 40.5h |

**Totales:**
- **Duración total:** 6 semanas (42 días naturales)
- **Horas estimadas totales:** 202 horas
- **Horas backend:** 100 horas
- **Horas frontend:** 93 horas
- **Horas DevOps:** 9 horas

---

### 4.2 Sprint 1 - Setup Base e Infraestructura ✅

**Período:** 31 de octubre - 6 de noviembre de 2024  
**Scrum Master:** @Agsergio04  
**Estado:** ✅ COMPLETADO

#### Objetivos
- Configurar infraestructura inicial (Docker, Git, MongoDB)
- Crear base de datos con 5 entidades
- Implementar sistema de almacenamiento de audios
- Crear componentes UI base
- Integrar Text-to-Speech para preguntas

#### Story Points
- **Planificados:** 34 SP
- **Completados:** 32 SP
- **Velocidad:** 32 SP
- **Burndown:** 94%

#### Distribución de Horas
| Área | Horas | Asignado |
|------|-------|----------|
| Backend | 8h | @Agsergio04 |
| Frontend | 9h | @Agsergio04 |
| Base de Datos | 2.5h | @Agsergio04 |
| **TOTAL** | **19.5h** | - |

#### Tareas Completadas
**Backend:**
- [x] Crear endpoint `POST /api/ai/preprocess-audio` (2h)
- [x] Integrar Text-to-Speech (2h)
- [x] Sistema almacenamiento temporal de audios (2h)
- [x] Optimizar tiempo de generación (1h)
- [x] Documentar en API.md (1h)

**Frontend:**
- [x] Crear componente `LoadingScreen` reutilizable (2h)
- [x] Integrar en `Interviews.jsx` (1.5h)
- [x] Mejorar `InterviewSession.jsx` design (3h)
- [x] Animaciones transición entre preguntas (1.5h)
- [x] Optimizar para móviles (1h)

**Base de Datos:**
- [x] Crear 5 entidades: User, Interview, Question, Answer, Feedback (1h)
- [x] Definir relaciones y dependencias (1h)
- [x] Validaciones de entidades (0.5h)

#### Métricas
- **Commits:** 45
- **Pull Requests:** 8
- **Code Reviews:** 12
- **Bugs encontrados:** 3 (todos resueltos)

#### Retrospectiva
✅ **Qué funcionó bien:**
- Comunicación fluida entre @Agsergio04 y @pablitoclavito04
- División clara de tareas (backend vs frontend)
- Docker Compose funcional desde día 1

⚠️ **Qué mejorar:**
- Estimaciones fueron optimistas (32 vs 34 SP)
- Falta de tests unitarios
- Documentación tardía

🎯 **Acciones para próximo sprint:**
- Implementar TDD (Test-Driven Development)
- Daily standups más cortos (<10 min)
- Documentar mientras desarrollamos

#### Riesgos Identificados y Mitigados
| Riesgo | Probabilidad | Impacto | Mitigación Aplicada | Resultado |
|--------|--------------|---------|---------------------|-----------|
| Problemas con API de TTS | Media | Alto | Plan B con Google Cloud TTS | ✅ No fue necesario |
| Latencia en generación audios | Media | Medio | Caché + procesamiento async | ✅ <5 seg logrado |
| Problemas Docker | Baja | Alto | Testing en múltiples máquinas | ✅ Sin problemas |

#### Buffer de Tiempo
- **Asignado:** 2 días (10h)
- **Utilizado:** 1.5 días (7.5h)
- **Motivo:** Problemas de configuración MongoDB Atlas, debug Docker networking

---

### 4.3 Sprint 2 - CRUD y Autenticación ✅

**Período:** 7 de noviembre - 13 de noviembre de 2024  
**Scrum Master:** @pablitoclavito04  
**Estado:** ✅ COMPLETADO

#### Objetivos
- Implementar CRUD completo de entrevistas
- Sistema de estados (DRAFT → SCHEDULED → IN_PROGRESS → COMPLETED)
- Crear componentes base de configuración
- Página de creación de entrevista multi-paso
- Integración con API backend

#### Story Points
- **Planificados:** 38 SP
- **Completados:** 36 SP
- **Velocidad:** 36 SP
- **Burndown:** 95%

#### Distribución de Horas
| Área | Horas | Asignado |
|------|-------|----------|
| Backend | 10h | @Agsergio04 |
| Frontend | 15.5h | @pablitoclavito04 + @Agsergio04 |
| **TOTAL** | **25.5h** | - |

#### Tareas Completadas
**Backend:**
- [x] Crear `InterviewService` (1h)
- [x] Endpoints CRUD: POST/GET/PUT/DELETE `/api/interviews` (3h)
- [x] Enum `InterviewStatus` con transiciones (1.5h)
- [x] Validaciones de negocio (1h)
- [x] Endpoint `PATCH /api/interviews/:id/status` (0.5h)
- [x] Logs de cambios de estado (0.5h)
- [x] Tests unitarios >80% cobertura (1.5h)
- [x] Documentar en API.md (1h)

**Frontend:**
- [x] Componente `QuestionSelector` (1h)
- [x] Componente `InterviewParametersForm` (1.5h)
- [x] `DateTimePicker` (1h)
- [x] `DurationSelector` (0.5h)
- [x] `QuestionPreview` (1h)
- [x] Validaciones React Hook Form (1h)
- [x] Storybook para componentes (1h)
- [x] Tests unitarios (1.5h)
- [x] Página `CreateInterviewPage` (2h)
- [x] Flujo multi-paso (1h)
- [x] Integración API (1h)
- [x] Estados de carga (1h)
- [x] Notificaciones éxito/error (0.5h)
- [x] Vista resumen pre-guardar (0.5h)

#### Métricas
- **Commits:** 52
- **Pull Requests:** 11
- **Code Reviews:** 15
- **Bugs encontrados:** 5 (4 resueltos, 1 pospuesto a Sprint 3)

#### Retrospectiva
✅ **Qué funcionó bien:**
- Sistema de estados robusto y bien diseñado
- React Hook Form simplificó validaciones
- Tests unitarios ayudaron a detectar bugs temprano

⚠️ **Qué mejorar:**
- Testing de endpoints (faltó Postman collections)
- Documentación de API quedó incompleta
- Un bug quedó sin resolver

🎯 **Acciones para próximo sprint:**
- Crear Swagger/OpenAPI docs para API
- Aumentar cobertura de tests a >85%
- Resolver bug pospuesto (#23)

#### Buffer de Tiempo
- **Asignado:** 2.5 días (12.5h)
- **Utilizado:** 2 días (10h)
- **Motivo:** Debugging integración OpenAI, refactoring state machine

---

### 4.4 Sprint 3 - Integración IA (OpenAI/Gemini) 🔄

**Período:** 14 de noviembre - 20 de noviembre de 2024  
**Scrum Master:** @Agsergio04  
**Estado:** 🔄 EN PROGRESO (67% completado)

#### Objetivos
- Integración OpenAI/Gemini para generación de preguntas
- Análisis de respuestas con IA (scoring 0-100)
- Preguntas dinámicas de seguimiento contextuales
- Componente entrevista en vivo con grabación
- Integración tiempo real con WebSocket

#### Story Points
- **Planificados:** 42 SP
- **Completados (parcial):** 28 SP
- **Velocidad estimada:** 38 SP
- **Progreso actual:** 67% (al 11/12/2024)

#### Distribución de Horas
| Área | Horas Planificadas | Horas Ejecutadas | Asignado |
|------|-------------------|------------------|----------|
| Backend | 22.5h | 15h (67%) | @Agsergio04 |
| Frontend | 18.5h | 12h (65%) | @pablitoclavito04 |
| **TOTAL** | **41h** | **27h** | - |

#### Tareas Completadas
**Backend:**
- [x] Instalar SDK OpenAI (0.5h)
- [x] Crear `OpenAIService` (1h)
- [x] Sistema gestión API keys (0.5h)
- [x] Rate limiting con Redis (1h)
- [x] Sistema retry con exponential backoff (1h)
- [x] Logging requests/responses (0.5h)
- [x] Monitoreo de costos (0.5h)
- [x] Endpoint `POST /api/ai/analyze-response` (2h)
- [x] Diseño de prompts de análisis (1h)
- [x] Sistema scoring 0-100 (1h)
- [ ] Análisis por categorías (1h) - EN PROGRESO
- [ ] Feedback constructivo (1h) - PENDIENTE
- [ ] Caché respuestas similares (1h) - PENDIENTE
- [ ] Tests con mocks (2h) - PENDIENTE

**Frontend:**
- [x] Componente `LiveInterviewPage` (2h)
- [x] MediaRecorder API integrada (1.5h)
- [x] `AudioVisualizer` con forma de onda (2h)
- [x] Gestión permisos micrófono (1h)
- [x] `QuestionDisplay` (1h)
- [x] Temporizador por pregunta (1h)
- [x] Controles grabación (Start/Stop/Pause) (1h)
- [ ] Manejo errores audio (0.5h) - EN PROGRESO
- [ ] WebSocket connection (1.5h) - PENDIENTE
- [ ] FeedbackDisplay (1.5h) - PENDIENTE

#### Métricas (parciales)
- **Commits:** 38
- **Pull Requests:** 9 (6 merged, 3 en revisión)
- **Code Reviews:** 11
- **Bugs encontrados:** 4 (3 resueltos, 1 en progreso)

#### Riesgos Activos
| Riesgo | Probabilidad | Impacto | Mitigación Planificada |
|--------|--------------|---------|------------------------|
| Web Speech API incompatible en Safari | **ALTA** | Alto | ✅ Implementado fallback a entrada manual |
| Costos OpenAI mayores de lo esperado | Media | Alto | Rate limiting + caché implementados |
| Latencia en respuestas IA >5 seg | Media | Alto | Usar modelos más rápidos (gpt-4-turbo) |
| WebSocket desconexiones frecuentes | Media | Medio | Fallback a polling (planificado) |

#### Buffer de Tiempo
- **Asignado:** 3 días (15h)
- **Utilizado hasta ahora:** 2 días (10h)
- **Restante:** 1 día (5h)
- **Motivo uso:** Compatibilidad Web Speech API, debugging análisis IA

---

### 4.5 Sprint 4 - Reportes y Analytics 📅

**Período:** 21 de noviembre - 27 de noviembre de 2024  
**Scrum Master:** @pablitoclavito04  
**Estado:** 📅 PLANIFICADO

#### Objetivos
- Generación de reportes completos de entrevistas
- Exportación en múltiples formatos (PDF, JSON, CSV)
- Dashboard de analytics con gráficos interactivos
- Vistas de resultados individuales detalladas
- Reestructuración entidades BD (repositorio GitHub)

#### Story Points Estimados
- **Planificados:** 40 SP
- **Velocidad proyectada:** 37 SP (basado en sprints anteriores)

#### Distribución de Horas Planificadas
| Área | Horas | Asignado |
|------|-------|----------|
| Backend | 24h | @Agsergio04 |
| Frontend | 22.5h | @Agsergio04 + @pablitoclavito04 |
| **TOTAL** | **46.5h** | - |

#### Tareas Planificadas

**Backend (@Agsergio04):**
- [ ] Crear `ReportService` completo (1.5h)
- [ ] Endpoint `GET /api/interviews/:id/report` (1h)
- [ ] Cálculo métricas de rendimiento (1h)
- [ ] Análisis fortalezas/debilidades con IA (1.5h)
- [ ] Generación resumen ejecutivo (1h)
- [ ] Sección de recomendaciones (0.5h)
- [ ] Timestamps y metadatos (0.5h)
- [ ] Sistema de caché de reportes (1h)
- [ ] Endpoint `GET /api/interviews/:id/export?format=pdf` (1.5h)
- [ ] Generación PDF con plantilla profesional (2h)
- [ ] Exportación JSON y CSV (1h)
- [ ] Endpoint `GET /api/analytics/dashboard` (1.5h)
- [ ] Agregaciones estadísticas MongoDB (1h)
- [ ] Tendencias temporales (1h)
- [ ] Comparativas entre candidatos (1h)
- [ ] Filtros por fecha/puesto (1h)
- [ ] Reestructuración `Interview` entity (repositorio GitHub) (1h)
- [ ] Modificación `User` entity (sin profesión) (0.5h)
- [ ] Modificación `Question` entity (sin categoría) (0.5h)
- [ ] `GitinestController` para análisis repo (2h)
- [ ] Refactorización `InterviewController` (1.5h)

**Frontend (@Agsergio04 + @pablitoclavito04):**
- [ ] Componente `InterviewResultsPage` completo (1.5h)
- [ ] `ScoreCard` con métricas visuales (1.5h)
- [ ] Componente `StrengthsWeaknesses` (1h)
- [ ] Timeline de entrevista (1.5h)
- [ ] Sección transcripción sincronizada (2h)
- [ ] Reproductor audio con controles (1.5h)
- [ ] Sincronización audio-transcripción (1.5h)
- [ ] Botones de exportación (1h)
- [ ] Componente `AnalyticsDashboard` (2h)
- [ ] Integración Chart.js/Recharts (1.5h)
- [ ] Gráfico tendencias scoring temporal (1h)
- [ ] Comparativa entre candidatos (1.5h)
- [ ] KPIs principales (1h)
- [ ] Filtros avanzados (1h)
- [ ] Gráfico distribución de puntuaciones (1h)
- [ ] Lazy loading de datos (1h)
- [ ] Dashboard cambios (repositorio + dificultad) (2h)

#### Dependencias
- Sprint 3 completado (análisis de respuestas con IA)
- OpenAI API funcional para resúmenes ejecutivos

#### Riesgos Identificados
| Riesgo | Probabilidad | Impacto | Mitigación Planificada |
|--------|--------------|---------|------------------------|
| Generación PDF compleja | Media | Medio | Usar librería probada (PDFKit/Puppeteer) |
| Performance con muchos datos | Media | Alto | Paginación + lazy loading |
| Reestructuración BD rompe funcionalidad | Baja | Alto | Migración cuidadosa + tests exhaustivos |

---

### 4.6 Sprint 5 - Validación y Gemini 📅

**Período:** 28 de noviembre - 4 de diciembre de 2024  
**Scrum Master:** @Agsergio04  
**Estado:** 📅 PLANIFICADO

#### Objetivos
- Integración Gemini AI como alternativa a OpenAI
- Sistema de puntuación y feedback por respuesta
- Cards diferenciadas (IA vs Manual) en UI
- Optimización de entrevistas manuales
- Refactorización menú de entrevistas

#### Story Points Estimados
- **Planificados:** 36 SP
- **Velocidad proyectada:** 36 SP

#### Distribución de Horas
| Área | Horas | Asignado |
|------|-------|----------|
| Backend | 10h | @Agsergio04 |
| Frontend | 17h | @Agsergio04 + @pablitoclavito04 |
| DevOps | 2h | @Agsergio04 |
| **TOTAL** | **29h** | - |

#### Tareas Planificadas

**Backend:**
- [ ] Configurar Gemini API (1h)
- [ ] Endpoint generación preguntas Gemini (2h)
- [ ] Crear prompts específicos Gemini (1h)
- [ ] Validación respuestas con Gemini (1.5h)
- [ ] Manejo errores API Gemini (0.5h)
- [ ] Pruebas calidad de preguntas (1h)
- [ ] Lógica cálculo puntuación (1.5h)
- [ ] Sistema feedback por respuesta (1h)
- [ ] Guardar puntuación en BD (0.5h)

**Frontend:**
- [ ] Modificar cards dashboard (1.5h)
- [ ] Estilos dificultad "Manual" (0.5h)
- [ ] Lógica filtrado actualizada (1h)
- [ ] Pruebas visualización (0.5h)
- [ ] Responsividad verificada (0.5h)
- [ ] Revisar flujo entrevistas manuales (1h)
- [ ] Identificar puntos de mejora (0.5h)
- [ ] Optimizar rendimiento (1h)
- [ ] Validaciones mejoradas (0.5h)
- [ ] Pruebas flujo completo (0.5h)
- [ ] Componente visualización respuestas (1.5h)
- [ ] Navegación entre respuestas (1h)
- [ ] Estilos visualización (0.5h)
- [ ] Responsividad (0.5h)
- [ ] Refactorizar menú entrevistas (1.5h)
- [ ] Descarga de reportes integrada (1.5h)
- [ ] Formato reporte PDF/CSV (1h)
- [ ] Botón descarga integrado (0.5h)
- [ ] Pruebas generación reportes (0.5h)

**DevOps:**
- [ ] Revisar `docker-entrypoint.sh` (0.5h)
- [ ] Optimizar scripts de inicio (1h)
- [ ] Pruebas en contenedor Docker (0.5h)

---

### 4.7 Sprint 6 - Documentación y CI/CD 📅

**Período:** 5 de diciembre - 11 de diciembre de 2024  
**Scrum Master:** @pablitoclavito04  
**Estado:** 📅 PLANIFICADO

#### Objetivos
- Documentación técnica JSDoc >90% cobertura
- CI/CD automatizado con GitHub Actions
- Publicación imágenes Docker en Docker Hub
- Documentación empresarial completa
- Despliegue a producción

#### Story Points Estimados
- **Planificados:** 42 SP
- **Velocidad proyectada:** 40 SP

#### Distribución de Horas
| Área | Horas | Asignado |
|------|-------|----------|
| Backend/DevOps | 25.5h | @Agsergio04 |
| Frontend | 11h | @Agsergio04 + @pablitoclavito04 |
| Documentación | 4h | @Agsergio04 |
| **TOTAL** | **40.5h** | - |

#### Tareas Planificadas

**Backend/DevOps (@Agsergio04):**
- [ ] Instalar JSDoc backend (0.5h)
- [ ] Documentar todas las funciones backend (2h)
- [ ] Documentar APIs/endpoints (1.5h)
- [ ] Crear workflow `generate-docs.yml` (1h)
- [ ] Configurar GitHub Pages para docs (1h)
- [ ] Optimizar Dockerfile backend (1h)
- [ ] Configurar Docker Buildx (1h)
- [ ] Crear workflow `docker-publish.yml` (1.5h)
- [ ] Implementar caché de layers (0.5h)
- [ ] Integrar escaneo de vulnerabilidades (1h)
- [ ] Análisis competencia detallado (2h)
- [ ] Estructura organizativa empresa (1.5h)
- [ ] Crear organigrama visual (1h)
- [ ] Análisis presupuestario (2h)
- [ ] Plan de financiación (1.5h)
- [ ] Análisis RGPD + políticas legales (2h)
- [ ] Análisis WCAG 2.1 accesibilidad (1h)
- [ ] Gestión de recursos completa (1.5h)
- [ ] Despliegue a producción (2h)

**Frontend (@Agsergio04 + @pablitoclavito04):**
- [ ] Instalar JSDoc frontend (0.5h)
- [ ] Documentar componentes React (2h)
- [ ] Documentar servicios/hooks (1.5h)
- [ ] Crear documentación visual (1h)
- [ ] Optimizar Dockerfile frontend (1h)
- [ ] Verificar responsive final (1h)
- [ ] Tests finales de todas funcionalidades (2h)
- [ ] Ajustes UX últimos detalles (1.5h)

**Documentación General (@Agsergio04):**
- [ ] Actualizar README.md principal (1.5h)
- [ ] Crear Wiki "Planificación de Sprints" (1h)
- [ ] Documentar estructura de documentación (0.5h)
- [ ] Revisar y compilar todos los docs (1h)

#### Criterios de "Done" para Sprint 6
✅ JSDoc >90% de funciones documentadas  
✅ Workflows GitHub Actions funcionando sin errores  
✅ Imágenes Docker publicadas y accesibles  
✅ Documentos empresariales completos  
✅ Wiki actualizado con planificación  
✅ Aplicación desplegada en producción  
✅ Monitoreo y logs configurados  
✅ Zero warnings en build  
✅ Tests >85% cobertura global

---

## 5. Velocidad del Equipo

### 5.1 Tabla de Velocidad por Sprint

| Sprint | Período | Story Points | Horas Plan. | Horas Real. | Eficiencia | Velocidad |
|--------|---------|--------------|-------------|-------------|------------|-----------|
| **S1** | 31/10 - 6/11 | 34 SP | 19.5h | 22h | 89% | 32 SP |
| **S2** | 7/11 - 13/11 | 38 SP | 25.5h | 28h | 91% | 36 SP |
| **S3** | 14/11 - 20/11 | 42 SP | 41h | ~45h (est.) | 91% | 38 SP (est.) |
| **S4** | 21/11 - 27/11 | 40 SP | 46.5h | TBD | - | 37 SP (proy.) |
| **S5** | 28/11 - 4/12 | 36 SP | 29h | TBD | - | 36 SP (proy.) |
| **S6** | 5/12 - 11/12 | 42 SP | 40.5h | TBD | - | 40 SP (proy.) |

**Métricas Clave:**
- **Velocidad Promedio:** 36.5 SP/sprint
- **Eficiencia Promedio:** 90% (overhead de ~10%)
- **Horas Promedio:** 33.6h/sprint
- **Capacity por persona:** 16.8h/sprint (1.68 días completos)

### 5.2 Cálculo de Velocidad

**Fórmula aplicada:**
```
Velocidad = Story Points Completados / Duración del Sprint (semanas)
```

**Ejemplo Sprint 1:**
- Story Points completados: 32 SP
- Duración: 1 semana
- Velocidad: 32 SP/semana

**Velocidad acumulada (Sprints 1-2):**
```
Velocidad promedio = (32 + 36) / 2 = 34 SP/sprint
```

### 5.3 Tendencias de Velocidad

**Gráfico conceptual:**
```
Velocidad (SP)
40 │                    ╭─── Sprint 6 (est.)
   │               ╭────┤
38 │          ╭────┤    │
   │     ╭────┤    └─── Sprint 3 (en progreso)
36 │─────┤    └──────── Sprint 5 (proy.)
   │     └──────────── Sprint 2
34 │
   │─────────────────── Sprint 4 (proy.)
32 │───── Sprint 1
   │
30 └─────────────────────────────
   S1   S2   S3   S4   S5   S6
```

**Observaciones:**
- ✅ Velocidad estable entre 32-38 SP
- ✅ Mejora gradual en eficiencia (89% → 91%)
- ✅ Sprint 3 es el más ambicioso (41h vs ~27h promedio)
- ⚠️ Necesario ajustar estimaciones en Sprint 4+ basado en Sprint 3 real

### 5.4 Factores que Afectan Velocidad

**Factores positivos:**
- ✅ Roles rotativos mejoran ownership
- ✅ Comunicación fluida en Discord
- ✅ GitHub Projects actualizado diariamente
- ✅ Code reviews rápidos (<24h)

**Factores negativos:**
- ⚠️ APIs externas impredecibles (OpenAI latency)
- ⚠️ Debugging consume más tiempo del estimado
- ⚠️ Documentación a veces se retrasa

---

## 6. Recursos Materiales

### 6.1 Hardware del Equipo

| Miembro | Equipo | Procesador | RAM | Almacenamiento | Sistema Operativo |
|---------|--------|------------|-----|----------------|-------------------|
| @Agsergio04 | Laptop Dell XPS | Intel i7-11th Gen | 16 GB DDR4 | 512 GB NVMe SSD | Windows 11 Pro |
| @pablitoclavito04 | Laptop HP Pavilion | Intel i5-10th Gen | 8 GB DDR4 | 256 GB SSD | Windows 10 |

**Requisitos Mínimos para Desarrollo:**
- **Procesador:** Intel i5 / AMD Ryzen 5 (4 núcleos) o superior
- **RAM:** 8 GB mínimo, **16 GB recomendado**
- **Almacenamiento:** 256 GB SSD mínimo
- **Conexión a Internet:** 10 Mbps mínimo, 50 Mbps recomendado
- **Micrófono:** Para testing de grabación de voz

### 6.2 Software de Desarrollo

| Software | Versión | Licencia | Uso | Instalado Por |
|----------|---------|----------|-----|---------------|
| **Visual Studio Code** | 1.85+ | Gratuita (MIT) | Editor principal | Ambos devs |
| **Node.js** | 20.x LTS | Open Source | Runtime backend | Ambos devs |
| **npm** | 10.x | Open Source | Gestor de paquetes | Ambos devs |
| **Git** | 2.42+ | GPL | Control de versiones | Ambos devs |
| **Docker Desktop** | 24.x | Gratuita | Contenedores | Ambos devs |
| **MongoDB Compass** | 1.40+ | Gratuita | Cliente MongoDB | Ambos devs |
| **Postman** | 10.x | Gratuita | Testing de API | Ambos devs |
| **Chrome DevTools** | Latest | Incluido | Debugging frontend | Ambos devs |
| **Discord** | Latest | Gratuita | Comunicación equipo | Ambos devs |
| **Figma** | Web | Gratuita | Diseño UI/UX | @pablitoclavito04 |

### 6.3 Extensiones de VSCode Obligatorias

**Archivo `.vscode/extensions.json`:**
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "dsznajder.es7-react-js-snippets",
    "formulahendry.auto-rename-tag",
    "mongodb.mongodb-vscode",
    "humao.rest-client",
    "eamodio.gitlens",
    "wayou.vscode-todo-highlight",
    "streetsidesoftware.code-spell-checker",
    "ms-azuretools.vscode-docker",
    "bradlc.vscode-tailwindcss"
  ]
}
```

---

## 7. APIs y Servicios Externos

### 7.1 OpenAI API

**Propósito:** Generación de preguntas y evaluación de respuestas con IA

**Configuración:**
```bash
# backend/.env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7
```

**Endpoints Utilizados:**
- `POST https://api.openai.com/v1/chat/completions`

**Límites y Costos:**
- **Tier:** Tier 1 (cuenta nueva)
- **Rate Limit:** 3,500 requests/min, 10,000 tokens/min
- **Costo Input:** $0.01/1K tokens
- **Costo Output:** $0.03/1K tokens
- **Uso Estimado Mensual:** ~1M tokens = **€25-30/mes**

**Documentación:** https://platform.openai.com/docs/api-reference

**Responsable:** @Agsergio04

---

### 7.2 Google Gemini API

**Propósito:** Alternativa a OpenAI para generación de preguntas

**Configuración:**
```bash
# backend/.env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GEMINI_MODEL=gemini-1.5-pro
```

**Endpoints Utilizados:**
- `POST https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent`

**Límites y Costos:**
- **Free Tier:** 60 requests/min
- **Costo:** Gratis hasta 1.500 requests/día
- **Uso Estimado:** ~500 requests/día = **€0/mes** (dentro del free tier)

**Documentación:** https://ai.google.dev/gemini-api/docs

**Responsable:** @Agsergio04

---

### 7.3 MongoDB Atlas

**Propósito:** Base de datos principal del proyecto

**Configuración:**
```bash
# backend/.env
MONGODB_URI=mongodb+srv://preparat:xxxxx@cluster0.xxxxx.mongodb.net/preparat?retryWrites=true&w=majority
```

**Plan:** M0 (Free Forever)
**Recursos:**
- Almacenamiento: 512 MB
- RAM: 512 MB
- Conexiones simultáneas: 500

**Costo:** **€0/mes**

**Responsable:** @Agsergio04

---

### 7.4 PayPal API

**Propósito:** Procesamiento de suscripciones y pagos

**Configuración:**
```bash
# backend/.env
PAYPAL_MODE=sandbox  # cambiar a 'production' en deploy
PAYPAL_CLIENT_ID=AXXXXXXXXXXXXXXXXXXXXXXXXXXXX
PAYPAL_CLIENT_SECRET=EXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Sandbox:** https://developer.paypal.com/dashboard/  
**Documentación:** https://developer.paypal.com/docs/api/overview/

**Costos:**
- **Desarrollo (Sandbox):** €0
- **Producción:** 2.9% + €0.35 por transacción

**Responsable:** @Agsergio04

---

### 7.5 GitHub API

**Propósito:** Análisis de repositorios de usuarios (GitinestController)

**Configuración:**
```bash
# backend/.env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Rate Limits:**
- **Autenticado:** 5,000 requests/hora
- **No autenticado:** 60 requests/hora

**Costo:** **€0/mes** (plan gratuito)

**Documentación:** https://docs.github.com/en/rest

**Responsable:** @Agsergio04

---

### 7.6 Resumen de Costos Mensuales

| Servicio | Plan | Costo Desarrollo | Costo Producción |
|----------|------|------------------|------------------|
| OpenAI API | Pay-as-you-go | €25-30 | €50-100 |
| Gemini API | Free Tier | €0 | €0 |
| MongoDB Atlas | M0 Free | €0 | €0 (hasta 512MB) |
| PayPal | Sandbox | €0 | 2.9% + €0.35/tx |
| GitHub API | Free | €0 | €0 |
| Hosting Frontend | Vercel Free | €0 | €0 |
| Hosting Backend | Railway Free | €0 | €5-10 |
| **TOTAL ESTIMADO** | - | **€25-30/mes** | **€55-110/mes** |

---

## 8. Credenciales y Accesos

### 8.1 Tabla de Credenciales

**⚠️ IMPORTANTE:** Este documento NO contiene credenciales reales. Las credenciales se gestionan mediante variables de entorno en `.env` files que están en `.gitignore`.

| Servicio | Ubicación Credenciales | Responsable | Última Actualización |
|----------|------------------------|-------------|----------------------|
| OpenAI API | `backend/.env` → `OPENAI_API_KEY` | @Agsergio04 | 14/11/2024 |
| Gemini API | `backend/.env` → `GEMINI_API_KEY` | @Agsergio04 | 28/11/2024 (planificado) |
| MongoDB Atlas | `backend/.env` → `MONGODB_URI` | @Agsergio04 | 31/10/2024 |
| PayPal Sandbox | `backend/.env` → `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` | @Agsergio04 | 21/11/2024 (planificado) |
| GitHub Token | `backend/.env` → `GITHUB_TOKEN` | @Agsergio04 | 21/11/2024 (planificado) |
| JWT Secret | `backend/.env` → `JWT_SECRET` | @Agsergio04 | 07/11/2024 |

### 8.2 Procedimiento de Gestión de Credenciales

**Reglas obligatorias:**
1. ✅ **NUNCA** commitear credenciales al repositorio
2. ✅ Usar `.env` files locales (en `.gitignore`)
3. ✅ Usar `.env.example` como plantilla (sin valores reales)
4. ✅ Rotar credenciales cada 3 meses
5. ✅ Usar secretos de GitHub Actions para CI/CD

**Archivo `.env.example` (committeable):**
```bash
# OpenAI
OPENAI_API_KEY=sk-proj-your_key_here

# Gemini
GEMINI_API_KEY=your_key_here

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# PayPal
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret

# GitHub
GITHUB_TOKEN=ghp_your_token_here

# JWT
JWT_SECRET=your_jwt_secret_here
```

### 8.3 GitHub Secrets (para CI/CD)

**Secrets configurados en Settings → Secrets and variables → Actions:**

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `MONGODB_URI`
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

**Responsable de configuración:** @Agsergio04

---

## 9. Gestión de Riesgos Temporales

### 9.1 Buffer de Tiempo por Sprint

**Estrategia general:**
- **Buffer estándar:** 10-15% del tiempo total del sprint
- **Buffer Sprint 1-2:** 2 días (20%)
- **Buffer Sprint 3-4:** 2.5-3 días (15%)
- **Buffer Sprint 5-6:** 2 días (10%)

**Uso del Buffer:**
- Resolución de bugs críticos no planificados
- Deuda técnica acumulada
- Tareas imprevistas de alta prioridad
- Mitigación de riesgos identificados
- Integración más compleja de lo esperado

### 9.2 Registro Histórico de Uso de Buffer

| Sprint | Buffer Asignado | Buffer Utilizado | Motivo Principal | % Usado |
|--------|-----------------|------------------|------------------|---------|
| Sprint 1 | 2 días (10h) | 1.5 días (7.5h) | Configuración MongoDB Atlas, Docker networking | 75% |
| Sprint 2 | 2.5 días (12.5h) | 2 días (10h) | Debugging integración OpenAI, refactoring state machine | 80% |
| Sprint 3 | 3 días (15h) | 2 días (10h) *(parcial)* | Compatibilidad Web Speech API, debugging análisis IA | 67% *(en progreso)* |
| Sprint 4 | 3 días (15h) | TBD | - | - |
| Sprint 5 | 2 días (10h) | TBD | - | - |
| Sprint 6 | 2 días (10h) | TBD | - | - |

**Promedio de uso de buffer:** 74% (muy saludable)

### 9.3 Riesgos Temporales Identificados

#### Riesgos Sprint 3 (En Progreso)
| Riesgo | Probabilidad | Impacto | Mitigación Aplicada | Estado |
|--------|--------------|---------|---------------------|--------|
| Web Speech API no funciona en Safari | **ALTA** | Alto | ✅ Fallback a entrada manual implementado | ✅ Mitigado |
| Latencia OpenAI >5 segundos | Media | Alto | ✅ Usar modelos más rápidos (gpt-4-turbo) | ✅ Mitigado |
| WebSocket desconexiones frecuentes | Media | Medio | Fallback a polling planificado | 🔄 En progreso |
| Costos OpenAI exceden presupuesto | Media | Alto | ✅ Rate limiting + caché implementados | ✅ Mitigado |

#### Riesgos Sprint 4 (Planificado)
| Riesgo | Probabilidad | Impacto | Mitigación Planificada |
|--------|--------------|---------|------------------------|
| Generación PDF compleja | Media | Medio | Usar librería probada (PDFKit/Puppeteer), prototipo temprano |
| Performance con muchos datos en dashboard | Media | Alto | Paginación + lazy loading + índices MongoDB |
| Reestructuración BD rompe funcionalidad | Baja | Alto | Migración cuidadosa + tests exhaustivos + backup |

#### Riesgos Sprint 6 (Planificado)
| Riesgo | Probabilidad | Impacto | Mitigación Planificada |
|--------|--------------|---------|------------------------|
| Fallos en deploy a producción | Media | Alto | Testing exhaustivo en staging, rollback plan |
| Documentación desactualizada | Media | Bajo | Revisión antes de despliegue, checklist de docs |
| Costos Docker Hub/hosting | Baja | Medio | Usar plan free mientras sea posible, alternativas (DigitalOcean, Railway) |

### 9.4 Estrategias de Mitigación General

**1. Comunicación Proactiva:**
- Daily standups identifican impedimentos temprano
- Scrum Master actualiza riesgos en cada Planning

**2. Planificación Realista:**
- Estimaciones basadas en velocidad histórica
- No sobrecargar sprints (dejar 20% de margen)

**3. Prototipado Temprano:**
- POCs (Proof of Concept) para integraciones complejas
- Validar viabilidad técnica antes de comprometer tiempo

**4. Documentación Continua:**
- Documentar mientras desarrollamos (no al final)
- README.md y WIKI actualizados en cada sprint

---

## 10. GitHub Projects - Configuración

### 10.1 Campos Personalizados Configurados

**Campos obligatorios en cada Issue/Task:**

| Campo | Tipo | Valores Posibles | Obligatorio |
|-------|------|------------------|-------------|
| **Sprint** | Select | S1, S2, S3, S4, S5, S6 | ✅ Sí |
| **Prioridad** | Select | Crítica, Alta, Media, Baja | ✅ Sí |
| **Estimación** | Number | 0.5h, 1h, 1.5h, 2h, 3h, 4h | ✅ Sí |
| **Categoría** | Select | Backend, Frontend, DevOps, Database, Documentation, Testing | ✅ Sí |
| **Estado** | Select | Backlog, To Do, In Progress, In Review, Done | ✅ Sí |
| **Assignee** | Person | @Agsergio04, @pablitoclavito04 | ✅ Sí |

### 10.2 Columnas del Proyecto

| Columna | Propósito | Criterio de Entrada | Criterio de Salida |
|---------|-----------|---------------------|---------------------|
| **Backlog** | Tareas sin asignar a sprint | Issue creado | Asignado a sprint |
| **To Do** | Listas para el sprint actual | Asignado a sprint en Planning | Alguien empieza a trabajar |
| **In Progress** | En desarrollo activo | Developer asignado trabajando | Código completo, listo para revisión |
| **In Review** | Esperando code review | Pull Request creado | PR aprobado y merged |
| **Done** | Completadas y merged | Merged a `main` | Sprint finalizado |

### 10.3 Criterios de "Done"

Una tarea se considera **"Done"** cuando cumple **TODOS** estos criterios:

✅ **Código:**
- Funcionalidad implementada completamente
- Código sigue convenciones del proyecto (ESLint, Prettier)
- Sin warnings o errors en consola del navegador/terminal

✅ **Testing:**
- Tests unitarios pasando (si aplica)
- Cobertura >80% para funciones críticas
- Testing manual ejecutado y validado

✅ **Code Review:**
- Pull Request creado
- Al menos 1 aprobación de Tech Lead
- Comentarios resueltos

✅ **Documentación:**
- JSDoc completo para funciones nuevas
- README.md actualizado si aplica
- Comentarios en código para lógica compleja

✅ **Integración:**
- Merged a rama `main`
- Build pasando en CI/CD
- Sin conflictos con otras ramas

✅ **Validación:**
- Criterios de aceptación cumplidos
- QA Lead ha validado funcionalidad
- Product Owner satisfecho (si aplica)

### 10.4 Flujo de Trabajo en GitHub Projects

```
1. Issue creado → BACKLOG
2. Asignado a sprint en Planning → TO DO
3. Developer empieza a trabajar → IN PROGRESS
4. PR creado y listo para revisión → IN REVIEW
5. PR aprobado y merged → DONE
```

### 10.5 Responsabilidad del Scrum Master

**El Scrum Master del sprint DEBE:**
- ✅ Actualizar GitHub Projects **DIARIAMENTE** antes de 10:00 AM CET
- ✅ Mover tarjetas entre columnas según avance real
- ✅ Crear Issues para impedimentos encontrados
- ✅ Actualizar estimaciones si tareas toman más/menos tiempo
- ✅ Calcular velocidad al final del sprint
- ✅ Revisar y cerrar Issues completados

**Herramientas:**
- Dashboard de GitHub Projects: https://github.com/users/Agsergio04/projects/1
- Automation de GitHub Projects (si configurado)

---

## 11. Historial de Actualizaciones

| Versión | Fecha | Autor | Cambios Principales |
|---------|-------|-------|---------------------|
| 1.0 | 31/10/2024 | @Agsergio04 | Creación inicial del documento |
| 2.0 | 07/11/2024 | @pablitoclavito04 | Actualización post-Sprint 1, añadido Sprint 2 |
| 2.1 | 14/11/2024 | @Agsergio04 | Actualización post-Sprint 2, Sprint 3 en progreso |
| 3.0 | 21/11/2024 | @pablitoclavito04 | Sprint 3 completado, añadido Sprint 4-6 planificado |
| 3.1 | 28/11/2024 | @Agsergio04 | Actualización velocidad, riesgos Sprint 5 |
| 3.2 | 11/12/2024 | @Agsergio04 | **Documento actual** - Sprint 3 al 67%, añadida sección completa de credenciales y riesgos |

---

## 12. Anexos

### 12.1 Enlaces Útiles

| Recurso | URL |
|---------|-----|
| **GitHub Repository** | https://github.com/Agsergio04/proyecto-intermodular-david |
| **GitHub Projects** | https://github.com/users/Agsergio04/projects/1 |
| **Wiki - Planificación de Sprints** | https://github.com/Agsergio04/proyecto-intermodular-david/wiki/Planificación-de-Sprints |
| **Discord - Canal Equipo** | [Enlace privado] |
| **Figma - Diseños UI** | [Enlace a Figma si existe] |
| **MongoDB Atlas Dashboard** | https://cloud.mongodb.com |
| **OpenAI Dashboard** | https://platform.openai.com/usage |
| **PayPal Sandbox** | https://developer.paypal.com/dashboard/ |

### 12.2 Contactos de Emergencia

| Rol | Persona | Email | Teléfono |
|-----|---------|-------|----------|
| **Product Owner** | David | dromsan617@g.educaand.es |
| **Scrum Master Actual** | @Agsergio04 (Sprint 3) | sergio.garcia@preparat.com |
| **Tech Lead Actual** | @pablitoclavito04 (Sprint 3) | pablo.sanz@preparat.com |

---

**Documento mantenido por el Scrum Master del Sprint Actual**   
**Responsable siguiente actualización:** @pablitoclavito04 (Scrum Master Sprint 4)
