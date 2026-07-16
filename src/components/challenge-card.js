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
    const status = challenge.status || 'locked'
    const statusLabel = status === 'completed' ? 'COMPLETED' : status === 'started' ? 'IN PROGRESS' : 'LOCKED'
    const isLocked = status === 'locked'
    const difficultyColor = challenge.difficulty === 'beginner' ? 'var(--color-primary)' : challenge.difficulty === 'easy' ? 'var(--color-tertiary)' : challenge.difficulty === 'medium' ? 'var(--color-quaternary)' : 'var(--color-secondary)'

    this.innerHTML = `
      <article class="card" style="${isLocked ? 'opacity: 0.6;' : ''}">
        <div class="card-header" style="color: ${difficultyColor};">${challenge.domain?.toUpperCase()}</div>
        <h3 class="text-md mb-2">${challenge.title}</h3>
        <p class="text-sm color-muted mb-4">${challenge.description}</p>
        <div class="flex items-center justify-between wrap gap-2">
          <span class="badge" style="border-color: ${difficultyColor}; color: ${difficultyColor};">${challenge.difficulty?.toUpperCase()}</span>
          <span class="font-headline text-xs color-quaternary">+${challenge.xp} XP</span>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-xs font-headline color-muted">${statusLabel}</span>
          ${isLocked ? '<button class="btn btn-ghost" disabled>LOCKED</button>' : `<a href="./challenge.html?id=${challenge.id}" class="btn">PLAY</a>`}
        </div>
        ${challenge.score ? `<div class="mt-2 font-terminal color-primary">Score: ${challenge.score}</div>` : ''}
      </article>
    `
  }
}

customElements.define('x-challenge-card', XChallengeCard)


})()
