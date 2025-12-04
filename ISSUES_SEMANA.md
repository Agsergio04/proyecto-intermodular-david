# Issues de la Semana (1-4 Diciembre 2025)

Copia y pega cada issue en GitHub para crear las tareas correspondientes.

---

## Issue 1: Sistema de Puntuación y Feedback

## Descripción
Implementar el sistema de puntuación de respuestas junto con la recepción de feedback personalizado para cada respuesta del usuario en las entrevistas.

## Tareas
- [ ] Crear lógica de cálculo de puntuación
- [ ] Integrar sistema de feedback por respuesta
- [ ] Mostrar puntuación al usuario
- [ ] Guardar puntuación en base de datos
- [ ] Mostrar feedback personalizado según la respuesta

## Criterios de Aceptación
- El usuario recibe una puntuación por cada respuesta
- El feedback es relevante y personalizado
- La puntuación se guarda correctamente
- Se muestra visualmente de forma clara

## Estimación
**4 horas**

## Asignado a
@Agsergio04 (Frontend/Backend)

---

## Issue 2: Soporte para Dificultad Manual en Cards

## Descripción
Actualizar las cards del dashboard para soportar y mostrar correctamente las entrevistas con dificultad "Manual".

## Tareas
- [ ] Modificar componente de cards
- [ ] Agregar estilos para dificultad Manual
- [ ] Actualizar lógica de filtrado
- [ ] Probar visualización correcta
- [ ] Verificar responsividad

## Criterios de Aceptación
- Las cards muestran correctamente la dificultad Manual
- Los estilos son consistentes con otras dificultades
- El filtrado funciona correctamente
- La UI es responsiva

## Estimación
**2 horas**

## Asignado a
@Agsergio04 (Frontend)

---

## Issue 3: Optimización de Entrevistas Manuales

## Descripción
Optimizar el flujo de creación y gestión de entrevistas creadas de forma manual para mejorar la experiencia del usuario.

## Tareas
- [ ] Revisar flujo actual de entrevistas manuales
- [ ] Identificar puntos de mejora
- [ ] Optimizar rendimiento de carga
- [ ] Mejorar validaciones
- [ ] Probar flujo completo

## Criterios de Aceptación
- El flujo de entrevistas manuales es más rápido
- Las validaciones son correctas
- No hay errores en el proceso
- La experiencia de usuario mejora

## Estimación
**3 horas**

## Asignado a
@Agsergio04 (Frontend/Backend)

---

## Issue 4: Cards Diferenciadas IA vs Manual en Dashboard

## Descripción
Incluir en el panel de control tarjetas diferenciadas para entrevistas generadas por IA y entrevistas creadas manualmente.

## Tareas
- [ ] Crear diseño de card para entrevistas IA
- [ ] Crear diseño de card para entrevistas manuales
- [ ] Agregar indicador visual de tipo
- [ ] Implementar filtros por tipo
- [ ] Probar visualización en dashboard

## Criterios de Aceptación
- Las cards de IA y manuales son visualmente distintas
- El usuario puede identificar fácilmente el tipo
- Los filtros funcionan correctamente
- El diseño es consistente

## Estimación
**3 horas**

## Asignado a
@Agsergio04 (Frontend)

---

## Issue 5: Refactorización del Menú de Entrevistas y Descarga de Reportes

## Descripción
Refactorizar el menú de Interview para mejorar su organización y agregar funcionalidad de descarga de reportes.

## Tareas
- [ ] Reorganizar estructura del menú
- [ ] Implementar descarga de reportes
- [ ] Crear formato de reporte (PDF/CSV)
- [ ] Agregar botón de descarga
- [ ] Probar generación de reportes

## Criterios de Aceptación
- El menú está mejor organizado
- Los reportes se descargan correctamente
- El formato del reporte es útil
- No hay errores en la descarga

## Estimación
**4 horas**

## Asignado a
@Agsergio04 (Frontend)

---

## Issue 6: Visualización Única de Respuestas Generadas

## Descripción
Implementar sistema mejorado para visualizar las respuestas generadas de forma individual y detallada.

## Tareas
- [ ] Crear vista de respuesta individual
- [ ] Mostrar detalles de la respuesta
- [ ] Agregar navegación entre respuestas
- [ ] Implementar estilos de visualización
- [ ] Probar responsividad

## Criterios de Aceptación
- Cada respuesta se puede ver individualmente
- Los detalles se muestran claramente
- La navegación es intuitiva
- El diseño es responsivo

## Estimación
**3 horas**

## Asignado a
@Agsergio04 (Frontend)

---

## Issue 7: Generación de Preguntas con Gemini AI

## Descripción
Crear sistema de generación de preguntas utilizando la inteligencia artificial de Gemini y validar las respuestas del usuario mediante dicha IA.

## Tareas
- [ ] Configurar API de Gemini
- [ ] Implementar generación de preguntas
- [ ] Crear prompt para generación
- [ ] Implementar validación de respuestas con IA
- [ ] Manejar errores de API
- [ ] Probar calidad de preguntas generadas

## Criterios de Aceptación
- Las preguntas se generan correctamente
- La IA valida las respuestas del usuario
- Los errores se manejan apropiadamente
- Las preguntas son relevantes y de calidad

## Estimación
**6 horas**

## Asignado a
@Agsergio04 (Backend/Frontend)

---

## Issue 8: Creación Base de Preguntas por IA

## Descripción
Implementar el sistema base para la creación de preguntas utilizando inteligencia artificial.

## Tareas
- [ ] Diseñar estructura de preguntas IA
- [ ] Crear endpoint para generación
- [ ] Integrar con frontend
- [ ] Guardar preguntas en base de datos
- [ ] Probar flujo completo

## Criterios de Aceptación
- Las preguntas IA se crean correctamente
- Se guardan en la base de datos
- El frontend las muestra correctamente
- El flujo es estable

## Estimación
**4 horas**

## Asignado a
@Agsergio04 (Backend)

---

## Issue 9: Integración Frontend-Backend para Prompt

## Descripción
Pasar el prompt de generación de preguntas del frontend al backend para su procesamiento.

## Tareas
- [ ] Crear endpoint para recibir prompt
- [ ] Implementar llamada desde frontend
- [ ] Validar datos del prompt
- [ ] Procesar prompt en backend
- [ ] Retornar respuesta al frontend

## Criterios de Aceptación
- El prompt se envía correctamente
- El backend procesa el prompt
- La respuesta llega al frontend
- Los errores se manejan correctamente

## Estimación
**2 horas**

## Asignado a
@Agsergio04 (Backend/Frontend)

---

## Issue 10: Refactorización Docker Entrypoints

## Descripción
Refactorizar los componentes docker-entrypoints.sh y verificar la creación de preguntas.

## Tareas
- [ ] Revisar docker-entrypoint.sh actual
- [ ] Optimizar scripts de inicio
- [ ] Verificar creación de preguntas
- [ ] Probar en contenedor Docker
- [ ] Documentar cambios

## Criterios de Aceptación
- Los scripts de Docker funcionan correctamente
- La creación de preguntas funciona
- El contenedor inicia sin errores
- La documentación está actualizada

## Estimación
**2 horas**

## Asignado a
@Agsergio04 (DevOps)

---

*Total de issues: 10*
*Estimación total: 33 horas*
