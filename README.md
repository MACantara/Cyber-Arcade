# Cyber-Arcade

A full-stack, gamified cyber-security learning platform. The frontend is a React + TypeScript + Tailwind CSS v4 SPA built with Vite, and the backend is a stateless FastAPI service that serves challenge manifests and the daily challenge. Client-side persistence uses IndexedDB via `idb`.

## Quick start

Start the backend:

```powershell
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 80
```

Start the frontend dev server:

```powershell
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173`.

## What is this?

Cyber-Arcade turns cyber-security topics into retro arcade mini-games:
- Web application security
- Network and system security
- Cryptography and binary basics
- General beginner concepts

Earn XP, unlock badges, keep a streak, and view a local leaderboard.

## Tech stack

- **Frontend:** React 18, TypeScript 5, Vite 6, React Router 7, Tailwind CSS v4, TanStack Query, Lucide React, idb
- **Backend:** Python 3.12+, FastAPI, Pydantic, Uvicorn
- **Persistence:** IndexedDB for profile, progress, badges, and settings
- **Deployment:** Vercel Services with container images (`frontend/` nginx, `backend/` uvicorn)

## Project docs

Documentation lives in `docu/`:

- `docu/AGENTS.md` — agent conventions and quick start
- `docu/DESIGN.md` — design system (tokens, colors, typography, components, responsive)
- `docu/ARCHITECTURE.md` — system architecture
- `docu/TESTING.md` — testing checklist
- `docu/STYLEGUIDE.md` — coding conventions
- `docu/SECURITY.md` — threat model and mitigations
- `docu/DATABASE.md` — storage schema
- `docu/ROADMAP.md` — planned features and potential new modules
- `docu/llms.txt` — repository index for LLMs

## Deployment

`vercel.json` at the repo root configures Vercel Services with two containerized services:

- `frontend/` built as an nginx container
- `backend/` built as a uvicorn FastAPI container
- `/api/*` requests are routed to the backend

You can also run locally with Docker Compose:

```powershell
docker compose up --build
```

Then open `http://localhost:3000`.

## License

MIT