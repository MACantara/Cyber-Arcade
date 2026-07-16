# DECISIONS.md — Cyber-Arcade

## ADR-1: No backend

**Context:** The project must be deployable as a static site.

**Decision:** Use no backend. User data is stored locally.

**Consequences:**
- Pros: zero hosting cost, no auth, no server maintenance.
- Cons: no cloud sync, no real-time multiplayer, no admin analytics.

## ADR-2: No build step

**Context:** The goal is to push modern HTML/CSS/JS without bundlers.

**Decision:** Serve classic scripts directly. No webpack, no Vite, no transpiler.

**Consequences:**
- Pros: fast dev cycle, easy to inspect, no build configuration.
- Cons: older browser support is limited; must avoid ES module features.

## ADR-3: Web Components for UI

**Context:** We want reusable UI without a framework.

**Decision:** Use native custom elements.

**Consequences:**
- Pros: standard API, framework-agnostic, shadow-DOM optional.
- Cons: more boilerplate than React/Vue.

## ADR-4: Static multi-page site

**Context:** SPA client-side routing is unnecessary and cannot run from `file://`.

**Decision:** Use separate HTML pages and normal `<a href="...html">` navigation.

**Consequences:**
- Pros: works from `file://`, simpler routing, better SEO.
- Cons: each page loads scripts independently.

## ADR-5: Shared storage

**Context:** `file://` URLs are unique origins, so IndexedDB and `localStorage` cannot be shared across pages.

**Decision:** Use `localStorage` on HTTP/HTTPS and fall back to `window.name` on `file://`.

**Consequences:**
- Pros: state persists across pages on both protocols.
- Cons: `window.name` is per-tab and not persistent across tabs; `localStorage` does not sync across tabs unless `storage` events are used.

## ADR-6: Lab runtime

**Context:** Labs must simulate vulnerable environments without exposing the parent page, but `file://` iframes cannot load local subresources.

**Decision:** Use `srcdoc` iframes with `sandbox="allow-scripts"` on HTTP/HTTPS, and mount labs into a Shadow DOM host on `file://`.

**Consequences:**
- Pros: works under both deployment modes; user code cannot escape the provided `container`.
- Cons: labs run in the parent page on `file://`, so they must be trusted and must not access `window.parent`/`window.top`.
