(function () {

const { getLevelProgress } = window.CA.services.gamify

class XXpBar extends HTMLElement {
  static get observedAttributes() { return ['xp'] }

  attributeChangedCallback() {
    this.#render()
  }

  connectedCallback() {
    this.#render()
  }

  #render() {
    const xp = parseInt(this.getAttribute('xp') || '0', 10)
    const { level, percentage, remainder, next, current } = getLevelProgress(xp)
    this.innerHTML = `
      <div class="mb-2 flex items-center justify-between">
        <span class="font-headline text-sm color-primary">Level ${level}</span>
        <span class="font-terminal color-muted">${remainder} / ${next - current} XP</span>
      </div>
      <div class="xp-bar">
        <div class="xp-bar-fill" style="--width: ${percentage}%"></div>
      </div>
    `
  }
}

customElements.define('x-xp-bar', XXpBar)


})()
