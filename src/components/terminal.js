(function () {

class XTerminal extends HTMLElement {
  static get observedAttributes() { return ['lines'] }

  attributeChangedCallback() {
    this.#render()
  }

  connectedCallback() {
    this.#render()
  }

  #render() {
    const lines = this.getAttribute('lines')
    const initial = lines ? JSON.parse(lines) : []
    this.innerHTML = `
      <div class="terminal scanlines" id="terminal-output" aria-live="polite">
        ${initial.map(line => `<div>${this.#escape(line)}</div>`).join('')}
        <div><span class="animate-blink">▮</span></div>
      </div>
    `
  }

  addLine(text) {
    const output = this.querySelector('#terminal-output')
    if (!output) return
    const last = output.lastElementChild
    const line = document.createElement('div')
    line.textContent = text
    output.insertBefore(line, last)
    output.scrollTop = output.scrollHeight
  }

  #escape(text) {
    return String(text).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]))
  }
}

customElements.define('x-terminal', XTerminal)


})()
