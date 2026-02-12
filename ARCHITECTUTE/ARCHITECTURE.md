# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                   │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              React SPA (Port 3000)                │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────────────┐  │  │
│  │  │  Pages  │ │Components│ │   Zustand Stores  │  │  │
│  │  └────┬────┘ └─────┬────┘ │ (auth, theme,     │  │  │
│  │       │            │      │  interviews, i18n, │  │  │
│  │       └──────┬─────┘      │  subscription)     │  │  │
│  │              │            └──────────┬────────┘  │  │
│  │              ▼                       │           │  │
│  │        ┌──────────┐                 │           │  │
│  │        │ Axios API│◄────────────────┘           │  │
│  │        │  Client  │                             │  │
│  │        └─────┬────┘                             │  │
│  └──────────────┼──────────────────────────────────┘  │
└─────────────────┼─────────────────────────────────────┘
                  │ HTTP/REST (JWT Bearer Token)
                  ▼
┌─────────────────────────────────────────────────────────┐
│              Express.js API Server (Port 5000)          │
│                                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Middleware Pipeline                    │ │
│  │  Helmet → CORS → Rate Limiter → Body Parser → JWT │ │
│  └────────────────────┬───────────────────────────────┘ │
│                       ▼                                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │                   Routes                         │   │
│  │  /api/auth  /api/interviews  /api/responses      │   │
│  │  /api/ai    /api/stats       /api/subscriptions  │   │
│  │  /api/gitinest               /api/users          │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     ▼                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │                Controllers                       │   │
│  └──────┬───────────────────────────────┬───────────┘   │
│         ▼                               ▼               │
│  ┌──────────────┐               ┌───────────────┐       │
│  │   Mongoose   │               │  Google Gemini│       │
│  │   (MongoDB)  │               │  AI API       │       │
│  └──────┬───────┘               └───────────────┘       │
└─────────┼───────────────────────────────────────────────┘
          ▼
┌──────────────────┐
│  MongoDB 7.0     │
│  (Port 27017)    │
│                  │
│  Collections:    │
│  - users         │
│  - interviews    │
│  - questions     │
│  - responses     │
│  - subscriptions │
└──────────────────┘
```

## Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Frontend Framework** | React 18 (CRA) | Mature ecosystem, component-based architecture, large community |
| **State Management** | Zustand | Lightweight alternative to Redux, minimal boilerplate, built-in devtools |
| **Styling** | Tailwind CSS | Utility-first approach, rapid prototyping, consistent design system |
| **Backend Framework** | Express.js | Minimalist, flexible, widely adopted for REST APIs |
| **Database** | MongoDB + Mongoose | Schema flexibility for varied interview data, native JSON support |
| **Authentication** | JWT (7-day expiry) | Stateless auth, no server-side session storage needed |
| **AI Provider** | Google Gemini | Question generation, response evaluation, speech-to-text transcription |
| **Payments** | PayPal SDK | Widely trusted, sandbox environment for testing |
| **Containerization** | Docker Compose | Reproducible environments, one-command setup for all 3 services |
| **Deployment** | Render | Free tier available, simple config with `render.yaml` |
| **i18n** | i18next | Industry standard for React internationalization |
| **HTTP Client** | Axios | Interceptors for JWT injection, request/response handling |

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user profile |
| PUT | `/api/auth/profile` | Yes | Update profile (name, language, image) |
| PUT | `/api/auth/change-password` | Yes | Change password |

### Interviews (`/api/interviews`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/interviews/generate-questions` | Yes | Generate AI questions from a GitHub repo |
| POST | `/api/interviews` | Yes | Create new interview |
| GET | `/api/interviews` | Yes | List all user interviews |
| GET | `/api/interviews/:id` | Yes | Get interview with questions and responses |
| PUT | `/api/interviews/:id/status` | Yes | Update interview status |
| PUT | `/api/interviews/:id/repository` | Yes | Update repository URL |
| DELETE | `/api/interviews/:id` | Yes | Delete interview and related data |

### Responses (`/api/responses`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/responses` | Yes | Submit a response to a question |
| GET | `/api/responses/interview/:id` | Yes | Get all responses for an interview |
| GET | `/api/responses/:id` | Yes | Get a specific response |
| PUT | `/api/responses/:id` | Yes | Update a response |
| POST | `/api/responses/interview/:id/generate-feedback` | Yes | Generate AI feedback for all responses |

### AI (`/api/ai`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/ai/transcribe` | Yes | Speech-to-text via Gemini |
| POST | `/api/ai/next-question` | Yes | Generate next question dynamically |
| POST | `/api/ai/evaluate-response` | Yes | Evaluate a response with AI scoring |

### Subscriptions (`/api/subscriptions`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/subscriptions/create-payment` | Yes | Create PayPal payment ($9.99) |
| POST | `/api/subscriptions/execute-payment` | Yes | Execute payment after approval |
| GET | `/api/subscriptions` | Yes | Get subscription details |
| GET | `/api/subscriptions/premium/check` | Yes | Check premium status |
| DELETE | `/api/subscriptions` | Yes | Cancel subscription |

### Statistics (`/api/stats`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/stats` | Yes | Global user statistics |
| GET | `/api/stats/interview/:id` | Yes | Statistics for a specific interview |
| GET | `/api/stats/trends` | Yes | Performance trends over time |

### Other

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/gitinest` | No | Extract repo info and generate questions |
| GET | `/api/users` | Yes | Get current user profile |
| GET | `/api/health` | No | Health check |

**Total: 29 endpoints** (24 protected, 5 public)

## Data Model

```
┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│    User      │     │  Interview    │     │   Question   │
├──────────────┤     ├───────────────┤     ├──────────────┤
│ email        │──┐  │ title         │──┐  │ text         │
│ password     │  │  │ type          │  │  │ difficulty   │
│ firstName    │  │  │ language      │  │  │ timeLimit    │
│ lastName     │  │  │ difficulty    │  │  │ order        │
│ language     │  └─►│ userId (ref)  │  └─►│ interviewId  │
│ profileImage │     │ status        │     │ (ref)        │
│ createdAt    │     │ completedAt   │     └──────┬───────┘
└──────┬───────┘     │ repositoryUrl │            │
       │             │ totalScore    │            │
       │             │ avgScore      │     ┌──────▼───────┐
       │             └───────────────┘     │   Response   │
       │                                   ├──────────────┤
       │     ┌───────────────┐             │ responseText │
       │     │ Subscription  │             │ responseAudio│
       │     ├───────────────┤             │ duration     │
       └────►│ userId (ref)  │             │ score        │
             │ plan          │             │ strengths    │
             │ status        │             │ improvements │
             │ startDate     │             │ keywords     │
             │ endDate       │             │ feedback     │
             │ features      │             │ questionId   │
             │ paypalId      │             │ interviewId  │
             └───────────────┘             │ userId (ref) │
                                           └──────────────┘
```

## Security Architecture

```
Request Flow:

Client ──► Helmet (security headers)
       ──► CORS (origin validation)
       ──► Rate Limiter (100 req/15min per IP)
       ──► Body Parser (50MB limit)
       ──► JWT Auth Middleware (protected routes)
       ──► express-validator (input validation)
       ──► Controller ──► Response
```

- **Helmet.js**: Sets security-related HTTP headers (X-Frame-Options, CSP, etc.)
- **CORS**: Restricts origins to configured frontend URL
- **Rate Limiting**: 100 requests per 15-minute window per IP on `/api/*`
- **JWT**: 7-day token expiry, stored client-side
- **bcryptjs**: Password hashing with salt rounds
- **express-validator**: Input sanitization and validation

## Deployment Architecture

```
┌─────────────────── Render.com ───────────────────┐
│                                                   │
│  ┌─────────────┐    ┌──────────────────────────┐ │
│  │   Frontend   │    │       Backend            │ │
│  │  (Static     │───►│  (Web Service)           │ │
│  │   Site)      │    │  Express + Node.js       │ │
│  └─────────────┘    └───────────┬──────────────┘ │
│                                  │                │
└──────────────────────────────────┼────────────────┘
                                   │
                          ┌────────▼────────┐
                          │  MongoDB Atlas  │
                          │  (Cloud DB)     │
                          └─────────────────┘
```

Local development uses Docker Compose with three containers (MongoDB, Backend, Frontend) connected via a bridge network (`ai_network`).
