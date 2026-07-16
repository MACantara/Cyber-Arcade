# AGENTS.md — Cyber-Arcade

## Project type
Static, multi-page website. No backend. No frameworks. Vanilla classic scripts, Web Components, shared local storage, modern HTML/CSS/JS.

## Quick start

1. Open the repository root as a static site. It works from `file://` or any HTTP server.
2. Open `index.html` for the dashboard, `learn.html` for the challenge list, or `challenge.html?id=<id>` for a challenge.
3. Verify in DevTools:
   - **Application > Storage > Local Storage** (on HTTP/HTTPS) or check `window.name` on `file://`.
   - **Lighthouse** — PWA / a11y / performance audits.
4. If serving over HTTP, you can run `python -m http.server 8000`.

## Build / deploy
- There is no build step. The site is static.
- Deploy the repo root to GitHub Pages, Netlify, Vercel, or any CDN.
- `vercel.json` at the root forces Vercel to serve the root directory.
- Verify `index.html`, `manifest.json` are at the root.

## File layout
```
index.html          App shell / dashboard
learn.html          Challenge list
challenge.html      Active challenge
profile.html        User profile
leaderboard.html    Local leaderboard
settings.html       Settings
manifest.json       PWA manifest
vercel.json         Vercel static config
src/
  global.js         Global window.CA namespace
  storage-proxy.js  localStorage / window.name storage service
  services/
    store.js        Reactive state store
    progress.js     Progress / persistence helpers
    gamify.js       XP, levels, streaks, badges
  components/       Web Components (vanilla custom elements)
  styles/           CSS architecture
  labs/             Lab runner and sandbox runtime
  modules/          Domain modules
    manifests.js    Central challenge manifest registry
    registry.js     Challenge lookup helpers
    web/
    network/
    crypto/
    general/
      <challenge>/
        lab.js
  pages/            Per-page boot scripts
public/             Static assets
```

## Conventions

### JavaScript
- Classic scripts only. No ES modules. No `import`/`export`.
- Wrap every `.js` file in an IIFE to prevent global redeclaration errors.
- Prefer `const`/`let`, `async/await`, private class fields, optional chaining.
- Do not use `eval`, `new Function(...)`, `document.write`, or `innerHTML` with user data.
- Use `DOMPurify` if we ever need to parse HTML; currently the design avoids raw HTML insertion.
- All components extend `HTMLElement` and use `connectedCallback`/`disconnectedCallback`.
- Event listeners should be removed on disconnect.
- Use `AbortController` for cancellable async work.
- Shared code lives on `window.CA`:
  - `window.CA.services` — store, gamify, progress, db
  - `window.CA.CHALLENGE_MANIFESTS` — challenge definitions
  - `window.CA.labs` — lab controllers
  - `window.CA.LabRunner` — lab runner class

### CSS
- Use `src/styles/tokens.css` for design tokens.
- Use `@layer` for base, components, utilities, animations.
- Prefer `rem`/`px` where the 8-bit pixel grid calls for pixels.
- Use `container-queries` for responsive components.
- Use `view-transition-name` for page transitions.
- Respect `prefers-reduced-motion`.

### Icons
- Use Lucide icons from the CDN (`<script src="https://unpkg.com/lucide@latest"></script>`) loaded on every HTML page.
- Markup: `<i data-lucide="icon-name" aria-hidden="true"></i>`.
- Call `window.lucide?.createIcons()` after a component injects new icon elements.
- Use the `.lucide` and `.lucide-{name}` CSS classes for custom fills/sizing; prefer `currentColor` so icons inherit text color.
- Do not use generic emoji for UI icons.

### HTML
- Semantic HTML5 elements.
- Use `<dialog>` for modals, `<details>` for disclosure, `<template>` for component templates.
- Each page is a separate HTML file. Navigation uses relative `.html` links.

### Security
- Treat user input as untrusted.
- Labs run in sandboxed `srcdoc` iframes on HTTP/HTTPS with `sandbox="allow-scripts"` and no `allow-same-origin`.
- On `file://` labs are mounted directly into a Shadow DOM host; they must not use `window.parent`/`window.top`.
- No `eval` or `Function` for user payloads.
- Never commit secrets or keys.

### Testing
- Manual browser verification is the primary test.
- Run `node --check` on relevant JS files.
- Run `npm run lint` if a `package.json` is added; otherwise use DevTools console.
- Lighthouse should score >=90 in PWA, Accessibility, Best Practices, Performance.

## Lab module API

A `lab.js` file is a classic script wrapped in an IIFE. It must register on `window.CA.labs`:

```js
(function () {
  window.CA = window.CA || {}
  window.CA.labs = window.CA.labs || {}
  window.CA.labs['general/my-lab'] = {
    mount(container, hooks) {
      // Build UI inside container (a DOM element in the lab frame).
      // hooks.onComplete({ score: 100, flag: 'FLAG{...}', message: '...' }) when solved.
      // hooks.onFail({ message: '...' }) on wrong attempt.
      // hooks.onHint(text) for optional hints.
      // Return { submit(payload) { ... } } if the parent can submit a payload.
    }
  }
})()
```

Do not use `eval`, `new Function`, `document.write`, or `innerHTML` with user input. Use `textContent` and `createElement`.

A challenge is registered by adding its manifest object to `window.CA.CHALLENGE_MANIFESTS` in `src/modules/manifests.js`.

## Agent workflow
- Read `DESIGN.md` and `ARCHITECTURE.md` before writing code.
- Add a lab by creating `src/modules/<domain>/<challenge>/lab.js` and adding the manifest to `src/modules/manifests.js`.
- Keep modules self-contained.
- Update `llms.txt` if you add or move documentation.
