(function () {

const store = window.CA.services.store
const registry = window.CA.registry
const { getChallengeStatus, getChallengeLockReason } = window.CA.services.progress

class XDashboard extends HTMLElement {
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
    const completed = Array.from(progress.values()).filter(p => p.status === 'completed').length
    const total = registry.getAll().length
    const dailyId = state.dailyChallengeId
    const daily = dailyId ? registry.getById(dailyId) : null

    this.innerHTML = `
      <section class="page">
        <h1 class="text-2xl mb-2">Welcome back, ${profile.name}</h1>
        <p class="subtitle mb-8">Level ${profile.level} · ${completed} / ${total} challenges completed · ${badges.size} badges earned</p>

        <div class="grid grid-2 mb-8">
          <div class="card">
            <div class="card-header">Daily Challenge</div>
            ${daily ? `
              <p class="mb-4">${daily.title}</p>
              <a href="./challenge.html?id=${daily.id}" class="btn btn-coin">Start Daily Challenge</a>
            ` : '<p class="color-muted">No daily challenge available.</p>'}
          </div>
          <div class="card">
            <div class="card-header">Current Streak</div>
            <p class="text-3xl color-quaternary font-headline">${profile.streak} days</p>
            <p class="color-muted mt-2">Complete a challenge today to keep it going.</p>
          </div>
        </div>

        <h2 class="section-title">Continue Playing</h2>
        <div class="grid">
          ${this.#continueCards(progress)}
        </div>

        <div class="mt-8 text-center">
          <a href="./learn.html" class="btn btn-primary">Browse All Challenges</a>
        </div>
      </section>
    `
  }

  #continueCards(progress) {
    const inProgress = registry.getAll().filter(c => {
      const status = getChallengeStatus(c, progress)
      return status === 'started' || (status === 'available' && c.difficulty === 'beginner')
    }).slice(0, 3)

    if (inProgress.length === 0) {
      return '<p class="color-muted">No active challenges. Start a beginner challenge to learn the ropes.</p>'
    }

    return inProgress.map(c => {
      const status = getChallengeStatus(c, progress)
      const lockReason = status === 'locked' ? getChallengeLockReason(c, progress) : ''
      return `<x-challenge-card data="${JSON.stringify({ ...c, status, lockReason }).replace(/"/g, '&quot;')}"></x-challenge-card>`
    }).join('')
  }
}

customElements.define('x-dashboard', XDashboard)


})()
