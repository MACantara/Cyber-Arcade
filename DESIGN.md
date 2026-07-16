# DESIGN.md — Cyber-Arcade

## Vision
A retro 8-bit arcade learning platform. It should feel like a neon arcade cabinet: chunky pixels, scanlines, CRT glow, coin-slot buttons, and arcade scoreboards. Every interaction is a micro-game.

## Colors

### Primary palette
- `--color-bg`: `#0b0c15` near-black deep space
- `--color-surface`: `#151725` raised panel
- `--color-surface-alt`: `#1e2132` alternate panel
- `--color-primary`: `#00ff9d` neon green (XP, success, highlights)
- `--color-secondary`: `#ff0055` neon magenta (danger, enemies, warnings)
- `--color-tertiary`: `#00ccff` neon cyan (info, links, accents)
- `--color-quaternary`: `#ffcc00` neon yellow (gold, badges, coins)

### Neutrals
- `--color-white`: `#f0f0f0`
- `--color-gray-100`: `#c0c5ce`
- `--color-gray-200`: `#7a8194`
- `--color-gray-300`: `#4a5068`
- `--color-black`: `#05060a`

### Semantic colors
- `--color-success`: `#00ff9d`
- `--color-danger`: `#ff0055`
- `--color-warning`: `#ffcc00`
- `--color-info`: `#00ccff`

## Typography

- Headlines: `'Press Start 2P'`, fallback `monospace` (Google Fonts, loaded in `index.html`).
- Body: `'Inter'`, fallback `system-ui, sans-serif`.
- Monospace/terminal: `'VT323'`, fallback `monospace`.

### Type scale
- `--text-xs`: 0.625rem (10px)
- `--text-sm`: 0.75rem (12px)
- `--text-base`: 0.875rem (14px)
- `--text-md`: 1rem (16px)
- `--text-lg`: 1.25rem (20px)
- `--text-xl`: 1.5rem (24px)
- `--text-2xl`: 2rem (32px)
- `--text-3xl`: 3rem (48px)

Headlines use `line-height: 1.2` and `text-transform: uppercase`. Body uses `line-height: 1.6`. Pixel font uses `letter-spacing: 0.08em`.

## Spacing

Base unit is `4px` (`--space-1`).
- `--space-1`: 0.25rem
- `--space-2`: 0.5rem
- `--space-3`: 0.75rem
- `--space-4`: 1rem
- `--space-6`: 1.5rem
- `--space-8`: 2rem
- `--space-12`: 3rem
- `--space-16`: 4rem

Use `rem` for fluid spacing, but `px` for pixel-art border widths and grid gaps.

## Components

### Button
- `font-family: 'Press Start 2P'`, uppercase, `--text-xs`.
- Padding `0.75rem 1.25rem`.
- Background `var(--color-primary)`, color `var(--color-black)`.
- Border `2px solid var(--color-white)` and `box-shadow: 4px 4px 0 var(--color-white)` for 8-bit depth.
- Active state moves shadow to `2px 2px 0` and translates `2px 2px`.
- Variants: `btn-primary`, `btn-danger`, `btn-ghost`, `btn-coin` (gold).

### Card
- Background `var(--color-surface)`, border `2px solid var(--color-gray-300)`.
- `box-shadow: 4px 4px 0 var(--color-gray-300)`.
- Fixed size range: `min-height: 260px`, `max-height: 320px`, with `overflow: hidden`.
- Use `display: flex; flex-direction: column;` so the footer action stays anchored.
- Clamp the description paragraph to three lines with `line-clamp` so long text never breaks the card height.
- Hover lifts card and brightens border.
- Header uses pixel font and uppercase.
- Status labels are `AVAILABLE` (playable), `IN PROGRESS`, `COMPLETED`, or `LOCKED` (only when prerequisites are not met). A locked card shows a disabled lock button with a tooltip naming the required missions.

### Input
- Monospace terminal font.
- Dark background, neon green caret, `2px solid` border.
- Focus: border glows with `box-shadow` color.

### HUD bar
- Sticky top bar with level, XP, coins, streak, badge count.
- Pixel font for numbers, pixel hearts for lives.

### Terminal
- Black background, green text, scanlines.
- Blinking cursor `▮`.
- Monospace output.

### Icons
- Use Lucide icons from the CDN loaded in every HTML page.
- Markup: `<i data-lucide="icon-name" aria-hidden="true"></i>` inside buttons, links, or badges.
- Call `window.lucide?.createIcons()` after any component injects new `<i data-lucide>` elements.
- Style via `.lucide` and `.lucide-{name}` classes in `src/styles/components.css`.
- Avoid emoji or generic glyph characters for UI icons.

### Lab frame
- Sandboxed `iframe` styled as a mini CRT screen with a bezel.
- Bezel: dark gradient with inset shadow and scanline overlay.
- On `file://` the lab is mounted into a Shadow DOM host (`.lab-screen`) so the same design-system stylesheets must be injected or inlined.

### Labs
- Every lab receives a `container` element; mount all lab UI inside it.
- Scope lab styles to a `.lab` wrapper and append the `<style>` element to the wrapper, not `document.head`.
- Do not rely on `body`, `html`, `vh`, or `vw` units — the lab runs inside a fixed-size frame.
- Use the design-token CSS variables (`--color-*`, `--font-*`, `--space-*`, `--shadow`) instead of hard-coded hex values.
- Re-use shared component classes where possible: `.btn`, `.input`, `.terminal`.
- The lab wrapper should use `min-height: 100%` to fill the `.lab-screen` frame without overflowing the page.

## Elevation

- Pixel shadows: `4px 4px 0` (light) or `6px 6px 0` (deep).
- Glows: `0 0 8px var(--color-primary)`, `0 0 12px var(--color-secondary)`.
- CRT overlay: `repeating-linear-gradient` for scanlines and a subtle vignette.

## Animation

- `view-transition-name` for page transitions.
- Sprite animations use `steps(...)` in `animation-timing-function`.
- Blink, flicker, and glitch effects via keyframes.
- Respect `prefers-reduced-motion`.

## Guidelines

### Do
- Use pixel-perfect alignments on a 4px grid.
- Keep contrast high for readability.
- Use neon accents sparingly.
- Make every challenge feel like a mini-game.

### Don't
- Use gradients for large backgrounds; keep the dark space clean.
- Use real blur or glassmorphism; pixel art is flat.
- Use generic emoji; use 8-bit SVG icons instead.

## Responsive

- Mobile-first.
- Breakpoints: `480px`, `768px`, `1024px`, `1440px`.
- HUD collapses into a hamburger menu on narrow screens.
- Cards stack in a single column on mobile.
