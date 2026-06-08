# Filo UI

A production-grade React application scaffold.

## Stack

- **Framework**: React 19 + TypeScript 6 (strict mode)
- **Build Tool**: Vite 8
- **Routing**: react-router-dom v6
- **Data Fetching**: TanStack React Query v5 + Axios
- **State Management**: Zustand
- **Forms**: react-hook-form + Zod validation
- **Styling**: Tailwind CSS v3 (class-based dark mode)
- **UI Components**: shadcn-compatible primitives (Button, Input, Form, Card)
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint (flat config) + Prettier + Husky + lint-staged

## Getting Started

```bash
# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

## Available Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start Vite development server    |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview production build         |
| `npm run lint`    | Run ESLint on all source files   |
| `npm test`        | Run Vitest tests                 |
| `npm run test:watch` | Run tests in watch mode       |

## Project Structure

```
src/
├── assets/         # Static assets (images, fonts)
├── components/
│   ├── ui/         # Reusable UI primitives
│   └── ...         # Shared components
├── config/         # Environment variable validation
├── features/       # Feature-based modules
├── hooks/          # Global custom hooks
├── layouts/        # Page layout wrappers
├── lib/            # Third-party library configs
├── pages/          # Route-level components
├── routes/         # Route definitions
├── services/       # API call functions
├── store/          # Zustand state slices
├── types/          # Shared TypeScript types
└── utils/          # Pure helper functions
```
