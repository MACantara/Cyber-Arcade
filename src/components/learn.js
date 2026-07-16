(function () {

const store = window.CA.services.store
const registry = window.CA.registry
const { getChallengeStatus, getChallengeLockReason } = window.CA.services.progress
const DOMAINS = window.CA?.DOMAINS || []

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
    const activeClass = (id) => this.#filter === id ? 'btn-filter active' : 'btn-filter'
    const domainIntro = selected
      ? `<div class="card card-compact mb-6 domain-card ${selected.id}">
          <div class="card-header">${selected.label}</div>
          <p class="color-muted">${selected.description}</p>
        </div>`
      : `<div class="card card-compact mb-6">
          <div class="card-header">Welcome to the Academy</div>
          <p class="color-muted">Each module is a self-contained, hands-on lab. Complete missions to earn XP, keep your streak alive, and unlock badges. Use the filters above to focus on a specific cyber discipline.</p>
        </div>`

    this.innerHTML = `
      <section class="page">
        <h1 class="text-2xl mb-2">Learning Paths</h1>
        <p class="subtitle mb-6">Explore interactive missions, build real skills, and track your progress.</p>

        <div class="flex gap-2 wrap mb-6">
          <button class="btn btn-filter ${this.#filter === 'all' ? 'active' : ''}" data-filter="all">ALL</button>
          ${DOMAINS.map(d => `
            <button class="btn ${activeClass(d.id)} ${d.id}" data-filter="${d.id}">${d.label}</button>
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
