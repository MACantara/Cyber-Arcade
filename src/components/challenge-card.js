(function () {

class XChallengeCard extends HTMLElement {
  static get observedAttributes() { return ['data'] }

  attributeChangedCallback() {
    this.#render()
  }

  connectedCallback() {
    this.#render()
  }

  #render() {
    const data = this.getAttribute('data')
    const challenge = data ? JSON.parse(data) : {}
    const status = challenge.status || 'available'
    const isLocked = status === 'locked'
    const isCompleted = status === 'completed'
    const isStarted = status === 'started'
    const isAvailable = status === 'available'
    const statusLabel = isCompleted ? 'COMPLETED' : isStarted ? 'IN PROGRESS' : isLocked ? 'LOCKED' : 'AVAILABLE'
    const difficultyClass = `difficulty-${challenge.difficulty || 'beginner'}`
    const lockReason = challenge.lockReason || ''

    this.innerHTML = `
      <article class="card ${difficultyClass} ${isLocked ? 'card-locked' : ''}">
        <div class="card-header">${challenge.domain?.toUpperCase()}</div>
        <h3 class="text-md mb-2">${challenge.title}</h3>
        <p class="text-sm color-muted mb-4">${challenge.description}</p>
        <div class="flex items-center justify-between wrap gap-2">
          <span class="badge">${challenge.difficulty?.toUpperCase()}</span>
          <span class="font-headline text-xs color-quaternary">+${challenge.xp} XP</span>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-xs font-headline color-muted">${statusLabel}</span>
          ${isLocked
            ? `<button class="btn btn-ghost" disabled title="${lockReason}"><i data-lucide="lock" aria-hidden="true"></i> LOCKED</button>`
            : `<a href="./challenge.html?id=${challenge.id}" class="btn"><i data-lucide="play" aria-hidden="true"></i> ${isStarted ? 'CONTINUE' : 'PLAY'}</a>`}
        </div>
        ${challenge.score ? `<div class="mt-2 font-terminal color-primary">Score: ${challenge.score}</div>` : ''}
      </article>
    `
    if (window.lucide) window.lucide.createIcons()

  }
}

customElements.define('x-challenge-card', XChallengeCard)


})()
