# TESTING.md — Cyber-Arcade

## Philosophy

Testing is a mix of automated build/type checks and manual verification. The frontend is a React SPA, the backend is a stateless FastAPI service, and user data is stored in IndexedDB.

## Manual verification

1. Start the backend and frontend (see `README.md`).
2. Open `http://localhost:5173` and watch the browser console for errors.
3. Check **Application > Storage > IndexedDB** for `CA` database and stores (`profiles`, `progress`, `badges`, `settings`, `logs`).
4. Complete a challenge and reload the page to confirm progress, XP, and badges persist.
5. Test SPA navigation: use the nav bar to switch routes, then refresh on `/learn`, `/profile`, `/leaderboard`, and `/settings`.
6. Test a challenge page and confirm the lab renders in the sandboxed iframe.
7. Test responsive layouts at 320px, 640px, 768px, 1024px, and 1440px.

## Automated sanity checks

- `npm run build` in `frontend` must pass TypeScript type-checking and Vite bundling.
- `python -m py_compile backend/app/main.py` and other changed `.py` files.
- `node tests/manifests.test.js` (or the Python validator in `backend/app/services/validator.py`) validates challenge manifests.
- ESLint/TSC warnings for `eval`, `new Function`, `document.write`, and unsafe `innerHTML` use should fail the build.
- Lighthouse targets:
  - Performance >= 90
  - Accessibility >= 90
  - Best Practices >= 90

## Cross-browser

- Latest Chrome / Edge / Firefox.
- Safari is supported where modern storage APIs work.
- Mobile browsers via responsive mode.

## Regression checklist

- [ ] Dashboard loads and shows XP, level, streak, and daily challenge.
- [ ] SPA navigation works and routes survive a hard refresh.
- [ ] A challenge can be started, completed, and replayed.
- [ ] Hints deduct XP appropriately.
- [ ] Badges appear after earning.
- [ ] Theme and reduced-motion toggles work.
- [ ] Progress persists after reload.
- [ ] Labs load in the sandboxed iframe and report `complete`/`fail`/`hint` messages.
