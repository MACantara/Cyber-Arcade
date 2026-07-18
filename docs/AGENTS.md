# AGENTS.md — Cyber-Arcade

## Project type
Full-stack learning platform. The frontend is a React 18 + TypeScript 5 + Vite 6 + Tailwind CSS v4 SPA. The backend is a stateless FastAPI service. All user data (profile, progress, badges, settings) is persisted in the browser via IndexedDB (`idb`).

## Quick start

1. Start the backend:
   ```powershell
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --host 0.0.0.0 --port 80
   ```
2. Start the frontend:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173`.
4. Verify in DevTools:
   - **Application > Storage > IndexedDB** — `CA` database with `profiles`, `progress`, `badges`, `settings`, and `logs` stores.
   - **Network** — calls to `/api/challenges`, `/api/domains`, `/api/daily` hit the FastAPI backend.

## File layout
```
vercel.json                 Vercel Services routing
frontend/
  package.json              React/TypeScript/Vite/Tailwind deps
  tsconfig.json
  vite.config.ts
  index.html
  src/
    main.tsx                React entry with router & query client
    App.tsx                 Route definitions
    pages/                  Route-level pages: Dashboard, Learn, Challenge, Profile, Leaderboard, Settings
    components/             React components: Layout, Nav, HudBar, ChallengeCard, LabFrame, Loading
    services/               api.ts, db.ts, gamify.ts, progress.ts, store.ts
    config/domains.ts       Shared DOMAINS array
    types.ts                TypeScript interfaces
    index.css               Tailwind CSS v4 CSS-first theme
  public/                   Static assets: manifest.json, icon, legacy lab assets
backend/
  app/main.py               FastAPI app
  app/models.py             Pydantic models
  app/services/validator.py Challenge manifest validator
  app/data/challenges.json  Extracted challenge manifests
  app/data/domains.json     Extracted domain config
  Dockerfile.vercel         Uvicorn container
  requirements.txt
docu/                       Documentation (README/ARCHITECTURE/DESIGN/TESTING etc.)
docker-compose.yml          Local orchestration
```

## Conventions

### TypeScript / React
- React functional components with hooks.
- Use ES modules and named imports/exports.
- Prefer `const`/`let`, `async/await`, and strict typing.
- Do not use `eval`, `new Function(...)`, `document.write`, or `innerHTML` with user data.
- Use `useStore` (built on `useSyncExternalStore`) to subscribe to the global store.
- Use TanStack Query (`useChallenges`) for backend state.
- Keep services in `frontend/src/services/`. Import from there, not `window.CA`.

### CSS (Tailwind CSS v4)
- Tailwind CSS v4 is configured via CSS-first syntax in `frontend/src/index.css` (`@import "tailwindcss"`, `@theme`, `@source`).
- Prefer Tailwind utility classes; use custom theme variables (`--color-*`, `--font-*`, etc.) for the retro arcade palette.
- Dynamic domain colors can be passed via CSS custom properties (e.g. `--domain-color`).
- Mobile-first responsive design using Tailwind breakpoints.
- Respect `prefers-reduced-motion` via the `reducedMotion` user setting and Tailwind `motion-safe`/`motion-reduce` modifiers.

### Icons
- Use `lucide-react` SVG components directly in JSX (`import { Trophy, Flame, Zap } from 'lucide-react'`).
- Do not use generic emoji for UI icons.

### HTML
- The single-page app entry is `frontend/index.html`.
- Use semantic HTML5 elements inside React components.
- Navigation is handled by `react-router-dom` with route paths `/`, `/learn`, `/challenge/:id`, `/profile`, `/leaderboard`, `/settings`.

### Security
- Treat user input as untrusted.
- Labs run in sandboxed `srcdoc` iframes on HTTP/HTTPS with `sandbox="allow-scripts"` and no `allow-same-origin`.
- On `file://` labs are mounted directly into a Shadow DOM host; they must not use `window.parent`/`window.top`.
- No `eval` or `Function` for user payloads.
- Never commit secrets or keys.

### Testing
- Manual browser verification is the primary test.
- Run `npm run build` to type-check and bundle the React app.
- Run `python -m py_compile backend/app/main.py` to validate Python syntax.
- Use DevTools console for runtime errors.
- Lighthouse targets: >=90 in Performance, Accessibility, Best Practices.

## Lab module API

A `lab.js` file is a classic script wrapped in an IIFE. It must register on `window.CA.labs`:

```js
(function () {
  window.CA = window.CA || {}
  window.CA.labs = window.CA.labs || {}
  window.CA.labs['general/welcome'] = {
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

When building lab UIs, prefer the shared lab classes in `src/styles/components.css` (`.lab-body`, `.lab-title`, `.lab-label`, `.lab-input`, `.lab-btn`, `.lab-output`, `.lab-status`, `.lab-sr-only`). Add a scoped `<style>` block only when custom styles are required, and scope it to a `.lab` wrapper inside the container.

A challenge is registered by adding its manifest object to `window.CA.CHALLENGE_MANIFESTS` in `src/modules/manifests.js`.

## Agent workflow
- Read `docu/DESIGN.md`, `docu/ARCHITECTURE.md`, and `docu/STYLEGUIDE.md` before writing code.
- To add a new domain, add it to `backend/app/data/domains.json` and `frontend/src/config/domains.ts`.
- To add a lab, create `src/modules/<domain>/<challenge>/lab.js` (inside `frontend/public/legacy/` after building) and add a manifest object to `backend/app/data/challenges.json`.
- Run `python -m py_compile backend/app/main.py` after backend edits.
- Run `npm run build` after frontend edits.
- Update `docu/llms.txt` if you add or move documentation.
