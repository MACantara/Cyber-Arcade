# API.md — Cyber-Arcade

Cyber-Arcade has no backend. This document describes the client-side API surface available on the global `window.CA` namespace.

## Services

### `db` (`src/storage-proxy.js`)

- `ready()` — resolves immediately.
- `open()` — resolves immediately.
- `get(store, key)` — get a record.
- `put(store, value)` — upsert a record.
- `delete(store, key)` — delete a record.
- `getAll(store)` — get all records.
- `clear(store)` — clear a store.
- `exportProfile()` — return a JSON string of profile/progress/badges/settings.
- `importProfile(json)` — load JSON into storage.

### `store` (`src/services/store.js`)

- `get(path?)` — return state or a state slice.
- `set(path, value)` — update a slice.
- `merge(path, value)` — shallow merge a slice.
- `subscribe(fn)` / `unsubscribe(fn)` — listen for changes.

### `progress` (`src/services/progress.js`)

- `startChallenge(challenge)` — mark a challenge as started.
- `completeChallenge(challenge, score, hintsUsed)` — mark completed and award XP.
- `useHint(challengeId)` — increment hint count.
- `loadProfile()`, `loadProgress()`, `loadBadges()`, `loadSettings()` — hydrate store from storage.
- `loadDaily()` / `getDaily()` — daily challenge helpers.

### `gamify` (`src/services/gamify.js`)

- `computeLevel(xp)` — return level for XP.
- `levelProgress(xp)` — return progress to next level.
- `awardBadges(profile, progress, badges)` — return earned badges.
- `getDailyChallenge(challenges)` — pick or return today's daily challenge.

## Modules

### `window.CA.CHALLENGE_MANIFESTS` (`src/modules/manifests.js`)

Global array of challenge manifest objects: `{ id, title, domain, difficulty, description, xp, objective, hints, successCriteria }`.

### `window.CA.registry` (`src/modules/registry.js`)

- `getById(id)` — return a challenge manifest.
- `getByDomain(domain)` — return challenges in a domain.
- `getAll()` — return all challenges.

### `window.CA.labs`

Dictionary of lab controllers by key `'<domain>/<challenge-id>'`. Each lab is registered by its `lab.js` classic script.

## LabRunner

### `window.CA.LabRunner` (`src/labs/lab-runner.js`)

- `new LabRunner(container, challenge)` — create a runner for a challenge.
- `mount()` — mount the lab. Uses Shadow DOM on `file://`, sandboxed `srcdoc` iframe otherwise.
- `submit(payload)` — submit a payload if the lab supports it.
- `destroy()` — clean up the lab and listeners.

## Events

- `lab-complete` — fired on the lab frame when a challenge is completed. `detail` contains `{ score, flag, message }`.
- `lab-fail` — fired on the lab frame when a challenge attempt fails. `detail` contains `{ message }`.
- `lab-hint` — fired on the lab frame when the lab requests a hint. `detail` contains `{ text }`.
- `state-change` — fired on the `Store` instance when state changes.
