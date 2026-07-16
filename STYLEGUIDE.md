# STYLEGUIDE.md — Cyber-Arcade

## Naming

- Files: kebab-case (e.g., `lab-runner.js`, `hud-bar.js`).
- Components: kebab-case in HTML, `X` prefix in JS (e.g., `hud-bar.js` exports `XHudBar`).
- Custom element names: `x-<kebab>` (e.g., `<x-hud-bar>`).
- JavaScript classes: `PascalCase` (e.g., `class LabRunner`).
- Constants: `UPPER_SNAKE_CASE` for module-level constants.
- CSS custom properties: `--<category>-<name>` (e.g., `--color-primary`).

## Formatting

- Use 2 spaces for indentation.
- Use single quotes for strings.
- No trailing semicolons required, but be consistent within a file.
- Keep lines under 100 characters when reasonable.
- Use `async/await` instead of `.then()` chains.

## JavaScript conventions

- Classic scripts wrapped in IIFEs. No ES modules, no `import`/`export`, no `require`.
- Shared code is attached to `window.CA`:
  - `window.CA.services` — store, gamify, progress, db
  - `window.CA.labs` — lab controllers
  - `window.CA.CHALLENGE_MANIFESTS` — challenge metadata
  - `window.CA.LabRunner` — lab runner class
- Private class fields (`#field`) for internal state.
- Use `AbortController` for fetch/listener cleanup.
- Prefer `const`; use `let` only when reassigned.
- Avoid `var`.
- Do not use `eval`, `new Function(...)`, or `document.write`.

## CSS conventions

- CSS is organized in layers: `@layer base, components, utilities, animations`.
- Design tokens live in `src/styles/tokens.css`.
- Component styles may be in `src/styles/components.css` or scoped within a component/lab.
- Use custom properties for all colors, spacing, and font weights.
- Always set `font-weight` when using `Press Start 2P` or `VT323` (both are single-weight fonts). Use `--font-weight-headline` and `--font-weight-terminal`.
- Use `--font-weight-body` for body text, `--font-weight-body-strong` for emphasized labels, and `--font-weight-bold` for `b`/`strong` in `Inter`.
- Maintain strong contrast: near-white text (`#f7f8fa`) on deep space background (`#070914`), with lightened grays (`#e4e8ef`, `#a2abc0`) for secondary text.
- Body text uses `--text-base` (1rem / 16px); the type scale ranges from `--text-xs` (0.75rem) to `--text-3xl` (3.25rem).
- Cards use a fixed size range (`min-height: 260px`, `max-height: 320px`) and clamp the description to three lines so the grid stays uniform.
- Respect `prefers-reduced-motion`.

## HTML conventions

- Semantic tags where possible.
- Custom elements are self-registering in their own modules.
- No inline event handlers. Attach listeners in JS.
- `data-*` attributes for component state hooks in HTML.
- Navigation uses normal relative `<a href="...html">` links.

## Testing conventions

- Manual browser test for each page and challenge.
- Verify shared state after every action.
- Run Lighthouse before considering a feature complete.
