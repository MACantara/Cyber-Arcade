# CONTRIBUTING.md — Cyber-Arcade

## Getting started

1. Clone the repo.
2. Serve the root with a static HTTP server:
   ```powershell
   python -m http.server 8000
   ```
3. Open `http://localhost:8000`.

## Workflow

- Create a branch for your feature.
- Follow `STYLEGUIDE.md`.
- Add a new challenge by creating `src/modules/<domain>/<id>/manifest.json` and `lab.js`.
- Register the challenge in `src/modules/<domain>/index.js`.
- Update `llms.txt` if you add documentation.

## Testing

- Manual browser test for every change.
- Verify IndexedDB persistence after reload.
- Run Lighthouse.
- Run `grep` for `eval` and `document.write`.

## Commit style

- Use concise commit messages.
- Example: `feat: add SQL injection challenge`.
- No secrets in commits.
