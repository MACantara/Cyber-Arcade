import './app.js'
import './components/hud-bar.js'
import './components/toast.js'
import './components/dashboard.js'
import './components/learn.js'
import './components/challenge.js'
import './components/profile.js'
import './components/leaderboard.js'
import './components/settings.js'
import './components/lab-frame.js'
import './components/terminal.js'
import './components/challenge-card.js'
import './components/badge-case.js'
import './components/xp-bar.js'

import { db } from './services/db.js'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/src/sw.js', { updateViaCache: 'none' }).catch(() => {})
  })
}

await db.open()
