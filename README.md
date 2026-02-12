# PreguntaT

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Demo](#demo)
- [Production Deployment](#production-deployment)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Development Team](#development-team)
- [Contributing](#contributing)
- [License](#license)

## Overview

[![Backend v1.0.0](https://img.shields.io/badge/backend-v1.0.0-blue)](backend/)
[![Frontend v1.0.0](https://img.shields.io/badge/frontend-v1.0.0-blue)](frontend/)
[![License ISC](https://img.shields.io/badge/license-ISC-green)](LICENSE)
[![Node >=18](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-enabled-blue?logo=docker)](https://www.docker.com/)
[![Deployed on Render](https://img.shields.io/badge/deployed-Render-brightgreen)](https://ai-interview-frontend-q9db.onrender.com)
[![CI](https://img.shields.io/github/actions/workflow/status/Agsergio04/proyecto-intermodular-david/ci.yml?branch=main)](https://github.com/Agsergio04/proyecto-intermodular-david/actions)
[![Last commit](https://img.shields.io/github/last-commit/Agsergio04/proyecto-intermodular-david/main)](https://github.com/Agsergio04/proyecto-intermodular-david/commits/main)
[![GitHub stars](https://img.shields.io/github/stars/Agsergio04/proyecto-intermodular-david?style=social)](https://github.com/Agsergio04/proyecto-intermodular-david/stargazers)

## Project Description

This project aims to conduct interviews about GitHub projects for educational purposes. It enables users to practice through AI (`gemini 2.5 flash`) and even create their own custom questions.

Additionally, the application allows users to chat in natural language with a codebase to understand its architecture, features, and quality before developing a similar product with their own approach.

We also take a didactic approach to learning the use of a technology or set of associated technologies in a more "human" way.

## Tech Stack

### Frontend

- **React** – Main UI framework
- **React Router DOM** – Frontend routing
- **Axios** – HTTP requests
- **Tailwind CSS** – Utility-first CSS framework
- **Vite** – Bundler and development environment
- **Testing:** Jest, React Testing Library, Supertest
- **Tools:** ESLint, Prettier for code quality and formatting

### Backend

- **Node.js** – Runtime environment
- **Express** – REST API framework
- **Mongoose** – MongoDB ODM
- **MongoDB Atlas** – Cloud database
- **Authentication and Security:** bcrypt, jsonwebtoken
- **Testing:** Jest, Supertest
- **Nodemon** – Hot reload in development

### DevOps and Development

- **Docker and docker-compose** – Service orchestration and containers
- **Deployment:** Render.com (Cloud automation)
- **GitHub Actions** – Continuous integration and delivery ([GitHub Actions Docs](https://docs.github.com/actions))
- **Environment variables** configured for API keys, secrets, etc.

### Additional Services and APIs

- **Google Gemini API** – AI integration (automatic questions/answers)
- **PayPal** – Optional payment integration (configurable via environment variables)
- **(Optional) Other APIs or services documented in configuration and legal resources**

## Installation and Setup

### Prerequisites

- **Docker and Docker Compose** installed
- **Git** installed
- **Node.js** v18+ (for local development without Docker)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/Agsergio04/proyecto-intermodular-david.git
cd proyecto-intermodular-david
```

#### 2. Configure Environment Variables

Create `.env.local` files in the `backend/` and `frontend/` directories:

**Backend** (`backend/.env.local`):
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ai-interview

# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your-very-secure-secret-key

# Google Gemini AI
GEMINI_API_KEY=your-google-gemini-api-key

# PayPal (optional)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_SECRET=your-paypal-secret
```

**Frontend** (`frontend/.env.local`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 3. Deploy with Docker

```bash
# Pull images and build containers
docker-compose build --no-cache

# Start services in the background
docker-compose up -d

# View logs in real time
docker-compose logs -f
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

#### 4. Stop Services

```bash
# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Environment Variables

### Frontend (`frontend/.env.local`)

| Variable                     | Description                    |
| ---------------------------- | ------------------------------ |
| `REACT_APP_API_URL`          | Backend API base URL           |
| `REACT_APP_GEMINI_API_KEY`   | Google Gemini API key          |
| `REACT_APP_PAYPAL_CLIENT_ID` | PayPal client ID               |

### Backend (`backend/.env.local`)

| Variable        | Description                          |
| --------------- | ------------------------------------ |
| `NODE_ENV`      | Environment (development/production) |
| `PORT`          | Server port (default: 5000)          |
| `MONGODB_URI`   | MongoDB connection string            |
| `JWT_SECRET`    | Secret key for JWT tokens            |
| `FRONTEND_URL`  | Frontend URL for CORS                |
| `GEMINI_API_KEY`| Google Gemini API key                |

## Project Structure

```
proyecto-intermodular-david/
├── backend/
│   ├── controllers/    # Route handlers
│   ├── middleware/      # Auth and validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── scripts/         # Seed scripts
│   ├── server.js        # Entry point
│   └── Dockerfile
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── api/         # API client and i18n
│   │   ├── assets/      # Images and styles
│   │   ├── components/  # Reusable components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   └── store/       # Zustand state stores
│   └── Dockerfile
├── docker-compose.yml
├── render.yaml          # Render deployment config
└── README.md
```

## Production Deployment

The application is deployed on Render (both Backend and Frontend). Access it through the following [link](https://ai-interview-frontend-q9db.onrender.com).

## Demo

Below is a walkthrough of an interview session using the repository `https://github.com/Agsergio04/proyecto-intermodular-david`.

Landing page:
![Screenshot 1](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_1.png)
Registration:
![Screenshot 2](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_2.png)
Dashboard showing the average score across all completed interviews:
![Screenshot 3](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_3.png)
Creating an interview with this repository in Spanish and easy difficulty:
![Screenshot 4](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_4.png)
The interview view shows the question number with a text input to answer, or the option to skip to another question:
![Screenshot 5](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_5.png)
After answering the previous question, it moves to the next one:
![Screenshot 6](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_6.png)
Going back to a previous question to review the stored answer:
![Screenshot 7](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_7.png)
Attempting to finish the interview without answering all questions triggers a validation requiring all fields to be filled:
![Screenshot 8](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_8.png)
The app redirects to the earliest unanswered question (question #3 in this case):
![Screenshot 9](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_9.png)
After submitting all answers, the AI generates feedback (this takes a moment):
![Screenshot 10](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_10.png)
Once feedback is generated, the interviews list shows the completed interview with its score:
![Screenshot 11](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_11.png)
Clicking on the interview shows detailed feedback per question with individual scores:
![Screenshot 12](https://github.com/Agsergio04/proyecto-intermodular-david/blob/main/docs/imgs/Prueba_12.png)

## Architecture

For detailed system architecture, technical decisions, data models, and the full API reference (29 endpoints), see [ARCHITECTURE.md](ARCHITECTURE.md).

## API Documentation

- [REST API Documentation](docs/documentacion_api.md)
- [Security Policy](SECURITY.md)
- [Security Report - Trivy](trivy/README.md)

## Security

This project implements robust security measures:

- **Helmet.js**: Automatic HTTP security headers
- **CORS**: Allowed origin validation
- **Rate Limiting**: DDoS protection (100 req/IP per 15 min)
- **JWT**: Secure token-based authentication
- **Bcrypt**: Password hashing with 10 salt rounds
- **Input Validation**: Validation with express-validator
- **MongoDB**: Authenticated database access

For more information, see [SECURITY.md](SECURITY.md).

## Development Team

PreguntaT was developed by the following professionals:

### Sergio Aragon Garcia
**GitHub**: [@Agsergio04](https://github.com/Agsergio04)
**Role**: Full Stack Developer / Project Lead
**Responsibilities**: Team coordination, requirements analysis, design and implementation of core features, frontend-backend integration management, code review, deployment, and documentation.

### Pablo Sanz Aznar
**GitHub**: [@pablitoclavito04](https://github.com/pablitoclavito04)
**Role**: Frontend Developer
**Responsibilities**: Frontend development and documentation.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
