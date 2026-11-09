# EnerSight frontend — instructions

Repository `6_front` (submodule `frontend/` of EnerSight). Workspace rules (business rules, branch/commit standard, language, safety) live in the parent repo's `.github/copilot-instructions.md`; the essentials are repeated so this file stands alone.

**Existing code shows the conventions in use, not that it is correct.** Check "Known gaps" before copying a pattern, and flag problems you touch instead of silently replicating them.

## Stack (verified from `package.json`)
Vue 3.5, TypeScript ~6.0, Vite 8, vue-router 5, vue-i18n 9, axios, Chart.js, Leaflet (+ leaflet-draw, leaflet.heat), jsPDF, `@mdi/js`. npm. **No Vuetify** (the root README claims it), **no Pinia, ESLint, Prettier or tests.** Deployed by an Azure Static Web Apps workflow (`app_location: "/"`, `output_location: "dist"`).

## Living notes
Verified state and backlog per area are in the workspace repo, `docs/project-memory/` (start with `authentication.md` for login, registration, roles and the users page). Read the note before touching the area, and update it in the same change when you fix or touch an item. The `[front]` items there are this module's backlog. The notes were verified against specific commits (see each note's header), so re-check the code first.

## Commands
`npm run dev`, `npm run build` (`vue-tsc -b && vite build`, the only automated check), `npm run preview`. Don't add a linter, formatter or test runner without asking the owner.

## Config facts
- `tsconfig.app.json` extends `@vue/tsconfig` and sets `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch`; `strict` is inherited, not explicit. No path aliases: imports are relative.
- Env vars: `VITE_API_BASE_URL` (default `/api`) in `src/config/api.config.ts`; `VITE_API_PROXY` (default `http://localhost:8080`) in `vite.config.ts`. Never put secrets in `VITE_*` variables (they are bundled into the client).

## Structure and conventions (verified)
- `src/`: `api/` (axios wrapper `client.ts`, `auth.api.ts`, `users.api.ts`, `mapa.api.ts`), `service/` (use cases and mocks), `composables/` (`useMapaData`, `useToast`), `components/`, `pages/`, `routes/index.ts`, `locales/` (`en.json`, `pt.json`), `types/`, `config/`, `i18n.ts`. Root `styles/` also exists (not inspected).
- Components use `<script setup lang="ts">` with `defineProps<{...}>()`. Page CSS is `scoped`; `src/style.css` is global. Icons: `@mdi/js` paths rendered via `v-html="svg(mdiX)"` (safe only because the input is static; never pass user data to `v-html`).
- Naming is mixed: pages `XxxPage.vue` (`LoginPage`, `MapaPage`) plus a few without the suffix (`MinhaConta`, `AgentePrevisao`); identifiers and comments are often Portuguese. For new files use the `XxxPage.vue` form and English identifiers; keep Portuguese for domain terms and for the UI via `pt.json`.
- Routing: all routes imported eagerly; meta `title`, `requiresAuth`, `roles` (lowercase `'admin'`, `'user'`); a global `beforeEach` handles auth redirect, role gate and document title. Prefer lazy imports for new heavy pages.
- i18n: nested keys in both locales (en 225 keys, pt 227 at investigation time; `pt` has stray top-level `Cadastro` and `Login`). Every new user-visible string needs a key in **both** files; don't add hard-coded text.
- Types: `src/types` only has `mapa.types.ts`. New API payloads need types there (or a new `*.types.ts`); avoid `any` even though the existing code uses it widely.
- State: local refs, module singletons and composables; no store library. Don't introduce one for a small feature.

## API integration reality (verified)
- Only `mapa.api.ts` calls the real backend (`GET /geo`, `/geo/{id}`, `/geo/estatisticas`, relative to `/api`).
- **Partly mocked** (verified at `9c763fc`; see `docs/project-memory/authentication.md`): login calls the real `/api/auth/login`; registration calls the real endpoint but omits `acceptedTermIds`; `UsersPage.vue` falls back to `mockData` and `localStorage` when API calls fail. Logs, forecast and account pages still use mocks (`LogsMock`, `PrevisaoMock`, `mockData`). When you wire a screen to the API, replace mock usage deliberately and say so; don't delete mocks other screens still use.
- Backend error bodies are `{status, error, message, timestamp}`; backend statuses: 401 invalid credentials, 403 inactive, 409 already exists, 422 mandatory terms, 400 validation. A pending user is rejected by the API at login; the status code returned for that case is unverified.

## Business rules that touch the UI
- Self-registration creates `PENDING` users; only approved users use the platform; admins approve/reject (rejection needs a justification) and manage users and logs. The UI has no `PENDING` role: pending users are blocked at login.
- Registration must show terms of use, privacy notice and optional marketing consent, recorded separately (RF03).
- Ranking (RF09) and heatmap (RF10) show public aggregated data only, with filters (year, distributor, state, electrical group, substation), a clear legend and visible sort criteria.
- Role gating in the router is client-side only and cannot protect data; the backend must enforce roles.

## Known gaps (mention, don't silently change)
- Token storage: `client.ts` and `auth.usecase.ts` both use the key `auth` at `9c763fc`. `client.ts` logs every request with `console.log` and has no 401 handling.
- Role checks are client-side only, and `hasRole` reads `roles/authorities` while the API returns `role`, so admin routes are likely unreachable (see the authentication note).
- Token stored in `localStorage`/`sessionStorage` (XSS-exposed) once real auth is wired.
- `any` widely used (API layer, `getCurrentUser()`, `MapView.vue` props), `as any` in the router; `DashboardPage` and `ReservaPage` are dead stubs without routes.
- Route titles and auth error messages are hard-coded in Portuguese; app name is spelled `Enersigh` in the router and `Enersight` in `main.ts`.
- Template leftovers (`HelloWorld.vue`, `vite.svg`, `vue.svg`, `hero.png`), personal/large assets in `src/assets` (`chads.png` 2.2 MB, `Juan.jpeg`, `filhoJuan.jpeg`, empty `pole.png`); `HomePage.vue` references `/src/assets/chads.png` by dev path, which may break in the production build.
- No `staticwebapp.config.json` found, so SPA deep-link fallback may be missing (not verified); the workflow injects no `VITE_*` env.
- `README.md` is the unchanged Vue/Vite template.

## Git and delivery
Branch `<TASK-ID>/<lowercase-hyphenated-description>` from `develop`; commit `<TASK-ID> <type>: <short lowercase description>` (feat, fix, chore, docs, style, refactor, perf, test, build, ci, revert, hotfix). PR to `develop`, two approvals. Commit/push only when asked. Don't commit `node_modules` or `dist`.
