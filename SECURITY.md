# SECURITY.md — Cyber-Arcade

## Threat model

Cyber-Arcade is a static client-only application. The primary threats are:
1. User-supplied payloads executing in the parent window.
2. Labs breaking out of the sandbox/frame and accessing the parent or local storage.
3. Secrets or keys committed to the repository.
4. Malicious HTML/JS injected through user content.

## Mitigations

### No eval
- Do not use `eval`, `new Function(...)`, `setTimeout`/`setInterval` with string arguments, or `document.write`.
- Labs are not allowed to `eval` user payloads.

### Sandboxed labs (HTTP/HTTPS)
- Labs run in `srcdoc` iframes with `sandbox="allow-scripts"`.
- `allow-same-origin` and `allow-top-navigation` are not set.
- The parent window validates `origin` and `data.type` on every `message` event.

### Direct-mount labs (file://)
- On `file://`, `srcdoc` iframes cannot load local subresources, so labs are mounted directly into a Shadow DOM host inside the parent page.
- Labs receive a `container` and a `hooks` object; they must not access `window.parent`, `window.top`, or `document` beyond creating elements and appending them to `container`.
- Lab styles must be scoped to the wrapper and must not use `body`, `html`, `vh`, or `vw`.

### Content Security Policy
- The project currently does not ship a strict CSP meta tag because it must run from `file://` and because component/lab styles are dynamically generated.
- If serving from a trusted HTTPS origin, a CSP can be added that allows `'self'` scripts, `'self'` styles, `'unsafe-inline'` for component styles, and `https://fonts.googleapis.com`/`https://fonts.gstatic.com`.

### Data safety
- No network requests for data. Storage is local.
- No secrets, API keys, or credentials in source code.
- User profile is stored locally and can be reset/imported/exported.

## Verification checklist
- [ ] `grep` for `eval` and `new Function` in `src/` returns nothing.
- [ ] `grep` for `document.write` returns nothing.
- [ ] `grep` for `innerHTML` shows only static or sanitized HTML.
- [ ] Lab code does not reference `window.parent` or `window.top`.
- [ ] Lab `container` only appends elements created with `document.createElement`.
- [ ] No secrets in `index.html` or any JS file.
