# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY tsconfig.base.json ./
COPY apps/backend apps/backend
COPY packages/contracts packages/contracts

RUN pnpm --filter @url-checker/backend build

FROM node:22-alpine AS prod-deps

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN pnpm install --prod --frozen-lockfile --filter @url-checker/backend...

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV APP_HOST=0.0.0.0
ENV APP_PORT=3000

RUN addgroup -S app && adduser -S app -G app

COPY --from=prod-deps --chown=app:app /app/package.json ./package.json
COPY --from=prod-deps --chown=app:app /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=prod-deps --chown=app:app /app/node_modules ./node_modules
COPY --from=prod-deps --chown=app:app /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=prod-deps --chown=app:app /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=build --chown=app:app /app/apps/backend/dist ./apps/backend/dist
COPY --from=build --chown=app:app /app/packages/contracts ./packages/contracts

USER app

EXPOSE 3000

CMD ["node", "apps/backend/dist/main.js"]
