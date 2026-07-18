# MEMORY.md — Cyber-Arcade

## Recurring decisions

- **No backend.** All data is local. This keeps hosting simple and removes auth complexity.
- **No build step.** Classic scripts and static HTML load directly from `src/`.
- **Static multi-page site.** Each major view has its own HTML file and navigation uses relative links.
- **Web Components.** Native custom elements are used for the UI. No framework needed.
- **Shared state.** `localStorage` on HTTP/HTTPS; `window.name` on `file://` because each file URL is a separate origin.
- **Labs.** Sandboxed `srcdoc` iframe when served; direct Shadow DOM mount when opened from `file://`.

## Common pitfalls

- Do not use ES modules or `import`/`export` in `src/`.
- Do not open `file://` labs in `srcdoc` iframes — browsers block local subresources.
- `innerHTML` is dangerous. Use `document.createElement` or `textContent` for dynamic content.
- `postMessage` must always validate `event.origin` and `event.source`.
- Lab styles must be scoped to the wrapper; `body`/`vh` selectors do not work inside a shadow host or iframe.
- Service workers do not work on `file://` and are not currently registered.

## Unresolved issues

- Real-time multiplayer / leaderboard is not supported without a backend.
- Cloud sync / backup is manual via export/import JSON.
- Safari private mode may limit `localStorage` persistence.
- Data is shared per tab on `file://` via `window.name`; it does not persist across tabs.
