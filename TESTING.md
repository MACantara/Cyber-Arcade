# TESTING.md — Cyber-Arcade

## Philosophy

Because there is no backend, testing is primarily browser-based. The codebase should remain small enough to verify manually with DevTools and Lighthouse.

## Manual verification

1. Start a local static server:
   ```powershell
   python -m http.server 8000
   ```
2. Open `http://localhost:8000` in Chrome or Edge.
3. Check the console for errors.
4. Verify service worker registration in **Application > Service Workers**.
5. Verify IndexedDB `cyber-arcade` stores in **Application > Storage**.
6. Complete each challenge and verify progress persists after reload.
7. Test offline by stopping the server and refreshing the page.
8. Test responsive layouts at 320px, 768px, 1024px.

## Automated checks

- `npm run lint` if `package.json` is present.
- `grep -R "eval\|new Function\|document.write" src/` should return nothing.
- `grep -R "innerHTML" src/` should only show static/sanitized uses.
- Lighthouse targets:
  - Performance >= 90
  - Accessibility >= 90
  - Best Practices >= 90
  - PWA pass

## Cross-browser

- Latest Chrome / Edge / Firefox.
- Safari is supported where modern IndexedDB features work.
- Mobile browsers via responsive mode.

## Regression checklist

- [ ] Dashboard loads and shows XP, level, streak.
- [ ] Navigation works with browser back/forward.
- [ ] A challenge can be started, completed, and replayed.
- [ ] Hints deduct XP appropriately.
- [ ] Badges appear after earning.
- [ ] Theme toggle works.
- [ ] Offline reload shows cached app.
