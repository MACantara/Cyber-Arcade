(function () {

const store = window.CA.services.store
const { getLevelProgress } = window.CA.services.gamify

class XHudBar extends HTMLElement {
  #unsubscribe = null

  connectedCallback() {
    this.innerHTML = `
      <header class="hud-bar">
        <a href="./index.html" class="hud-logo">Cyber-Arcade</a>
        <nav class="hud-stats" aria-label="Player stats">
          <div class="hud-stat">
            <span class="hud-stat-value" id="hud-level">1</span>
            <span class="hud-stat-label">LVL</span>
          </div>
          <div class="hud-stat" style="min-width: 120px;">
            <div class="xp-bar" title="XP" aria-label="XP bar">
              <div class="xp-bar-fill" id="hud-xp" style="width: 0%;"></div>
            </div>
            <span class="hud-stat-label">XP</span>
          </div>
          <div class="hud-stat">
            <span class="hud-stat-value" id="hud-streak">0</span>
            <span class="hud-stat-label">STREAK</span>
          </div>
          <div class="hud-stat">
            <span class="hud-stat-value" id="hud-badges">0</span>
            <span class="hud-stat-label">BADGES</span>
          </div>
          <a href="./settings.html" class="btn btn-ghost">⚙</a>
        </nav>
      </header>
    `
    this.#unsubscribe = store.subscribe((state) => this.update(state))
    this.update(store.get())
  }

  disconnectedCallback() {
    this.#unsubscribe?.()
  }

  update(state) {
    const profile = state.profile || { xp: 0, level: 1, streak: 0 }
    const badges = state.badges || new Set()
    const progress = getLevelProgress(profile.xp || 0)
    const levelEl = this.querySelector('#hud-level')
    const xpEl = this.querySelector('#hud-xp')
    const streakEl = this.querySelector('#hud-streak')
    const badgesEl = this.querySelector('#hud-badges')
    if (levelEl) levelEl.textContent = profile.level
    if (xpEl) xpEl.style.width = `${progress.percentage}%`
    if (streakEl) streakEl.textContent = profile.streak || 0
    if (badgesEl) badgesEl.textContent = badges.size || 0
  }
}

customElements.define('x-hud-bar', XHudBar)


})()
