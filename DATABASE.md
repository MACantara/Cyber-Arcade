# DATABASE.md — Cyber-Arcade

## Storage

Cyber-Arcade has no backend. Data is stored client-side:

- **HTTP/HTTPS deployments:** `localStorage` key `CA::data`.
- **`file://` pages:** `window.name` with prefix `CA::`.

The underlying schema is the same for both backends.

## Stores

The shared data object contains these top-level stores:

### `profiles`
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Primary key, always `default` |
| `name` | string | Display name |
| `xp` | number | Total experience points |
| `level` | number | Computed level |
| `streak` | number | Current daily streak |
| `lastActive` | string | ISO date of last activity |
| `createdAt` | string | ISO creation timestamp |
| `updatedAt` | string | ISO last update timestamp |

### `progress`
| Field | Type | Description |
|-------|------|-------------|
| `challengeId` | string | Primary key |
| `status` | string | `locked` | `available` | `started` | `completed` |
| `attempts` | number | Number of attempts |
| `score` | number | Best score (0-100) |
| `hintsUsed` | number | Hints consumed |
| `startedAt` | string | ISO timestamp |
| `completedAt` | string | ISO timestamp |

### `badges`
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Primary key |
| `name` | string | Badge name |
| `description` | string | How to earn |
| `icon` | string | SVG path or icon key |
| `earnedAt` | string | ISO timestamp |
| `domain` | string | Optional domain category |

### `settings`
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Primary key, always `default` |
| `theme` | string | `dark` | `light` | `high-contrast` |
| `sound` | boolean | Sound effects enabled |
| `reducedMotion` | boolean | Honor `prefers-reduced-motion` |
| `dailyChallengeDate` | string | ISO date of last daily challenge |
| `dailyChallengeId` | string | ID of today's daily challenge |

### `logs` (not currently populated)
| Field | Type | Description |
|-------|------|-------------|
| `id` | auto-increment | Primary key |
| `type` | string | `start`, `complete`, `hint`, `fail`, `badge`, `level` |
| `challengeId` | string | Related challenge |
| `data` | object | Arbitrary event data |
| `timestamp` | string | ISO timestamp |

## Backup / restore

- `src/storage-proxy.js` exposes `exportProfile()` and `importProfile(json)`.
- Data is JSON-serializable. No encryption.
