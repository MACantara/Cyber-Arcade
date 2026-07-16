import { LabRunner } from '../labs/lab-runner.js'

class XLabFrame extends HTMLElement {
  static get observedAttributes() { return ['challenge-id'] }
  #runner = null

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) {
      this.mount()
    }
  }

  connectedCallback() {
    this.className = 'lab-frame'
  }

  disconnectedCallback() {
    this.#runner?.destroy()
  }

  mount(challenge) {
    if (challenge) this.challenge = challenge
    if (!this.challenge) return
    this.#runner?.destroy()
    this.#runner = new LabRunner(this, this.challenge)
    this.#runner.mount()
  }

  submit(payload) {
    this.#runner?.submit(payload)
  }
}

customElements.define('x-lab-frame', XLabFrame)
