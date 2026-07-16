const CACHE_NAME = 'cyber-arcade-v2'
const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.js',
  '/src/app.js',
  '/src/router.js',
  '/src/services/db.js',
  '/src/services/store.js',
  '/src/services/progress.js',
  '/src/services/gamify.js',
  '/src/components/hud-bar.js',
  '/src/components/toast.js',
  '/src/components/dashboard.js',
  '/src/components/learn.js',
  '/src/components/challenge.js',
  '/src/components/profile.js',
  '/src/components/leaderboard.js',
  '/src/components/settings.js',
  '/src/components/lab-frame.js',
  '/src/components/terminal.js',
  '/src/components/challenge-card.js',
  '/src/components/badge-case.js',
  '/src/components/xp-bar.js',
  '/src/labs/lab-runner.js',
  '/src/labs/sandbox-runtime.js',
  '/src/labs/sandbox.css',
  '/src/modules/registry.js',
  '/src/modules/web/index.js',
  '/src/modules/web/xss-reflection/manifest.js',
  '/src/modules/web/xss-reflection/lab.js',
  '/src/modules/web/sqli-login/manifest.js',
  '/src/modules/web/sqli-login/lab.js',
  '/src/modules/network/index.js',
  '/src/modules/network/packet-reorder/manifest.js',
  '/src/modules/network/packet-reorder/lab.js',
  '/src/modules/network/port-knock/manifest.js',
  '/src/modules/network/port-knock/lab.js',
  '/src/modules/crypto/index.js',
  '/src/modules/crypto/caesar-cipher/manifest.js',
  '/src/modules/crypto/caesar-cipher/lab.js',
  '/src/modules/crypto/hex-dump/manifest.js',
  '/src/modules/crypto/hex-dump/lab.js',
  '/src/modules/general/index.js',
  '/src/modules/general/terminal-hunt/manifest.js',
  '/src/modules/general/terminal-hunt/lab.js',
  '/src/modules/general/recon-robot/manifest.js',
  '/src/modules/general/recon-robot/lab.js',
  '/src/modules/fallback/manifest.js',
  '/src/modules/fallback/lab.js',
  '/src/styles/tokens.css',
  '/src/styles/base.css',
  '/src/styles/components.css',
  '/src/styles/animations.css',
  '/src/styles/utilities.css',
  '/public/icon-192.svg',
  '/public/icon-512.svg'
]

const DYNAMIC = /^\/(src|public)\//

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  if (!event.request.url.startsWith(self.location.origin)) return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response
        if (DYNAMIC.test(new URL(event.request.url).pathname)) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return response
      })
    })
  )
})
