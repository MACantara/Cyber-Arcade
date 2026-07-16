(function () {

const store = window.CA.services.store
const registry = window.CA.registry
const { startChallenge, completeChallenge, useHint, getChallengeStatus } = window.CA.services.progress
const LabRunner = window.CA.LabRunner
const toast = window.CA.toast

class XChallenge extends HTMLElement {
  #unsubscribe = null
  #runner = null
  #challenge = null
  #hintsRevealed = 0
  #initialized = false
  #completed = false
  #completion = null

  static get observedAttributes() { return ['challenge-id'] }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.#challenge = registry.getById(newValue)
      if (this.isConnected) this.#init()
    }
  }

  connectedCallback() {
    this.#unsubscribe = store.subscribe(() => this.#updateProgress())
    if (!this.#challenge) this.#challenge = registry.getById(this.getAttribute('challenge-id'))
    this.#init()
  }

  disconnectedCallback() {
    this.#unsubscribe?.()
    this.#runner?.destroy?.()
  }

  async #init() {
    if (this.#initialized || !this.#challenge) return
    this.#initialized = true
    this.#completed = false
    this.#completion = null
    await startChallenge(this.#challenge)
    this.#render()
    this.#mountLab()
  }

  #updateProgress() {
    const progress = store.get('progress') || new Map()
    const p = progress.get(this.#challenge?.id)
    if (p) {
      this.#hintsRevealed = p.hintsUsed || 0
      const hintBtn = this.querySelector('#hint-btn .hint-text')
      if (hintBtn) hintBtn.textContent = `Hint (${this.#challenge.hints?.length - this.#hintsRevealed || 0} left)`
      const statusEl = this.querySelector('#challenge-status')
      if (statusEl && p.status === 'completed') {
        statusEl.textContent = 'COMPLETED'
        statusEl.classList.add('status-completed')
      }
    }
  }

  #render() {
    if (this.#completed && this.#completion) {
      this.#renderCompletion()
      return
    }
    const c = this.#challenge
    this.innerHTML = `
      <section class="page">
        <a href="./learn.html" class="btn btn-ghost mb-4"><i data-lucide="arrow-left" aria-hidden="true"></i> Back</a>
        <div class="flex items-center justify-between wrap gap-2 mb-4">
          <h1 class="text-2xl">${c.title}</h1>
          <span class="font-headline text-sm color-primary" id="challenge-status">IN PROGRESS</span>
        </div>
        <p class="subtitle">${c.description}</p>

        <div class="grid grid-2 mb-6 items-start">
          <div>
            <div class="lab-bezel">
              <x-lab-frame id="lab-frame" challenge-id="${c.id}"></x-lab-frame>
            </div>
            <div class="mt-4 flex gap-2">
              <button id="hint-btn" class="btn btn-ghost"><i data-lucide="lightbulb" aria-hidden="true"></i> <span class="hint-text">Hint (${c.hints?.length - this.#hintsRevealed || 0} left)</span></button>
              <button id="reset-btn" class="btn btn-danger"><i data-lucide="rotate-ccw" aria-hidden="true"></i> Reset</button>
            </div>
            <div id="hint-box" class="terminal mt-4 hidden"></div>
          </div>
          <div>
            <x-terminal id="terminal" lines="${JSON.stringify(this.#introLines(c)).replace(/"/g, '&quot;')}"></x-terminal>
          </div>
        </div>
      </section>
    `

    if (window.lucide) window.lucide.createIcons()

    this.querySelector('#hint-btn')?.addEventListener('click', () => this.#showHint())
    this.querySelector('#reset-btn')?.addEventListener('click', () => this.#mountLab())

    const frame = this.querySelector('#lab-frame')
    if (frame) {
      frame.addEventListener('lab-complete', (e) => this.#onComplete(e.detail))
      frame.addEventListener('lab-fail', (e) => this.#onFail(e.detail))
    }
  }

  #introLines(c) {
    return [
      `> Mission: ${c.title}`,
      `> Domain: ${c.domain}`,
      `> Difficulty: ${c.difficulty}`,
      `> XP reward: ${c.xp}`,
      `> Objective: ${c.objective || 'Find the flag.'}`,
      ''
    ]
  }

  #mountLab() {
    const frame = this.querySelector('#lab-frame')
    if (frame) frame.mount(this.#challenge)
  }

  async #showHint() {
    const hints = this.#challenge.hints || []
    if (this.#hintsRevealed >= hints.length) {
      toast('No hints left.', 'warning')
      return
    }
    await useHint(this.#challenge.id)
    const hintBox = this.querySelector('#hint-box')
    hintBox.classList.remove('hidden')
    const line = document.createElement('div')
    line.textContent = `> ${hints[this.#hintsRevealed]}`
    hintBox.appendChild(line)
    this.#hintsRevealed += 1
    this.#updateProgress()
    toast('Hint revealed. -50 XP potential.', 'warning')
  }

  async #onComplete(detail) {
    const { record, xp, profile } = await completeChallenge(this.#challenge, detail.score || 100, this.#hintsRevealed)
    toast(`Challenge complete! +${xp} XP`, 'success')
    this.#completion = { ...detail, record, xp, profile }
    this.#completed = true
    this.#render()
  }

  #onFail(detail) {
    toast(detail.message || 'Try again.', 'error')
    const terminal = this.querySelector('#terminal')
    if (terminal && terminal.addLine) terminal.addLine(`> ${detail.message || 'Incorrect.'}`)
  }

  #renderCompletion() {
    const c = this.#challenge
    const { xp, flag } = this.#completion
    const next = this.#nextChallenge()
    const nextLink = next
      ? `<a href="./challenge.html?id=${next.id}" class="btn btn-primary"><i data-lucide="arrow-right" aria-hidden="true"></i> Next: ${next.title}</a>`
      : ''

    this.innerHTML = `
      <section class="page page-center">
        <a href="./learn.html" class="btn btn-ghost mb-4"><i data-lucide="arrow-left" aria-hidden="true"></i> Back</a>
        <div class="card challenge-complete">
          <i data-lucide="trophy" class="lucide celebration-icon" aria-hidden="true"></i>
          <h1 class="text-2xl color-primary">${c.title}</h1>
          <p class="subtitle">Mission complete!</p>
          <div class="font-headline text-sm color-quaternary mb-2">+${xp} XP earned</div>
          <div class="font-terminal color-primary">Flag: ${flag || 'N/A'}</div>
          <div class="completion-actions">
            <a href="./learn.html" class="btn btn-ghost"><i data-lucide="book-open" aria-hidden="true"></i> Back to Learn</a>
            <a href="./index.html" class="btn btn-ghost"><i data-lucide="layout-dashboard" aria-hidden="true"></i> Dashboard</a>
            ${nextLink}
          </div>
        </div>
      </section>
    `
    if (window.lucide) window.lucide.createIcons()
  }

  #nextChallenge() {
    const progress = store.get('progress') || new Map()
    const all = registry.getAll()
    const candidates = all.filter(ch =>
      ch.id !== this.#challenge.id &&
      getChallengeStatus(ch, progress) !== 'completed' &&
      getChallengeStatus(ch, progress) !== 'locked'
    )
    const sameDomain = candidates.filter(ch => ch.domain === this.#challenge.domain)
    return sameDomain[0] || candidates[0] || null
  }

  #renderNotFound() {
    this.innerHTML = `
      <section class="page page-center">
        <h1 class="text-2xl color-secondary">Mission not found</h1>
        <p>The challenge ID does not exist.</p>
        <a href="./learn.html" class="btn btn-primary">Back to Learn</a>
      </section>
    `
  }
}

customElements.define('x-challenge', XChallenge)


})()
