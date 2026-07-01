# URL Checker

Fullstack service for asynchronous URL checking.

## Workspace

- `apps/backend` - NestJS API
- `apps/frontend` - React/Vite application
- `packages/contracts` - shared TypeScript API contracts

## Docker Run

Requirements: Docker with Docker Compose.

```bash
docker compose up --build
```

Open:

- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/docs`

Stop:

```bash
docker compose down
```

## Local Development

Requirements: Node.js 22+, pnpm 11+.

```bash
pnpm install
pnpm dev:backend
pnpm dev:frontend
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/docs`

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Environment

Backend environment:

- `APP_HOST` - host for NestJS server, default `0.0.0.0` in Docker
- `APP_PORT` - backend port, default `3000`
- `CORS_ORIGINS` - comma-separated allowed origins
- `JOB_CONCURRENCY` - max concurrent HEAD requests per job, default `5`
- `HEAD_TIMEOUT_MS` - HEAD request timeout in milliseconds

Frontend environment:

- `VITE_API_BASE_URL` - API base URL, default `/api`
