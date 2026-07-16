(function () {

function buildSandboxSrcdoc(challenge) {
  const labPath = `./src/modules/${challenge.domain}/${challenge.id}/lab.js`
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="./src/labs/sandbox.css">
  <script src="${labPath}"><\/script>
  <script src="./src/labs/sandbox-runtime.js"><\/script>
</head>
<body style="margin:0;background:var(--color-bg,#0b0c15);color:var(--color-white,#f0f0f0);font-family:monospace;">
</body>
</html>`
}

class LabRunner {
  #iframe = null
  #parentOrigin = null
  #ready = false
  #readyResolve = null
  #readyPromise = null

  constructor(container, challenge) {
    this.container = container
    this.challenge = challenge
    this.#readyPromise = new Promise((resolve) => { this.#readyResolve = resolve })
  }

  mount() {
    if (this.#iframe) this.destroy()
    this.#iframe = document.createElement('iframe')
    this.#iframe.className = 'lab-screen'
    this.#iframe.setAttribute('sandbox', 'allow-scripts')
    this.#iframe.setAttribute('title', `Lab: ${this.challenge.title}`)
    this.#iframe.srcdoc = buildSandboxSrcdoc(this.challenge)
    this.container.innerHTML = ''
    this.container.appendChild(this.#iframe)

    this.#parentOrigin = window.location.origin
    window.addEventListener('message', this.#onMessage)

    return this.#readyPromise
  }

  submit(payload) {
    this.#post('check', { payload })
  }

  destroy() {
    window.removeEventListener('message', this.#onMessage)
    this.#iframe?.remove()
    this.#iframe = null
    this.#ready = false
  }

  #onMessage = (event) => {
    if (event.source !== this.#iframe?.contentWindow) return
    if (event.origin !== 'null' && event.origin !== this.#parentOrigin) return

    const { type, data } = event.data || {}
    if (type === 'ready') {
      this.#ready = true
      this.#post('init', { challenge: this.challenge })
      this.#readyResolve()
    } else if (type === 'complete') {
      this.container.dispatchEvent(new CustomEvent('lab-complete', { detail: data, bubbles: true }))
    } else if (type === 'fail') {
      this.container.dispatchEvent(new CustomEvent('lab-fail', { detail: data, bubbles: true }))
    } else if (type === 'hint') {
      this.container.dispatchEvent(new CustomEvent('lab-hint', { detail: data, bubbles: true }))
    }
  }

  #post(type, data) {
    if (!this.#iframe?.contentWindow) return
    this.#iframe.contentWindow.postMessage({ type, data }, '*')
  }
}

window.CA = window.CA || {}
window.CA.LabRunner = LabRunner


})()
