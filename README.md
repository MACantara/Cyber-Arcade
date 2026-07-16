# Cyber-Arcade

A static, gamified cyber-security learning platform that runs in the browser with no backend. It works when opened directly from `file://` or when served over HTTP/HTTPS.

## Quick start

Open any page directly from the filesystem:

- `index.html` — dashboard
- `learn.html` — challenge list
- `challenge.html?id=<challenge-id>` — a challenge
- `profile.html`, `leaderboard.html`, `settings.html`

Or serve the root with any static HTTP server:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## What is this?

Cyber-Arcade turns cyber-security topics into retro arcade mini-games:
- Web application security
- Network and system security
- Cryptography and binary basics
- General beginner concepts

Earn XP, unlock badges, keep a streak, and view a local leaderboard.

## Tech stack

- HTML5, CSS3, vanilla JavaScript (classic scripts, no build step)
- Web Components (native custom elements)
- Shared state through `window.name` for `file://` and `localStorage` for HTTP/HTTPS deployments
- PWA manifest (service worker not currently registered)

## Project docs

- `AGENTS.md` — agent conventions and quick start
- `DESIGN.md` — design system (tokens, colors, typography, components, responsive)
- `ARCHITECTURE.md` — system architecture
- `TESTING.md` — testing checklist
- `STYLEGUIDE.md` — coding conventions
- `SECURITY.md` — threat model and mitigations
- `DATABASE.md` — storage schema
- `ROADMAP.md` — planned features and potential new modules
- `llms.txt` — repository index for LLMs

## Deployment

`vercel.json` at the repo root configures Vercel to serve the project directory as a static site. Push to a Vercel-connected repo or run `vercel --prod` from the project root.

## License

MIT