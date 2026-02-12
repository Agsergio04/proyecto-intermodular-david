
# PreguntaT  
## Índice

- [Descripción del Proyecto](#descripcion-del-proyecto)
- [Stack Tecnológico](#stack-tecnologico)
- [Instalación y Configuración](#instalacion-y-configuracion)
- [Demostración](#prueba-realizada)
- [Despliegue en Producción](#puesta-en-produccion)
- [Documentación API](#documentacion-api)
- [Seguridad](#seguridad)
- [Equipo de Desarrollo](#equipo-de-desarrollo)
- [Licencia](#licencia)


# Descripcion sencilla
[![Backend v1.0.0](https://img.shields.io/badge/backend-v1.0.0-blue)](backend/)
[![Frontend v1.0.0](https://img.shields.io/badge/frontend-v1.0.0-blue)](frontend/)
[![License ISC](https://img.shields.io/badge/license-ISC-green)](LICENSE)
[![Node >=18](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-enabled-blue?logo=docker)](https://www.docker.com/)
[![Deployed on Render](https://img.shields.io/badge/deployed-Render-brightgreen)](https://ai-interview-frontend-q9db.onrender.com)
[![CI](https://img.shields.io/github/actions/workflow/status/Agsergio04/proyecto-intermodular-david/ci.yml?branch=main)](https://github.com/Agsergio04/proyecto-intermodular-david/actions)
[![Last commit](https://img.shields.io/github/last-commit/Agsergio04/proyecto-intermodular-david/main)](https://github.com/Agsergio04/proyecto-intermodular-david/commits/main)
[![GitHub stars](https://img.shields.io/github/stars/Agsergio04/proyecto-intermodular-david?style=social)](https://github.com/Agsergio04/proyecto-intermodular-david/stargazers)

## Descripcion del proyecto
Este es un proyecto el cual tiene como objetivo la realizacion de una entrevista de un proyecto de github con un proposito didactico,siendo posible la realizacion de la practica por medio de ia (`gemini 2.5 flash`) e incluso la realizacion de las preguntas hechas por uno mismo.  

Por otro lado tambien tenemos un enfoque de esta aplicaion chatear en lenguaje natural con una base de código para entender su arquitectura, funcionalidades y calidad antes de desarrollar un producto propio con enfoque similar.  

Asi mismo nosotros tenemos un enfoque didactico para el aprendizaje del uso de una tecnologia o conjunto de tecnologias asociadas para un aprendizaje de manera mas "humana". 

## Stack Tecnologico


### Frontend

- **React** – Framework principal de UI 
- **React Router DOM** – Enrutado del frontend 
- **Axios** – Peticiones HTTP 
- **Tailwind CSS** – Framework de estilos utilitario 
- **Vite** – Bundler y entorno de desarrollo 
- **Testing:** Jest, React Testing Library, Supertest 
- **Herramientas:** ESLint, Prettier para la calidad y el formato de código

### Backend

- **Node.js** – Entorno de ejecución 
- **Express** – Framework para API REST 
- **Mongoose** – ODM para MongoDB 
- **MongoDB Atlas** – Base de datos cloud
- **Autenticación y Seguridad:** bcrypt, jsonwebtoken 
- **Testing:** Jest, Supertest 
- **Nodemon** – Hot reload en desarrollo 

### DevOps y Development

- **Docker y docker-compose** – Orquestación y contenedores de servicios
- **Despliegue:** Render.com (automatización Cloud)
- **GitHub Actions** – Integración y entrega continua ([GitHub Actions Docs](https://docs.github.com/actions))
- **Variables de entorno** configuradas para gestión de API keys, secretos, etc.

### Servicios y APIs Adicionales

- **Google Gemini API** – Integración para IA (preguntas/respuestas automáticas)
- **PayPal** – Integración opcional de pagos (configurable desde variables de entorno)
- **(Opcional) Otras APIs o servicios documentados en la configuración y recursos legales**

## Puesta en Produccion  

Para acceder a la puesta en produccion realizada en Render (Tanto el Backend como el Frontend) se accede a traves del siguiente [enlace](ai-interview-frontend-q9db.onrender.com) (https://ai-interview-frontend-q9db.onrender.com) .  

## Prueba Realizada 
Aqui hago la prueba de la realizacion de una entrevista con este enlace del repositorio -> `https://github.com/Agsergio04/proyecto-intermodular-david` y veo los resultados realizados.  

Entro a la pagina: 
![Imagen 1](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_1.png)
Me registro: 
![Imagen 2](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_2.png)
Sale el Dashboard en el cual sale la media de todas las entrevistas realizadas : 
![Imagen 3](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_3.png)
Creo una entrevista con este repostiorio con el lenguaje en español y elijo hacerla sencilla : 
![Imagen 4](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_4.png)
Veo que a la hora de realizarla sale el numero de la pregunta con una entrada de texto para poder realizarla o si quiero avanzar ir a otra pregunta : 
![Imagen 5](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_5.png) 
Respondi a la pregunta anterior con lo cual me ha llevado a la siguiente pregunta a realizar : 
![Imagen 6](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_6.png)
Decidi volver a la anterior para ver que habia puesto dado que se almacena en el recuadro la ultima respuesta realizada : 
![Imagen 7](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_7.png)
Tras realizar la entrevista hasta la ultima pregunta me hubiera gustado acabarla pero como no realice todos las las preguntas porque se me olvido me obliga a rellenar el campo para poder acabarla y entregarla : 
![Imagen 8](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_8.png)
Tras darle al boton te lleva a la pregunta sin realizar mas temprana que tenga,siendo en estecaso la pregunta nº 3 : 
![Imagen 9](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_9.png)
Despues de responder a las preguntas tienes que esperar a que se genere el resultado de las mismas un cierto periodo de tiempo: 
![Imagen 10](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_10.png)
Pasado el tiempo del generado del feedback te lleva al apartado de las entrevistas en el que te lleva a las entrevistas que has realizado ya con la nota dada: 
![Imagen 11](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_11.png)
Metiendote en la entrevista realizada puedes ver un feedback detallado por cada pregunta junto con la nota correspondiente segun la respuesta dada frente a la pregunta a responder: 
![Imagen 12](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_12.png)  

## Instalación y Configuración

### Requisitos Previos

- **Docker y Docker Compose** instalados
- **Git** instalado
- **Node.js** v18+ (para desarrollo local sin Docker)

### Pasos de Instalación

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/Agsergio04/proyecto-intermodular-david.git
cd proyecto-intermodular-david
```

#### 2. Configurar Variables de Entorno

Crea los archivos `.env.local` en las carpetas `backend/` y `frontend/`:

**Backend** (`backend/.env.local`):
```env
# Base de Datos
MONGODB_URI=mongodb://localhost:27017/ai-interview

# Servidor
PORT=5000
NODE_ENV=development

# Autenticación
JWT_SECRET=tu-clave-secreta-muy-segura

# Google Gemini AI
GEMINI_API_KEY=tu-api-key-de-google-gemini

# PayPal (opcional)
PAYPAL_CLIENT_ID=tu-paypal-client-id
PAYPAL_SECRET=tu-paypal-secret
```

**Frontend** (`frontend/.env.local`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 3. Desplegar con Docker

```bash
# Descargar imágenes y construir contenedores
docker-compose build --no-cache

# Iniciar servicios en segundo plano
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

#### 4. Detener Servicios

```bash
# Parar contenedores
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v
```

## Documentación API

- [Documentación de la API REST](docs/documentacion_api.md)
- [Política de Seguridad](SECURITY.md)
- [Informe de Seguridad - Trivy](trivy/README.md)

## Seguridad

Este proyecto implementa medidas de seguridad robustas:

- **Helmet.js**: Headers HTTP de seguridad automáticos
- **CORS**: Validación de orígenes permitidos
- **Rate Limiting**: Protección contra DDoS (100 req/IP cada 15 min)
- **JWT**: Autenticación segura con tokens
- **Bcrypt**: Hash de contraseñas con 10 rounds de sal
- **Validación de Entrada**: Validación con express-validator
- **MongoDB**: Acceso autenticado a la base de datos

Para más información, consulta [SECURITY.md](SECURITY.md).

PreguntaT ha sido desarrollado por los siguientes profesionales: 

### Primer Participante
#### Sergio Aragón García 
**GitHub** : [@Agsergio04](https://github.com/Agsergio04)  
**Rol** : Desarrollador Full Stack / Líder de Proyecto  
**Responsabilidades** : Coordinación del equipo, análisis de requisitos, diseño e implementación de funcionalidades principales, gestión de la integración entre frontend y backend, revisión de código y despliegue y documentacion.

### Segundo Participante
#### Pablo Sanz Aznar
**GitHub** : [@pablitoclavito04](https://github.com/pablitoclavito04)  
**Rol** : Frontend Developer   
**Responsabilidades** : Desarrollo del frontend y documentación.

## Licencia

Este proyecto está bajo la licencia ISC. Consulta el archivo [LICENSE.md](LICENSE.md) para más detalles. : 
