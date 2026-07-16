# ARCHITECTURE.md — Cyber-Arcade

## System overview
Cyber-Arcade is a single-page application (SPA) that runs entirely in the browser. There is no backend. All state is persisted in IndexedDB. The app is installable as a PWA.

## Components

### Browser
- Loads `index.html`.
- Registers `src/sw.js` as a service worker.
- Runs `src/main.js` as an ES module.

### App shell
- `index.html` is a minimal shell: `<!DOCTYPE html>`, `<head>` with CSP, fonts, manifest, `<body>` with `<x-app>` root and a single `<script type="module" src="src/main.js"></script>`.

### Runtime modules
- `src/main.js` — bootstraps app, registers service worker, imports app and styles.
- `src/app.js` — `XApp` custom element. Owns global state, router, and layout.
- `src/router.js` — `Router` class. Maps URL paths to view names and dispatches `route-change` events.
- `src/services/db.js` — `Database` wrapper over IndexedDB. Promise-based API.
- `src/services/store.js` — `Store` reactive state container. Components can subscribe to slices.
- `src/services/progress.js` — `Progress` helper. Reads/writes per-challenge state.
- `src/services/gamify.js` — `Gamify` engine. Computes XP/level, streaks, badges, daily challenges.

### UI layer
- `src/components/` — autonomous Web Components. Each component lives in its own file and is imported by `src/main.js`.
- `src/styles/` — CSS layers, tokens, base, components, animations, utilities.

### Lab engine
- `src/labs/lab-runner.js` — `LabRunner` mounts a challenge's `lab.js` into a sandboxed `iframe` and a control panel.
- `src/labs/protocol.js` — `postMessage` protocol between parent and lab. Defines `init`, `check`, `hint`, `complete`, `fail` message types.

### Content modules
- `src/modules/<domain>/<challenge>/` — self-contained challenge.
  - `manifest.json` — challenge metadata: id, title, domain, difficulty, description, xp, prerequisites, hints, success criteria.
  - `lab.js` — factory function that returns a lab controller.
  - `assets/` — optional images, fonts, data.
- `src/modules/<domain>/index.js` — exports all challenge manifests in that domain.
- `src/modules/registry.js` — imports all domains and exposes a flat challenge map.

## Data flow

1. `index.html` loads `main.js`.
2. `main.js` imports `app.js`, components, services, and styles.
3. `App` initializes `Database`, `Store`, `Router`, and `Gamify`.
4. `App` renders the layout (`<x-app>`) and subscribes to route changes.
5. The router selects the active view:
   - `/` → dashboard
   - `/learn` → learning path
   - `/challenge/:id` → challenge view
   - `/profile` → profile page
   - `/leaderboard` → local leaderboard
   - `/settings` → settings
6. View components read from `Store` and call services to write.
7. IndexedDB updates trigger `BroadcastChannel` updates for multi-tab sync.

## State management

- `Store` holds a reactive JSON state derived from `Database` and runtime events.
- Components re-render on state changes by subscribing to `Store`.
- IndexedDB is the source of truth. `Store` is a mirror for fast reads.
- Writes go through `Database` then update `Store`.

## Storage

- IndexedDB database `cyber-arcade` with stores:
  - `profiles`
  - `progress`
  - `badges`
  - `settings`
  - `logs`
- See `DATABASE.md` for schemas.

## Security model

- No user authentication. Local profile only.
- No backend. No network requests for core functionality.
- Labs are untrusted. They run in `srcdoc` iframes with `sandbox="allow-scripts"` and no `allow-same-origin`.
- The parent and lab communicate over `postMessage` with an origin whitelist.
- User payloads are never `eval`-ed. Labs implement deterministic checkers.
- CSP in `index.html` blocks inline scripts (except importmap if used) and external sources.
