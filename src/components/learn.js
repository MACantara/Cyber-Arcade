(function () {

const store = window.CA.services.store
const registry = window.CA.registry
const { getChallengeStatus, getChallengeLockReason } = window.CA.services.progress

const DOMAINS = [
  { id: 'web', label: 'Web App Security', color: 'var(--color-primary)', description: 'Find and exploit common web vulnerabilities like XSS and SQL injection in a safe, interactive sandbox.' },
  { id: 'network', label: 'Network & System', color: 'var(--color-tertiary)', description: 'Explore how networks and services talk to each other by solving packet, port, and protocol puzzles.' },
  { id: 'crypto', label: 'Crypto & Binary', color: 'var(--color-quaternary)', description: 'Practice encoding, decoding, and classic ciphers used in cryptography and binary analysis.' },
  { id: 'general', label: 'General', color: 'var(--color-secondary)', description: 'Build foundational skills with terminal exploration, reconnaissance, and logical reasoning missions.' }
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
    const selected = this.#filter === 'all' ? null : DOMAINS.find(d => d.id === this.#filter)
    const domainIntro = selected
      ? `<div class="card mb-6" style="border-color: ${selected.color};">
          <div class="card-header" style="color: ${selected.color};">${selected.label}</div>
          <p class="color-muted">${selected.description}</p>
        </div>`
      : `<div class="card mb-6">
          <div class="card-header">Welcome to the Academy</div>
          <p class="color-muted">Each module is a self-contained, hands-on lab. Complete missions to earn XP, keep your streak alive, and unlock badges. Use the filters above to focus on a specific cyber discipline.</p>
        </div>`

    this.innerHTML = `
      <section class="page">
        <h1 class="text-2xl mb-2">Learning Paths</h1>
        <p class="subtitle mb-6">Explore interactive missions, build real skills, and track your progress.</p>

        <div class="flex gap-2 wrap mb-6">
          <button class="btn ${this.#filter === 'all' ? 'btn-primary' : 'btn-ghost'}" data-filter="all">ALL</button>
          ${DOMAINS.map(d => `
            <button class="btn ${this.#filter === d.id ? 'btn-primary' : 'btn-ghost'}" data-filter="${d.id}" style="${this.#filter === d.id ? `border-color: ${d.color}; color: ${d.color};` : ''}">${d.label}</button>
          `).join('')}
        </div>

        ${domainIntro}

        <div class="grid">
          ${enriched.map(c => `<x-challenge-card data="${JSON.stringify(c).replace(/"/g, '&quot;')}"></x-challenge-card>`).join('')}
        </div>
      </section>
    `
  }
}

customElements.define('x-learn', XLearn)


})()
