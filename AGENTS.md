# AGENTS.md — Cyber-Arcade

## Project type
Static, single-page PWA. No backend. No frameworks. Vanilla ES modules, Web Components, IndexedDB, modern HTML/CSS/JS.

## Quick start

1. Serve the repository root with the included dev server — **do not open `file://` URLs** because ES modules require CORS.
   ```powershell
   python server.py
   ```
   `python -m http.server` does not add CORS headers, so the sandboxed lab iframe cannot load modules.
2. Open `http://localhost:8000`.
3. Verify in DevTools:
   - **Application > Service Workers** — `sw.js` registered.
   - **Application > Storage > IndexedDB** — `cyber-arcade` DB exists.
   - **Lighthouse** — PWA / a11y / performance audits.

## Build / deploy
- There is no build step. The site is static.
- Deploy the repo root to GitHub Pages, Netlify, or any CDN.
- Verify `index.html`, `manifest.json`, and `src/sw.js` are at the root.

## File layout
```
index.html          App shell
manifest.json       PWA manifest
src/
  main.js           Entry point
  app.js            App orchestrator
  router.js         Client-side router
  services/
    db.js           IndexedDB wrapper
    store.js        Reactive state store
    progress.js     Progress / persistence helpers
    gamify.js       XP, levels, streaks, badges
  components/       Web Components (vanilla custom elements)
  styles/           CSS architecture
  labs/             Lab runner and protocols
  modules/          Domain modules
    web/
    network/
    crypto/
    general/
      <challenge>/
        manifest.json
        lab.js
public/             Static assets
```

## Conventions

### JavaScript
- ES modules only. No build tools. No frameworks.
- Prefer `const`/`let`, `async/await`, private class fields, optional chaining.
- Do not use `eval`, `new Function(...)`, `document.write`, or `innerHTML` with user data.
- Use `DOMPurify` if we ever need to parse HTML; currently the design avoids raw HTML insertion.
- All components extend `HTMLElement` and use `connectedCallback`/`disconnectedCallback`.
- Event listeners should be removed on disconnect.
- Use `AbortController` for cancellable async work.

### CSS
- Use `src/styles/tokens.css` for design tokens.
- Use `@layer` for base, components, utilities, animations.
- Prefer `rem`/`px` where the 8-bit pixel grid calls for pixels.
- Use `container-queries` for responsive components.
- Use `view-transition-name` for page transitions.
- Respect `prefers-reduced-motion`.

### HTML
- Semantic HTML5 elements.
- Use `<dialog>` for modals, `<details>` for disclosure, `<template>` for component templates.
- `index.html` is the only shell; all other content is rendered by JS.

### Security
- Treat user input as untrusted.
- Labs run in sandboxed `srcdoc` iframes with `sandbox="allow-scripts"` and no `allow-same-origin`.
- No `eval` or `Function` for user payloads.
- Strict CSP via `index.html` meta tag.
- Never commit secrets or keys.

### Testing
- Manual browser verification is the primary test.
- Run `npm run lint` if a `package.json` is added; otherwise use DevTools console.
- Lighthouse should score >=90 in PWA, Accessibility, Best Practices, Performance.

## Lab module API

A `lab.js` file is loaded by the sandboxed iframe (`src/labs/sandbox-runtime.js`). It must default-export an object with:

```js
export default {
  mount(container, hooks) {
    // Build UI inside container (a DOM element in the sandbox iframe).
    // hooks.onComplete({ score: 100, flag: 'FLAG{...}', message: '...' }) when solved.
    // hooks.onFail({ message: '...' }) on wrong attempt.
    // hooks.onHint(text) to send a hint request to the parent.
    // Optionally return { submit(payload) { ... } } if the parent can submit a payload.
  }
}
```

Do not use `eval`, `new Function`, `document.write`, or `innerHTML` with user input. Use `textContent` and `createElement`.

A `manifest.js` must default-export an object with: `id`, `title`, `domain`, `difficulty`, `description`, `xp`, `objective`, `hints`, `successCriteria`.

## Agent workflow
- Read `DESIGN.md` and `ARCHITECTURE.md` before writing code.
- Add a module by creating `src/modules/<domain>/<challenge>/manifest.json` and `lab.js`.
- Register the challenge in `src/modules/<domain>/index.js` using JSON imports with `assert { type: 'json' }`.
- Keep modules self-contained.
- Update `llms.txt` if you add or move documentation.
