# TESTING.md — Cyber-Arcade

## Philosophy

Testing is primarily manual because the app is a static website with no backend. The codebase should remain small enough to verify with DevTools and Lighthouse.

## Manual verification

1. Open the repo root in a browser:
   - For `file://`: open `index.html` directly.
   - For HTTP: run `python -m http.server 8000` and open `http://localhost:8000`.
2. Open the browser console and watch for errors.
3. Check **Application > Storage > Local Storage** on HTTP/HTTPS, or verify `window.name` on `file://`.
4. Complete a challenge and reload the page to confirm progress persists.
5. Test navigation between pages using the in-app links.
6. Test a challenge page from `file://` (labs should render in the Shadow DOM).
7. Test responsive layouts at 320px, 640px, 768px, 1024px, and 1440px.

## Automated sanity checks

- `Get-ChildItem -Recurse -Path src -Filter *.js | ForEach-Object { node --check $_.FullName }` (or `node --check <file>` for each changed file).
- `grep -R "eval\|new Function\|document.write" src/` should return nothing.
- `grep -R "innerHTML" src/` should only show static/sanitized uses.
- `grep -R "setStyle" src/` should return nothing.
- Inline `style` attributes and `.style.*` assignments should only set CSS custom properties for dynamic values (e.g., `--width`).
- Lighthouse targets:
  - Performance >= 90
  - Accessibility >= 90
  - Best Practices >= 90
  - PWA pass

## Cross-browser

- Latest Chrome / Edge / Firefox.
- Safari is supported where modern storage APIs work.
- Mobile browsers via responsive mode.

## Regression checklist

- [ ] Dashboard loads and shows XP, level, streak.
- [ ] Navigation links work between HTML pages.
- [ ] A challenge can be started, completed, and replayed.
- [ ] Hints deduct XP appropriately.
- [ ] Badges appear after earning.
- [ ] Theme toggle works.
- [ ] Progress persists after reload.
- [ ] `file://` challenge pages load labs without "Not allowed to load local resource" errors.
