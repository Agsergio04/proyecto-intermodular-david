# c) Objetivos y Alcance del Proyecto

## Objetivos del proyecto (SMART y específicos)

### Objetivos SMART

- **Específico:** Desarrollar una aplicación web que permita a los usuarios analizar un repositorio público de GitHub proporcionando su URL. La herramienta generará automáticamente un informe estructurado sobre su arquitectura, tecnologías utilizadas y estructura general del código, respondiendo a preguntas en lenguaje natural.

- **Medible:** Lograr que el 90% de los análisis sobre repositorios públicos estándar (ej. proyectos con frameworks conocidos) generen un informe coherente y relevante. El tiempo de generación del informe no debe superar los 2 minutos por repositorio.

- **Alcanzable:** Construir un MVP (Producto Mínimo Viable) utilizando tecnologías como la API de GitHub para acceder al código, APIs de LLMs (Modelos Lingüísticos Grandes) para el análisis y un framework web moderno (como Node.js/React o similar) en un plazo de 3 meses.

- **Relevante:** Aportar una solución que acelere la comprensión y evaluación de código ajeno para desarrolladores, líderes técnicos y estudiantes, diferenciándose de la competencia al ofrecer informes estructurados en lugar de solo una interfaz de chat.

- **Temporal:** Tener desplegada la versión MVP, capaz de analizar repositorios y generar un informe básico, antes del final del segundo trimestre de 2025.

### Objetivos generales y específicos

#### Objetivo general
Desarrollar una herramienta web SaaS que simplifique el análisis de repositorios de código de GitHub, permitiendo a los usuarios obtener informes automáticos y detallados sobre la arquitectura, calidad y estructura de cualquier proyecto público para facilitar su comprensión y evaluación.

#### Objetivos específicos

-   Diseñar una interfaz de usuario limpia y sencilla donde el único requisito para el usuario sea introducir la URL de un repositorio de GitHub.
-   Implementar un motor de análisis que se conecte a la API de GitHub, clone o lea el repositorio y extraiga su estructura de archivos, dependencias y código fuente.
-   Integrar un LLM para interpretar el código y generar un análisis coherente sobre la arquitectura, los patrones de diseño principales y las tecnologías empleadas.
-   Presentar el resultado en un formato de informe estructurado y fácil de leer, con secciones claras (ej. "Arquitectura", "Dependencias Clave", "Resumen de Calidad").
-   Validar que el sistema funciona correctamente con repositorios de diferentes tamaños y tecnologías populares, garantizando una experiencia sin fricción.

## Criterios de éxito

Se consideran criterios de éxito para validar si el MVP cumple su propósito:

-   Un usuario puede analizar un repositorio público de principio a fin simplemente pegando una URL.
-   La aplicación genera un informe estructurado que contiene al menos tres secciones diferenciadas (p. ej., arquitectura, lenguaje/frameworks, dependencias).
-   El tiempo de análisis y generación del informe es inferior a 2 minutos para repositorios de tamaño mediano (hasta 1000 archivos).
-   El sistema gestiona correctamente los errores, informando al usuario si un repositorio no es accesible o es demasiado grande para el análisis.
-   Al menos el 80% de los usuarios de prueba confirman que el informe generado les ayudó a entender el repositorio más rápido que una revisión manual.

## Delimitación del alcance (qué SÍ y qué NO, posibles ampliaciones)

### Incluye (Sí):

-   Análisis de **repositorios públicos** de GitHub.
-   Entrada única a través de la URL del repositorio.
-   Generación de un **informe estático y estructurado** con secciones predefinidas.
-   Análisis enfocado en:
    -   Detección de lenguaje y *framework* principal.
    -   Resumen de la arquitectura general (ej. MVC, microservicios, monolito).
    -   Listado de dependencias clave.
-   Interfaz web sencilla para introducir la URL y visualizar el informe.

### No incluye (No) en el MVP:

-   Análisis de repositorios **privados** o autoalojados (self-hosted).
-   **Interfaz de chat interactiva** (se prioriza el informe estructurado sobre la conversación).
-   Análisis de seguridad, detección de vulnerabilidades o informes de cobertura de tests.
-   Comparación entre ramas (*branches*) o análisis de *Pull Requests*.
-   Autenticación de usuarios o almacenamiento de historiales de análisis.
-   Despliegue local (*self-hosted*) para privacidad empresarial.

### Posibles ampliaciones futuras:

-   Soporte para repositorios privados mediante autenticación con GitHub (OAuth).
-   Ofrecer una opción de despliegue local (*self-hosted*) para empresas (nicho de privacidad).
-   Generar informes más detallados y especializados (seguridad, calidad del código, rendimiento).
-   Añadir una capa de chat conversacional para hacer preguntas específicas sobre el informe generado.
-   Integración con herramientas de CI/CD para analizar *Pull Requests* automáticamente.
