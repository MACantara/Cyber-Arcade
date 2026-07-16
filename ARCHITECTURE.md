# ARCHITECTURE.md — Cyber-Arcade

## System overview

Cyber-Arcade is a static multi-page website that runs entirely in the browser. There is no backend. State is stored locally: `localStorage` on HTTP/HTTPS and `window.name` on `file://`. The app can be installed as a PWA via `manifest.json`; no service worker is currently registered.

## Components

### Browser

- Loads one of the HTML pages: `index.html`, `learn.html`, `challenge.html`, `profile.html`, `leaderboard.html`, or `settings.html`.
- Scripts are loaded as classic `<script defer>` tags, not ES modules.
- All shared code is attached to the global `window.CA` namespace.

### Pages

- Each HTML page loads `src/global.js`, `src/storage-proxy.js`, the services it needs, relevant components, and a page boot script from `src/pages/*.js`.
- There is no client-side router; navigation uses normal `<a href="...html">` links.

### Runtime modules

- `src/global.js` — creates `window.CA` namespaces.
- `src/storage-proxy.js` — `db` service backed by `localStorage` (HTTP/HTTPS) or `window.name` (`file://`).
- `src/services/store.js` — reactive state container.
- `src/services/gamify.js` — XP/level, streaks, badges, daily challenges.
- `src/services/progress.js` — starts, completes, and resets challenges.
- `src/modules/manifests.js` — global `window.CA.CHALLENGE_MANIFESTS` array.
- `src/modules/registry.js` — flat lookup over `CHALLENGE_MANIFESTS`.

### UI layer

- `src/components/` — self-registering Web Components.
- `src/styles/` — CSS layers: tokens, base, components, animations, utilities.
- All UI is styled with reusable external classes; dynamic values are passed via CSS custom properties.
- The layout is mobile-first and responsive, scaling from single-column grids on narrow viewports to multi-column grids on larger screens.

### Lab engine

- `src/labs/lab-runner.js` — `LabRunner` class. Mounts a lab either:
  - inside a sandboxed `srcdoc` `<iframe>` when served over HTTP/HTTPS, or
  - directly into a Shadow DOM host on `file://` (or `about:` contexts such as `about:srcdoc`) to avoid local-resource restrictions.
- `src/labs/sandbox-runtime.js` — runs inside the iframe, loads the requested lab from `window.CA.labs`, and relays `postMessage` events.
- Labs are plain classic scripts that register themselves on `window.CA.labs[key]`.
- The `general/welcome` lab is the beginner tutorial: it displays a boot log with a hidden flag and asks the player to submit it.

### Content modules

- `src/modules/<domain>/<challenge>/`
  - `lab.js` — classic script that calls `window.CA.labs[key] = { mount(container, hooks) { ... } }`.
- `src/modules/manifests.js` — central manifest registry.
- `src/modules/registry.js` — lookup helpers.

## Data flow

1. Page loads `global.js`, `storage-proxy.js`, services, manifests, registry, components, and page boot script.
2. Page boot script loads profile/progress/badges/settings from `db`.
3. Components subscribe to `Store` and call `progress`/`gamify` services to mutate state.
4. `db` serializes the shared object to `localStorage` or `window.name`.
5. Other pages load the same data from storage on startup.

## State management

- `Store` holds reactive JSON state.
- Components subscribe for updates and re-render.
- `db` (via `src/storage-proxy.js`) is the source of truth.
- Writes go through `db`, then `Store`.

## Storage

- HTTP/HTTPS deployments use `localStorage` key `CA::data`.
- `file://` pages use `window.name` with `CA::` prefix because every `file:` URL is a separate origin.
- Stores: `profiles`, `progress`, `badges`, `settings`.
- See `DATABASE.md` for schemas.

## Security model

- No user authentication. Local profile only.
- No backend network requests for core functionality.
- Labs are untrusted. On HTTP/HTTPS they run in `srcdoc` iframes with `sandbox="allow-scripts"` and no `allow-same-origin`.
- On `file://` labs run in a Shadow DOM host inside the parent page; they cannot make network requests and only communicate through the `hooks` object passed to `mount`.
- User payloads are never `eval`-ed. Labs implement deterministic checkers.
