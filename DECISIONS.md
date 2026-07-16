# DECISIONS.md — Cyber-Arcade

## ADR-1: No backend

**Context:** The project must be deployable as a static site.

**Decision:** Use no backend. IndexedDB stores all user data locally.

**Consequences:**
- Pros: zero hosting cost, no auth, no server maintenance.
- Cons: no cloud sync, no real-time multiplayer, no admin analytics.

## ADR-2: No build step

**Context:** The goal is to push modern HTML/CSS/JS without bundlers.

**Decision:** Serve ES modules directly. No webpack, no vite, no transpiler.

**Consequences:**
- Pros: fast dev cycle, easy to inspect, no build configuration.
- Cons: older browser support is limited; must use a local HTTP server for development.

## ADR-3: Web Components for UI

**Context:** We want reusable UI without a framework.

**Decision:** Use native custom elements.

**Consequences:**
- Pros: standard API, framework-agnostic, shadow-DOM optional.
- Cons: more boilerplate than React/Vue.

## ADR-4: Sandbox labs with `srcdoc` iframes

**Context:** Labs must simulate vulnerable environments without exposing the parent page.

**Decision:** Use `srcdoc` iframes with `sandbox="allow-scripts"` and no `allow-same-origin`.

**Consequences:**
- Pros: user scripts cannot access parent or local storage.
- Cons: labs must communicate via `postMessage` and cannot use real network calls.
