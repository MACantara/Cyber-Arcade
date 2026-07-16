# MEMORY.md — Cyber-Arcade

## Recurring decisions

- **No backend.** All data is local. This keeps hosting simple and removes auth complexity.
- **No build step.** ES modules load directly from `src/`. This makes the stack easy to understand and deploy.
- **Web Components.** Native custom elements are used for the UI. No framework needed.
- **IndexedDB.** The source of truth for profile, progress, badges, and settings.
- **Sandboxed labs.** Labs use `srcdoc` iframes with `sandbox` to prevent user code from escaping.

## Common pitfalls

- Do not open the site from `file://`. ES modules require a local HTTP server.
- `innerHTML` is dangerous. Use `document.createElement` or `textContent` for dynamic content.
- `postMessage` must always validate `event.origin` and `event.source`.
- Service workers only work over HTTPS or `localhost`.
- IndexedDB operations are async. Always `await` them before rendering.

## Unresolved issues

- Real-time multiplayer / leaderboard is not supported without a backend.
- Cloud sync / backup is manual via export/import JSON.
- Safari private mode may limit IndexedDB persistence.
