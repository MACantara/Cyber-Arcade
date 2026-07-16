import { store } from '../services/store.js'
import { db } from '../services/db.js'
import { toast } from './toast.js'

class XSettings extends HTMLElement {
  #unsubscribe = null

  connectedCallback() {
    this.#render()
    this.#unsubscribe = store.subscribe(() => this.#render())
    this.addEventListener('change', (e) => this.#onChange(e))
    this.addEventListener('click', (e) => this.#onClick(e))
  }

  disconnectedCallback() {
    this.#unsubscribe?.()
  }

  #render() {
    const state = store.get()
    const profile = state.profile || { name: 'Player 1' }
    const settings = state.settings || { theme: 'dark', sound: false, reducedMotion: false }

    this.innerHTML = `
      <section class="page">
        <h1 class="text-2xl mb-2">Settings</h1>
        <p class="subtitle mb-6">Configure your arcade cabinet.</p>

        <div class="card mb-6">
          <div class="card-header">Profile</div>
          <label class="block mb-2 font-headline text-xs">Display Name</label>
          <input type="text" class="input" id="name-input" value="${profile.name}">
        </div>

        <div class="card mb-6">
          <div class="card-header">Appearance</div>
          <label class="block mb-2 font-headline text-xs">Theme</label>
          <select class="input" id="theme-select">
            <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
            <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
            <option value="high-contrast" ${settings.theme === 'high-contrast' ? 'selected' : ''}>High Contrast</option>
          </select>
          <label class="block mt-4 mb-2 font-headline text-xs">
            <input type="checkbox" id="motion-toggle" ${settings.reducedMotion ? 'checked' : ''}> Reduce motion
          </label>
          <label class="block mt-2 mb-2 font-headline text-xs">
            <input type="checkbox" id="sound-toggle" ${settings.sound ? 'checked' : ''}> Sound effects
          </label>
        </div>

        <div class="card mb-6">
          <div class="card-header">Data</div>
          <button class="btn btn-coin" id="export-btn">Export Profile</button>
          <button class="btn btn-ghost" id="import-btn">Import Profile</button>
          <button class="btn btn-danger" id="reset-btn">Reset All Data</button>
        </div>
      </section>
    `
  }

  async #onChange(e) {
    const target = e.target
    if (target.id === 'name-input') {
      const profile = { ...(store.get('profile') || {}), name: target.value, updatedAt: new Date().toISOString() }
      await db.put('profiles', profile)
      store.set('profile', profile)
    } else if (target.id === 'theme-select') {
      const settings = { ...(store.get('settings') || {}), theme: target.value }
      await db.put('settings', settings)
      store.set('settings', settings)
      document.documentElement.setAttribute('data-theme', target.value)
    } else if (target.id === 'motion-toggle') {
      const settings = { ...(store.get('settings') || {}), reducedMotion: target.checked }
      await db.put('settings', settings)
      store.set('settings', settings)
    } else if (target.id === 'sound-toggle') {
      const settings = { ...(store.get('settings') || {}), sound: target.checked }
      await db.put('settings', settings)
      store.set('settings', settings)
    }
  }

  async #onClick(e) {
    if (e.target.id === 'export-btn') {
      const data = await db.exportProfile()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'cyber-arcade-profile.json'
      a.click()
      URL.revokeObjectURL(url)
      toast('Profile exported.', 'success')
    } else if (e.target.id === 'import-btn') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/json'
      input.onchange = async (ev) => {
        const file = ev.target.files[0]
        if (!file) return
        const text = await file.text()
        try {
          await db.importProfile(text)
          toast('Profile imported. Reloading.', 'success')
          location.reload()
        } catch (err) {
          toast('Import failed.', 'error')
        }
      }
      input.click()
    } else if (e.target.id === 'reset-btn') {
      if (confirm('Reset all data? This cannot be undone.')) {
        await db.clear('profiles')
        await db.clear('progress')
        await db.clear('badges')
        await db.clear('settings')
        await db.clear('logs')
        toast('All data reset. Reloading.', 'success')
        location.reload()
      }
    }
  }
}

customElements.define('x-settings', XSettings)
