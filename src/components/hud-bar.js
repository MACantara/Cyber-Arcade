(function () {

const store = window.CA.services.store
const { getLevelProgress } = window.CA.services.gamify

class XHudBar extends HTMLElement {
  #unsubscribe = null
  #toggle = null

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
          <div class="hud-actions">
            <a href="./profile.html" class="btn btn-ghost" aria-label="Profile"><i data-lucide="user" aria-hidden="true"></i></a>
            <button id="nav-toggle" class="btn btn-ghost" aria-label="Menu" aria-expanded="false" aria-controls="nav-menu"><i data-lucide="menu" aria-hidden="true"></i></button>
            <ul id="nav-menu" class="nav-menu hidden" role="menu" aria-label="Site navigation">
              <li role="none"><a href="./index.html" role="menuitem">Dashboard</a></li>
              <li role="none"><a href="./learn.html" role="menuitem">Learn</a></li>
              <li role="none"><a href="./profile.html" role="menuitem">Profile</a></li>
              <li role="none"><a href="./leaderboard.html" role="menuitem">Leaderboard</a></li>
              <li role="none"><a href="./settings.html" role="menuitem">Settings</a></li>
            </ul>
          </div>
        </nav>
      </header>
    `
    if (window.lucide) window.lucide.createIcons()
    this.#toggle = () => this.#toggleMenu()
    this.querySelector('#nav-toggle')?.addEventListener('click', this.#toggle)
    this.#unsubscribe = store.subscribe((state) => this.update(state))
    this.update(store.get())
  }

  disconnectedCallback() {
    this.#unsubscribe?.()
    if (this.#toggle) this.querySelector('#nav-toggle')?.removeEventListener('click', this.#toggle)
  }

  #toggleMenu() {
    const menu = this.querySelector('#nav-menu')
    const btn = this.querySelector('#nav-toggle')
    if (!menu || !btn) return
    const hidden = menu.classList.toggle('hidden')
    btn.setAttribute('aria-expanded', String(!hidden))
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
