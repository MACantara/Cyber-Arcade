# CONTRIBUTING.md — Cyber-Arcade

## Getting started

1. Clone the repo.
2. Open `index.html` directly from the filesystem, or serve the root with a static HTTP server:
   ```powershell
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` or `file:///path/to/index.html`.

## Workflow

- Create a branch for your feature.
- Follow `STYLEGUIDE.md`.
- Add a new challenge by editing `src/modules/manifests.js` and creating `src/modules/<domain>/<id>/lab.js`.
- Update `llms.txt` if you add documentation.

## Testing

- Manual browser test for every change.
- Verify state persists after reload.
- Test both `file://` and `http://localhost:8000`.
- Run Lighthouse.
- Run `grep` for `eval`, `new Function`, and `document.write`.

## Commit style

- Use concise commit messages.
- Example: `feat: add SQL injection challenge`.
- No secrets in commits.
