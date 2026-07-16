# PROMPTS.md — Cyber-Arcade

## Reusable agent prompts

### Add a new challenge

Create a new challenge under `src/modules/<domain>/<challenge-id>/`.

Requirements:
- Add the manifest object to `src/modules/manifests.js` with `id`, `title`, `domain`, `difficulty`, `description`, `xp`, `objective`, `hints`, `successCriteria`.
- Create `lab.js` as a classic script wrapped in an IIFE that registers `window.CA.labs['<domain>/<challenge-id>'] = { mount(container, hooks) { ... } }`.
  - `hooks.onComplete({ score, flag, message })` when solved.
  - `hooks.onFail({ message })` on wrong attempt.
  - `hooks.onHint(text)` for optional hints.
  - Optionally return `{ submit(payload) { ... } }` if the parent can submit a payload.
- Do not use `eval` or `new Function`.
- Scope styles to the lab wrapper, use design-token variables, and avoid `body`/`vh`.
- Follow the 8-bit arcade design in `DESIGN.md`.
- Update `llms.txt` if you add documentation.

### Add a new UI component

Create `src/components/<name>.js`.

- Wrap the file in an IIFE.
- Extend `HTMLElement`.
- Use `connectedCallback` and `disconnectedCallback`.
- Subscribe to `Store` and unsubscribe on disconnect.
- Use CSS custom properties from `src/styles/tokens.css`.
- Register the component with `customElements.define('x-<name>', X<Name>)`.
- Attach shared helpers to `window.CA` if needed.

### Update storage schema

Edit `src/storage-proxy.js`.

- Update `getStore`/`recordKey` logic if needed.
- Update `DATABASE.md`.

### Security audit

Search `src/` for:
- `eval`, `new Function`, `document.write`.
- `innerHTML` assignments.
- Lab references to `window.parent` or `window.top`.
- Missing `sandbox` on `iframe` (HTTP/HTTPS mode).
- Missing `event.origin`/`event.source` validation in `message` handlers.

Report findings and fix them.
