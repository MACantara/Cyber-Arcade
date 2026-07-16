# PROMPTS.md — Cyber-Arcade

## Reusable agent prompts

### Add a new challenge

Create a new challenge under `src/modules/<domain>/<challenge-id>/`.

Requirements:
- `manifest.js` default-exporting an object with `id`, `title`, `domain`, `difficulty`, `description`, `xp`, `prerequisites`, `hints`, `successCriteria`.
- `lab.js` exporting a `default` factory function that returns an object with:
  - `mount(container, session, hooks) -> Promise`
  - `check(payload, session) -> { success: boolean, score: number, message: string }`
  - `hint(index) -> string | null`
- Register the challenge in `src/modules/<domain>/index.js`.
- Do not use `eval` or `new Function`.
- Follow the 8-bit arcade design in `DESIGN.md`.
- Use the `LabRunner` protocol in `src/labs/protocol.js`.

### Add a new UI component

Create `src/components/<name>.js`.

- Extend `HTMLElement`.
- Use `connectedCallback` and `disconnectedCallback`.
- Subscribe to `Store` and unsubscribe on disconnect.
- Use CSS custom properties from `src/styles/tokens.css`.
- Register the component with `customElements.define('x-<name>', X<Name>)`.

### Update IndexedDB schema

Edit `src/services/db.js`.

- Bump `DB_VERSION`.
- Add new object stores in `onupgradeneeded`.
- Add a migration function that preserves existing data.
- Update `DATABASE.md`.

### Security audit

Search `src/` for:
- `eval`, `new Function`, `document.write`.
- `innerHTML` assignments.
- Missing `sandbox` on `iframe`.
- Missing `event.origin` validation in `message` handlers.

Report findings and fix them.
