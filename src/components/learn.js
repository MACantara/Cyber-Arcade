(function () {

const store = window.CA.services.store
const registry = window.CA.registry
const { getChallengeStatus, getChallengeLockReason } = window.CA.services.progress

const DOMAINS = [
  { id: 'web', label: 'Web App Security', color: 'var(--color-primary)' },
  { id: 'network', label: 'Network & System', color: 'var(--color-tertiary)' },
  { id: 'crypto', label: 'Crypto & Binary', color: 'var(--color-quaternary)' },
  { id: 'general', label: 'General', color: 'var(--color-secondary)' }
]

class XLearn extends HTMLElement {
  #unsubscribe = null
  #filter = 'all'

  connectedCallback() {
    this.#render()
    this.#unsubscribe = store.subscribe(() => this.#render())
    this.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]')
      if (btn) {
        this.#filter = btn.dataset.filter
        this.#render()
      }
    })
  }

  disconnectedCallback() {
    this.#unsubscribe?.()
  }

  #render() {
    const state = store.get()
    const progress = state.progress || new Map()
    const challenges = registry.getAll().filter(c => this.#filter === 'all' || c.domain === this.#filter)
    const enriched = challenges.map(c => {
      const status = getChallengeStatus(c, progress)
      const lockReason = status === 'locked' ? getChallengeLockReason(c, progress) : ''
      return { ...c, status, lockReason }
    })

    this.innerHTML = `
      <section class="page">
        <h1 class="text-2xl mb-2">Learn</h1>
        <p class="subtitle mb-6">Choose a mission. Complete it to earn XP and unlock the next.</p>

        <div class="flex gap-2 wrap mb-6">
          <button class="btn ${this.#filter === 'all' ? 'btn-primary' : 'btn-ghost'}" data-filter="all">ALL</button>
          ${DOMAINS.map(d => `
            <button class="btn ${this.#filter === d.id ? 'btn-primary' : 'btn-ghost'}" data-filter="${d.id}" style="${this.#filter === d.id ? `border-color: ${d.color}; color: ${d.color};` : ''}">${d.label}</button>
          `).join('')}
        </div>

        <div class="grid">
          ${enriched.map(c => `<x-challenge-card data="${JSON.stringify(c).replace(/"/g, '&quot;')}"></x-challenge-card>`).join('')}
        </div>
      </section>
    `
  }
}

customElements.define('x-learn', XLearn)


})()
