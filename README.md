# Pokedex API

A REST API that returns Pokemon information with fun translated descriptions, built with Node.js and TypeScript.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/pokemon/:name` | Basic Pokemon information |
| GET | `/pokemon/translated/:name` | Pokemon info with translated description |
| GET | `/health` | Health check |
| GET | `/api-docs` | Interactive Swagger UI |

### Translation rules

- **Legendary** or **cave habitat** Pokemon → Yoda translation
- All others → Shakespeare translation
- If the translation API fails (rate limit, timeout, etc.) → falls back to the standard description

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Install and run

```bash
npm install
npm run dev
```

The server starts on `http://localhost:3000`.

### Run with Docker

```bash
docker build -t pokedex-api .
docker run -p 3000:3000 pokedex-api
```

### Run tests

```bash
npm test
npm run test:coverage
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `POKEAPI_BASE_URL` | `https://pokeapi.co/api/v2` | PokéAPI base URL |
| `TRANSLATION_API_BASE_URL` | `https://api.funtranslations.mercxry.me/v1` | FunTranslations base URL |
| `LOG_LEVEL` | `info` | Log level (`debug`, `info`, `warn`, `error`) |

## Architecture

```
src/
├── clients/          # HTTP clients for external APIs
├── controllers/      # Request/response handling
├── services/         # Business logic (translation rules)
├── routes/           # Route definitions
├── middleware/       # Error handler, request logger
├── errors/           # Custom error classes
├── types/            # Shared domain types
└── utils/            # Custom logger
```

### Design decisions

**Three-layer architecture** — Routes/Controllers handle HTTP concerns, Services contain business logic, Clients manage external API communication. If the translation API changes, only the client needs updating.

**Graceful degradation** — The translation client never throws. On any failure (429 rate limit, timeout, network error) it returns `null` and the service falls back to the standard description. The API stays available even when FunTranslations is down.

**Custom logger** — A minimal wrapper over `console` with log levels and timestamps, controlled by the `LOG_LEVEL` env var. Zero dependencies. Every external API call is logged with timing, and rate limit hits are logged at `warn` level.

**Separated app/server** — `app.ts` exports the Express app without calling `listen()`, so integration tests can use it directly with supertest.

**Error handling** — Custom error classes (`PokemonNotFoundError`, `ExternalApiError`) map to HTTP status codes (404, 502). A global error handler catches everything and returns consistent error responses.

## What I'd do differently in production

**Caching** — Cache responses from external APIs to reduce latency and avoid hitting rate limits. Pokemon data is static, and translations are idempotent (same input always produces the same output), making both excellent candidates for caching with generous TTLs.

**Rate limiting** — Protect our own API from abuse by limiting the number of requests per client over a time window.

**Paid translation API** — The free tier allows 5 requests/minute. A paid plan would remove this constraint.

**Security hardening** — Security headers, CORS configuration, and input validation to prevent malformed or malicious requests.

**Observability** — Structured JSON logging for easy ingestion into log aggregation tools, plus metrics (request count, latency, error rate) for monitoring and alerting. Health check extended with dependency status.

**CI/CD** — Automated pipeline: lint → test → build → containerize → deploy.

**API versioning** — Prefix routes with a version (e.g. `/v1/`) to allow backward-compatible evolution of the API.

**Graceful shutdown** — Handle termination signals to finish in-flight requests and close connections cleanly before the process exits.

**Request timeouts** — Set a timeout on every external API call. Without one, if an upstream service hangs, our request hangs too, tying up resources indefinitely.

**Retry with exponential backoff** — When an external call fails with a transient error (timeout, 503, network error), retry after an increasing delay (1s, 2s, 4s). Add jitter (a small random delay) to prevent multiple clients from retrying in sync and overwhelming the recovering service. Only retry transient errors — a 404 or 400 won't change on the next attempt.

**Circuit breaker** — Track consecutive failures for each external API. After a threshold is reached, stop calling the API entirely and return the fallback immediately. After a cooldown period, allow a single probe request: if it succeeds, resume normal traffic; if not, stay open. This avoids adding latency from calls you already know will fail, and gives the upstream service time to recover.

**Correlation ID** — Generate a unique ID for every incoming request and propagate it through all logs and outbound API calls. When investigating an issue in production, this lets you trace a single request's entire journey across services.
