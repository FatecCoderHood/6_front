# EnerSight Frontend

Vue 3 + TypeScript single-page app for EnerSight. Renders the DEC/FEC continuity-indicator
dashboards, the geographic heatmap, forecast view, and user/admin management screens.

## Tech stack

- Vue 3 (`<script setup>`), TypeScript, Vite
- vue-router, vue-i18n
- axios (HTTP clients)
- Chart.js (charts), Leaflet + leaflet-draw + leaflet.heat (map)
- Vitest + jsdom (tests)

## What it talks to

The app calls two backend services, each with its own axios client in `src/api/client.ts`:

| Client | Talks to | Default dev proxy target |
|---|---|---|
| `apiClient` | enersight-api (geo/data) | `http://localhost:8080` |
| `authClient` | enersight-auth (login, users, self-service) | `http://localhost:8082` |

In dev, Vite proxies `/api` and `/auth-api` to those targets (see `vite.config.ts`). Several
pages fall back to bundled mock data when a real backend call fails to reach the network at all
(not on a real rejection) — useful for working on the UI without the full stack running, but the
real backends are needed for genuine end-to-end behavior.

## Running it

```bash
npm install
npm run dev       # http://localhost:5173, hot reload
```

For the calls to actually succeed against real data, start the backends first:

```bash
# from backend/docker
docker compose up -d enersight-auth-db enersight-auth enersight-db
# enersight-api has no docker-compose entry yet — run it locally, see its own README
```

Other scripts:

```bash
npm run build     # vue-tsc -b && vite build — type-checks, then builds to dist/
npm run preview   # serves the production build locally
```

### Environment variables

Only needed to point the dev proxy or a production build at non-default locations:

| Variable | Default | Used for |
|---|---|---|
| `VITE_API_PROXY` | `http://localhost:8080` | Dev-server proxy target for `/api` (enersight-api) |
| `VITE_AUTH_API_PROXY` | `http://localhost:8082` | Dev-server proxy target for `/auth-api` (enersight-auth) |
| `VITE_API_BASE_URL` | `/api` | Base URL baked into a production build for enersight-api |
| `VITE_AUTH_API_BASE_URL` | `/auth-api` | Base URL baked into a production build for enersight-auth |

## Tests

```bash
npm run test      # vitest run
```

Test files live next to the code they cover (e.g. `src/service/auth.usecase.test.ts`). Coverage is
currently limited to login/auth logic — most UI behavior is verified manually against a running
backend, since there's no component-test setup yet.
