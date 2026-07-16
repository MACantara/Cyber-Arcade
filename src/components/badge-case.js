import { store } from '../services/store.js'
import { BADGES } from '../services/gamify.js'

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
            <span>${badges.has(b.id) ? '★' : '☆'}</span>
            <span>${b.name}</span>
          </div>
        `).join('')}
      </div>
    `
  }
}

customElements.define('x-badge-case', XBadgeCase)
