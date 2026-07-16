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

- ES modules only. No `require`.
- Private class fields (`#field`) for internal state.
- Use `AbortController` for fetch/listener cleanup.
- Prefer `const`; use `let` only when reassigned.
- Avoid `var`.

## CSS conventions

- CSS is organized in layers: `@layer base, components, utilities, animations`.
- Design tokens live in `src/styles/tokens.css`.
- Component styles may be in `src/styles/components.css` or scoped within a component.
- Use custom properties for all colors and spacing.
- Respect `prefers-reduced-motion`.

## HTML conventions

- Semantic tags where possible.
- Custom elements are self-registering in their own modules.
- No inline event handlers. Attach listeners in JS.
- `data-*` attributes for component state hooks in HTML.

## Testing conventions

- Manual browser test for each challenge.
- Verify IndexedDB state after every action.
- Run Lighthouse before considering a feature complete.
