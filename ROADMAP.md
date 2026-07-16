# ROADMAP.md — Cyber-Arcade

## Milestones

### MVP (Phase 1) — Done
- Core engine, store, shared storage.
- Dashboard, learn, profile, leaderboard, settings pages.
- One challenge per domain.
- Static multi-page shell.
- Design system and UI components.
- Vercel deployment via `vercel.json`.

### Expansion (Phase 2)
- 2-3 challenges per domain.
- Daily challenge system.
- Badge and achievement system.
- Leaderboard (local).

### Polish (Phase 3)
- Advanced animations, view transitions, canvas mini-games.
- More crypto/binary and reverse-engineering labs.
- Accessibility audit and high-contrast theme.
- Performance optimization (lazy loading).

### Future (Phase 4)
- Import/export of user data.
- Optional cloud backup via user-owned storage (no backend).
- Multiplayer CTF rooms (WebRTC or local network).

## Potential New Modules

Concrete challenge ideas that fit the existing `web`, `network`, `crypto`, and `general` domains (and a possible future `binary/reverse` domain). Each module is a self-contained `lab.js` under `src/modules/<domain>/<id>/` plus a manifest entry.

### Web Application Security
- `dom-based-xss` — find and exploit a sink that writes user input to `innerHTML`.
- `idor-accounts` — manipulate an identifier in a URL or payload to access another user's data.
- `command-injection` — inject shell metacharacters into a vulnerable input field.
- `jwt-lab` — decode and tamper with a JWT token to escalate privileges.
- `insecure-local-storage` — read or overwrite a flag stored incorrectly in `localStorage`.
- `open-redirect` — craft a URL parameter that redirects to an attacker-controlled site.

### Network & Systems
- `dns-exfil` — reconstruct a secret flag from DNS query labels.
- `banner-grab` — connect to a fake service and read the banner for the flag.
- `subnet-sweep` — find the live host in a small IP range by submitting the right address.
- `http-smuggling` — reorder or duplicate HTTP headers to bypass a front-end filter.
- `whois-osint` — parse a fake WHOIS record to find hidden contact data / flag.

### Cryptography & Binary
- `xor-cipher` — decode a flag encrypted with a single-byte XOR key.
- `vigenere` — crack a repeating-key cipher using frequency hints.
- `base64-url` — decode a chain of Base64, URL, and HTML entity encodings.
- `hash-cracker` — identify a weak password from a short MD5 or SHA1 hash list.
- `file-magic` — recognize a file type from its magic bytes and extract the flag.

### General / Foundational
- `git-exposure` — recover a flag from a simulated exposed `.git` directory.
- `backup-files` — guess common backup filenames to find the source flag.
- `log-analysis` — grep simulated logs for the hidden flag.
- `brute-force-safe` — crack a short PIN in a small search space.
- `metadata-osint` — extract GPS or author metadata from a fake document.

### Cross-Domain Capstones
- `mini-ctf` — a small multi-stage challenge combining recon, web, and crypto.
- `escape-room` — a terminal-driven puzzle that requires chaining several earlier skills.
- `arcade-boss` — a final multi-step room that rewards all completed domain badges.
