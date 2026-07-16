(function () {

const store = window.CA.services.store
const BADGES = window.CA.services.gamify.BADGES

class XBadgeCase extends HTMLElement {
  #unsubscribe = null

  connectedCallback() {
    this.#render()
    this.#unsubscribe = store.subscribe(() => this.#render())
  }

  disconnectedCallback() {
    this.#unsubscribe?.()
  }

  #render() {
    const badges = store.get('badges') || new Set()
    this.innerHTML = `
      <div class="flex wrap gap-2">
        ${BADGES.map(b => `
          <div class="badge ${badges.has(b.id) ? 'badge-gold' : ''}" title="${b.description}">
            <i data-lucide="star" aria-hidden="true"></i>
            <span>${b.name}</span>
          </div>
        `).join('')}
      </div>
    `
    if (window.lucide) window.lucide.createIcons()
  }
}

customElements.define('x-badge-case', XBadgeCase)


})()
