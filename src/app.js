import { db } from './services/db.js'
import { store } from './services/store.js'
import { router } from './router.js'
import { loadProfile, loadProgress, loadBadges, loadSettings, loadDaily } from './services/progress.js'
import { registry } from './modules/registry.js'

class XApp extends HTMLElement {
  #unsubscribe = null
  #view = null

  constructor() {
    super()
  }

  async connectedCallback() {
    await db.open()
    const [profile, progress, badges, settings] = await Promise.all([loadProfile(), loadProgress(), loadBadges(), loadSettings()])
    await loadDaily(registry.getAll())

    if (settings?.theme) {
      document.documentElement.setAttribute('data-theme', settings.theme)
    }

    this.#render()
    this.#unsubscribe = store.subscribe(() => this.#updateHeader())
    window.addEventListener('route-change', (e) => this.#route(e.detail))
    router.start()
  }

  disconnectedCallback() {
    this.#unsubscribe?.()
  }

  #render() {
    this.innerHTML = `
      <x-hud-bar></x-hud-bar>
      <main id="app-main" class="app-main"></main>
      <x-toast></x-toast>
    `
    this.#view = this.querySelector('#app-main')
    this.#updateHeader()
  }

  #updateHeader() {
    const hud = this.querySelector('x-hud-bar')
    if (hud && hud.update) hud.update(store.get())
  }

  #route(route) {
    if (!this.#view) return
    this.#view.innerHTML = ''
    switch (route.name) {
      case 'dashboard':
        this.#view.appendChild(this.#createDashboard())
        break
      case 'learn':
        this.#view.appendChild(this.#createLearn())
        break
      case 'challenge':
        this.#view.appendChild(this.#createChallenge(route.params.id))
        break
      case 'profile':
        this.#view.appendChild(this.#createProfile())
        break
      case 'leaderboard':
        this.#view.appendChild(this.#createLeaderboard())
        break
      case 'settings':
        this.#view.appendChild(this.#createSettings())
        break
      default:
        this.#view.appendChild(this.#createNotFound())
    }
    document.documentElement.scrollTo({ top: 0, behavior: 'auto' })
  }

  #createDashboard() {
    const el = document.createElement('x-dashboard')
    return el
  }

  #createLearn() {
    const el = document.createElement('x-learn')
    return el
  }

  #createChallenge(id) {
    const el = document.createElement('x-challenge')
    el.setAttribute('challenge-id', id)
    return el
  }

  #createProfile() {
    const el = document.createElement('x-profile')
    return el
  }

  #createLeaderboard() {
    const el = document.createElement('x-leaderboard')
    return el
  }

  #createSettings() {
    const el = document.createElement('x-settings')
    return el
  }

  #createNotFound() {
    const el = document.createElement('div')
    el.className = 'page page-center'
    el.innerHTML = `
      <h1 class="text-2xl color-secondary">404</h1>
      <p>Level not found.</p>
      <a href="/" class="btn btn-primary" data-router>Return to base</a>
    `
    return el
  }
}

customElements.define('x-app', XApp)
