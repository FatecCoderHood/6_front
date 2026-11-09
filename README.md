# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Mock vs real backend

API calls for auth, users and terms can run against in-memory mocks so the UI works without the backend.

1. `cp .env.example .env.local` (`.env*` files are git-ignored; only `.env.example` is committed).
2. Set `VITE_USE_MOCKS=true` for mocks, or `false` (default when unset) for the real backend.
3. Restart `npm run dev` after changing it.

The flag is read once in `src/config/api.config.ts`; each module in `src/api/` (`auth.api.ts`, `users.api.ts`, `terms.api.ts`) picks the mock or real implementation. Mocks live in `src/api/mocks/`, return the backend DTO shapes and error bodies, and reset on page reload.

Mock accounts (password `1234`): `admin@tecsys.com` (ADMIN), `user@tecsys.com` (USER), `pending@tecsys.com` (PENDING, login returns 403).

With the flag off, API errors are shown to the user; there is no silent fallback to mock data.
