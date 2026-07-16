(function () {

const store = window.CA.services.store
const registry = window.CA.registry

class XProfile extends HTMLElement {
  #unsubscribe = null

  connectedCallback() {
    this.#render()
    this.#unsubscribe = store.subscribe(() => this.#render())
  }

  disconnectedCallback() {
    this.#unsubscribe?.()
  }

  #render() {
    const state = store.get()
    const profile = state.profile || { xp: 0, level: 1, streak: 0, name: 'Player 1' }
    const progress = state.progress || new Map()
    const badges = state.badges || new Set()
    const completed = Array.from(progress.values()).filter(p => p.status === 'completed')
    const total = registry.getAll().length
    const byDomain = {}
    for (const c of registry.getAll()) {
      byDomain[c.domain] = (byDomain[c.domain] || 0) + 1
    }

    this.innerHTML = `
      <section class="page">
        <h1 class="text-2xl mb-2">Profile</h1>
        <p class="subtitle mb-6">${profile.name}</p>

        <div class="grid grid-2 mb-8">
          <div class="card">
            <div class="card-header">Stats</div>
            <div class="font-terminal text-lg">
              <div>Level: <span class="color-primary">${profile.level}</span></div>
              <div>Total XP: <span class="color-quaternary">${profile.xp}</span></div>
              <div>Streak: <span class="color-tertiary">${profile.streak}</span></div>
              <div>Completed: <span class="color-primary">${completed.length} / ${total}</span></div>
            </div>
            <x-xp-bar xp="${profile.xp}"></x-xp-bar>
          </div>
          <div class="card">
            <div class="card-header">Badges</div>
            <p class="color-muted">${badges.size} earned</p>
            <x-badge-case></x-badge-case>
          </div>
        </div>

        <h2 class="section-title">Progress by Domain</h2>
        <div class="grid grid-2">
          ${Object.entries(byDomain).map(([domain, count]) => {
            const done = completed.filter(p => p.domain === domain).length
            return `
              <div class="card">
                <div class="card-header">${domain.toUpperCase()}</div>
                <div class="font-terminal text-lg">${done} / ${count} completed</div>
                <div class="xp-bar mt-2">
                  <div class="xp-bar-fill" style="--width: ${count ? (done / count) * 100 : 0}%"></div>
                </div>
              </div>
            `
          }).join('')}
        </div>
      </section>
    `
  }
}

customElements.define('x-profile', XProfile)


})()
