# ARCHITECTURE.md — Cyber-Arcade

## System overview

Cyber-Arcade is a full-stack gamified cyber-security learning platform. The frontend is a React + TypeScript + Tailwind CSS v4 SPA built with Vite. The backend is a stateless FastAPI service that serves challenge manifests and a daily challenge. Profile, progress, badges, and settings are persisted in the browser via IndexedDB.

## Components

### Frontend (`frontend/`)

- `src/main.tsx` — React app entry. Wraps the app with `BrowserRouter` and `QueryClientProvider`.
- `src/App.tsx` — route definitions for `/`, `/learn`, `/challenge/:id`, `/profile`, `/leaderboard`, `/settings`.
- `src/pages/` — route-level page components: Dashboard, Learn, Challenge, Profile, Leaderboard, Settings.
- `src/components/` — React components: Layout, Nav, HudBar, ChallengeCard, LabFrame, Loading.
- `src/services/` — runtime services:
  - `store.ts` — simple observable in-memory store for React subscriptions.
  - `db.ts` — IndexedDB wrapper using `idb`.
  - `api.ts` — backend fetch wrappers for challenge manifests, domains, and daily challenge.
  - `gamify.ts` — XP/level, streaks, badges, and daily challenge logic.
  - `progress.ts` — profile, progress, badges, and settings load/update helpers.
- `src/config/domains.ts` — shared `DOMAINS` array.
- `src/types.ts` — TypeScript interfaces for domain, challenge, progress, profile, badges, settings, daily challenge.
- `src/index.css` — Tailwind CSS v4 CSS-first theme and utilities.
- `public/legacy/` — legacy lab assets (`modules/**/lab.js`, `styles/`, `sandbox-runtime.js`) used by the sandboxed iframe.

### Backend (`backend/`)

- `app/main.py` — FastAPI application with `/api/challenges`, `/api/challenges/{id}`, `/api/domains`, `/api/daily`, and CORS middleware.
- `app/models.py` — Pydantic models for `Domain`, `ChallengeManifest`, and `DailyChallenge`.
- `app/services/validator.py` — manifest validation logic ported from the legacy validator.
- `app/data/challenges.json` and `app/data/domains.json` — extracted manifest data baked into the container image.

### Lab engine

- `LabFrame` renders a `srcdoc` iframe with `sandbox="allow-scripts"`.
- The iframe loads a challenge's `lab.js`, the legacy `sandbox-runtime.js`, and required CSS.
- `sandbox-runtime.js` sends a `ready` message; the parent responds with `init` and the challenge object.
- The lab calls `hooks.onComplete`, `hooks.onFail`, and `hooks.onHint`, which are relayed back to the parent via `postMessage`.

## Data flow

1. `useInitState` loads profile, progress, badges, and settings from IndexedDB into `store`.
2. `useChallenges` fetches the challenge manifest from `/api/challenges` via TanStack Query.
3. Page components subscribe to `store` paths (profile, progress, badges, settings) with `useStore`.
4. Starting a challenge writes a `started` progress record to IndexedDB.
5. Completing a challenge writes `completed` progress, awards XP, updates the profile, and recomputes badges.
6. The `HudBar` and `Profile` page react to store updates.

## State management

- `store.ts` holds a global in-memory state object and notifies subscribers.
- React components read store values via the `useStore` hook (`useSyncExternalStore`).
- All persistence goes through `db.ts` (IndexedDB).
- `progress.ts` coordinates writes to `db` and updates to `store`.

## Storage

- Browser: IndexedDB stores `profiles`, `progress`, `badges`, `settings`, and `logs`.
- Key `default` is used for the single profile/settings document.
- Exports/imports are supported through `db.exportProfile` and `db.importProfile`.
- See `DATABASE.md` for legacy schema details (storage shape remains compatible).

## Security model

- No user authentication. Local profile only.
- The backend is stateless; no user data is stored or processed server-side.
- Labs are untrusted and run in `srcdoc` iframes with `sandbox="allow-scripts"` and no `allow-same-origin`.
- User payloads are never `eval`-ed. Labs implement deterministic checkers.
