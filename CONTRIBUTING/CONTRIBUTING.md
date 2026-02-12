# Contributing to AI AskYourself

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature or fix

```bash
git checkout -b feature/your-feature-name
```

4. Set up the development environment:

```bash
# Copy environment files
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env.local

# Start with Docker
docker-compose up --build
```

5. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## Development Workflow

1. Make your changes in the appropriate directory (`frontend/` or `backend/`)
2. Test your changes locally
3. Commit your changes with a clear and descriptive message

```bash
git commit -m "feat: add new interview category filter"
```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, semicolons, etc.)
- `refactor:` - Code refactoring without feature changes
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Submitting Changes

1. Push your branch to your fork
2. Open a Pull Request against the `main` branch
3. Fill in the PR template with all relevant information
4. Wait for a review from the maintainers

## Project Structure

```
proyecto-intermodular-david/
├── backend/          # Express.js API server
│   ├── controllers/  # Route handlers
│   ├── middleware/    # Auth and validation middleware
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API route definitions
│   └── server.js     # Entry point
├── frontend/         # React SPA
│   ├── src/
│   │   ├── api/      # API client and i18n config
│   │   ├── components/
│   │   ├── hooks/    # Custom React hooks
│   │   ├── pages/    # Page components
│   │   └── store/    # Zustand state stores
│   └── public/
└── docker-compose.yml
```

## Code Guidelines

- Follow existing code style and patterns
- Keep components small and focused
- Use meaningful variable and function names
- Add comments only where the logic is not self-evident

## Need Help?

Feel free to open an issue if you have questions or need guidance on contributing.
