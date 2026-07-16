# SECURITY.md — Cyber-Arcade

## Threat model

Cyber-Arcade is a static client-only application. The primary threats are:
1. User-supplied payloads executing in the parent window.
2. Labs breaking out of the sandbox and accessing the parent or local storage.
3. Secrets or keys committed to the repository.
4. Malicious HTML/JS injected through user content.

## Mitigations

### No eval
- Do not use `eval`, `new Function(...)`, `setTimeout`/`setInterval` with string arguments, or `document.write`.
- Labs are not allowed to `eval` user payloads.

### Sandboxed labs
- Labs run in `srcdoc` iframes with `sandbox="allow-scripts"`.
- `allow-same-origin` and `allow-top-navigation` are not set.
- The parent window validates `origin` and `data.type` on every `message` event.

### Content Security Policy
- `index.html` sets a strict CSP:
  - `default-src 'self'`
  - `script-src 'self'`
  - `style-src 'self' 'unsafe-inline'` (needed for dynamic component styles)
  - `img-src 'self' data: blob:`
  - `font-src 'self' https://fonts.gstatic.com`
  - `connect-src 'self'`
  - `frame-src 'self'`
  - `object-src 'none'`
  - `base-uri 'self'`
  - `form-action 'self'`

### Data safety
- No network requests for data. IndexedDB is local.
- No secrets, API keys, or credentials in source code.
- User profile is stored locally and can be reset.

## Verification checklist
- [ ] `grep` for `eval` and `new Function` in `src/` returns nothing.
- [ ] `grep` for `document.write` returns nothing.
- [ ] `grep` for `innerHTML` shows only static or sanitized HTML.
- [ ] `iframe` lab elements have `sandbox` attribute.
- [ ] `message` event listener validates `event.origin` and `event.source`.
- [ ] No secrets in `index.html` or any JS file.
