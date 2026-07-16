const ROUTES = [
  { pattern: '/', name: 'dashboard' },
  { pattern: '/learn', name: 'learn' },
  { pattern: '/challenge/:id', name: 'challenge' },
  { pattern: '/profile', name: 'profile' },
  { pattern: '/leaderboard', name: 'leaderboard' },
  { pattern: '/settings', name: 'settings' }
]

function match(path) {
  for (const route of ROUTES) {
    const parts = route.pattern.split('/').filter(Boolean)
    const segments = path.split('/').filter(Boolean)
    const params = {}
    if (parts.length !== segments.length) continue
    let ok = true
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const seg = segments[i]
      if (part.startsWith(':')) {
        params[part.slice(1)] = decodeURIComponent(seg)
      } else if (part !== seg) {
        ok = false
        break
      }
    }
    if (ok) return { name: route.name, path, params }
  }
  return { name: 'not-found', path, params: {} }
}

export class Router {
  #current = null

  start() {
    window.addEventListener('popstate', () => this.#dispatch())
    document.addEventListener('click', (e) => {
      const anchor = e.composedPath().find(el => el instanceof HTMLAnchorElement && el.origin === location.origin && el.getAttribute('data-router') !== 'false')
      if (anchor) {
        e.preventDefault()
        this.navigate(anchor.pathname + anchor.search + anchor.hash)
      }
    })
    if (location.pathname === '/index.html') {
      history.replaceState(null, '', '/')
    }
    this.#dispatch()
  }

  navigate(path, options = {}) {
    if (options.replace) {
      history.replaceState(null, '', path)
    } else {
      history.pushState(null, '', path)
    }
    this.#dispatch()
  }

  #dispatch() {
    const route = match(location.pathname + location.hash)
    if (this.#current && this.#current.path === route.path) return
    this.#current = route
    window.dispatchEvent(new CustomEvent('route-change', { detail: route }))
  }

  current() {
    return this.#current
  }
}

export const router = new Router()
