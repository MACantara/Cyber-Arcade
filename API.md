# API.md — Cyber-Arcade

Cyber-Arcade has no backend. This document describes the client-side API surface.

## Services

### `Database` (`src/services/db.js`)

- `open()` — open the IndexedDB connection.
- `get(store, key)` — get a record.
- `put(store, value)` — upsert a record.
- `delete(store, key)` — delete a record.
- `getAll(store)` — get all records.
- `transaction(store, mode)` — start a transaction.
- `exportProfile()` — return JSON string of profile/progress/badges/settings.
- `importProfile(json)` — load JSON into IndexedDB.

### `Store` (`src/services/store.js`)

- `get(path?)` — return state or a state slice.
- `set(path, value)` — update a slice.
- `subscribe(fn)` / `unsubscribe(fn)` — listen for changes.

### `Progress` (`src/services/progress.js`)

- `start(challengeId)` — mark a challenge as started.
- `complete(challengeId, score, hintsUsed)` — mark completed and award XP.
- `get(challengeId)` — return progress record.
- `isUnlocked(challengeId)` — check prerequisites.

### `Gamify` (`src/services/gamify.js`)

- `addXp(amount)` — add XP and recalculate level.
- `getLevel(xp)` — return level for an XP value.
- `checkStreak()` — update streak.
- `awardBadge(badgeId)` — grant a badge.
- `getDailyChallenge()` — pick or return today's daily challenge.

### `LabRunner` (`src/labs/lab-runner.js`)

- `register(challenge, factory)` — register a challenge lab.
- `mount(challengeId, container, hooks)` — mount a lab.
- `submit(payload)` — submit a payload for checking.
- `hint()` — request a hint.

## Router

- `Router` dispatches `route-change` events with `detail.path` and `detail.params`.
- Use `router.navigate(path)` to change URL.

## Events

- `route-change` — fired on `window` when the route changes.
- `state-change` — fired on `Store` instances.
- `challenge-complete` — fired on a lab frame when a challenge is completed.
