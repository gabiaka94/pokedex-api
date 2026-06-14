# Pokedex API — Agent Guide

## Project overview

REST API that returns Pokemon information with fun translated descriptions. Two main endpoints: basic Pokemon info and translated Pokemon info (Yoda or Shakespeare).

## Tech stack

Node.js + TypeScript, Express 5, axios, Jest + supertest for testing.

## Architecture

Three-layer architecture with strict separation of responsibilities:

- **Routes/Controllers** (`src/routes/`, `src/controllers/`) — HTTP concerns only. Controllers extract params, call the service, return the response.
- **Services** (`src/services/`) — Business logic. Translation rules live here: cave habitat or legendary → Yoda, otherwise → Shakespeare. Fallback to standard description if translation fails.
- **Clients** (`src/clients/`) — External API communication. Each client knows how to talk to one API. The translation client never throws — returns `null` on any error. The PokéAPI client throws typed errors (`PokemonNotFoundError`, `ExternalApiError`).

## Key conventions

- External API response types are co-located in the client file, not exported. Only domain types live in `src/types/`.
- `app.ts` and `server.ts` are separated so tests can import the Express app without starting the server.
- Custom logger (`src/utils/logger.ts`) wraps console with levels. No external logging dependencies.
- Error handling: custom error classes in `src/errors/` map to HTTP status codes. Global error handler in middleware catches everything.

## Testing

- Unit tests: `tests/unit/` — mock external dependencies (axios, clients).
- Integration tests: `tests/integration/` — use supertest against the Express app with mocked axios.
- Run with `npm test`.

## External APIs

- **PokéAPI** (`https://pokeapi.co/api/v2/pokemon-species/{name}`) — Pokemon data. Static, cacheable.
- **FunTranslations** (`https://api.funtranslations.mercxry.me/v1/translate/{type}`) — Text translation. Rate limited (5 req/min). Accepts text in POST body as JSON.
