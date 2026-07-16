(function () {

function buildSandboxSrcdoc(challenge) {
  const labPath = `./src/modules/${challenge.domain}/${challenge.id}/lab.js`
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="./src/styles/tokens.css">
  <link rel="stylesheet" href="./src/styles/base.css">
  <link rel="stylesheet" href="./src/styles/components.css">
  <script src="${labPath}"><\/script>
  <script src="./src/labs/sandbox-runtime.js"><\/script>
</head>
<body class="lab-body">
</body>
</html>`
}

class LabRunner {
  #iframe = null
  #directContainer = null
  #script = null
  #controller = null
  #parentOrigin = null
  #ready = false
  #readyResolve = null
  #readyPromise = null
  #onMessage = null

  constructor(container, challenge) {
    this.container = container
    this.challenge = challenge
    this.#readyPromise = new Promise((resolve) => { this.#readyResolve = resolve })
    this.#onMessage = (event) => this.#handleMessage(event)
  }

  mount() {
    this.destroy()
    this.#ready = false
    this.#readyPromise = new Promise((resolve) => { this.#readyResolve = resolve })

    if (window.location.protocol === 'file:' || window.location.protocol === 'about:') {
      this.#mountDirect()
    } else {
      this.#mountIframe()
    }

    return this.#readyPromise
  }

  submit(payload) {
    if (this.#controller && typeof this.#controller.submit === 'function') {
      this.#controller.submit(payload)
      return
    }
    if (this.#ready && this.#iframe) {
      this.#post('check', { payload })
    }
  }

  destroy() {
    window.removeEventListener('message', this.#onMessage)
    this.#iframe?.remove()
    this.#iframe = null
    this.#directContainer?.remove()
    this.#directContainer = null
    this.#script?.remove()
    this.#script = null
    this.#controller = null
    this.#ready = false
  }

  #dispatch(type, detail) {
    this.container.dispatchEvent(new CustomEvent(type, { detail, bubbles: true }))
  }

  #mountDirect() {
    let shadow = this.container.shadowRoot
    if (!shadow) shadow = this.container.attachShadow({ mode: 'open' })
    shadow.innerHTML = ''

    const sheets = [
      './src/styles/tokens.css',
      './src/styles/base.css',
      './src/styles/components.css'
    ]
    sheets.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      shadow.appendChild(link)
    })

    const wrapper = document.createElement('div')
    wrapper.className = 'lab-screen lab-scroll'

    const div = document.createElement('div')
    div.className = 'lab-mount'
    wrapper.appendChild(div)
    shadow.appendChild(wrapper)
    this.#directContainer = wrapper

    const key = `${this.challenge.domain}/${this.challenge.id}`
    const script = document.createElement('script')
    this.#script = script
    script.src = `./src/modules/${this.challenge.domain}/${this.challenge.id}/lab.js`
    script.onerror = () => {
      this.#dispatch('lab-fail', { message: `Failed to load lab for ${key}.` })
    }
    script.onload = () => {
      const lab = window.CA?.labs?.[key]
      if (!lab || typeof lab.mount !== 'function') {
        this.#dispatch('lab-fail', { message: `Lab ${key} not found.` })
        return
      }
      try {
        this.#controller = lab.mount(div, {
          onComplete: (detail) => this.#dispatch('lab-complete', detail),
          onFail: (detail) => this.#dispatch('lab-fail', detail),
          onHint: (text) => this.#dispatch('lab-hint', { text })
        })
      } catch (err) {
        console.error(err)
        this.#dispatch('lab-fail', { message: 'Failed to load lab.' })
        return
      }
      this.#ready = true
      this.#readyResolve?.()
    }
    shadow.appendChild(script)
  }

  #mountIframe() {
    this.#iframe = document.createElement('iframe')
    this.#iframe.className = 'lab-screen'
    this.#iframe.setAttribute('sandbox', 'allow-scripts')
    this.#iframe.setAttribute('title', `Lab: ${this.challenge.title}`)
    this.#iframe.srcdoc = buildSandboxSrcdoc(this.challenge)
    this.container.innerHTML = ''
    this.container.appendChild(this.#iframe)

    this.#parentOrigin = window.location.origin
    window.addEventListener('message', this.#onMessage)
  }

  #handleMessage(event) {
    if (this.#iframe && event.source !== this.#iframe.contentWindow) return
    if (event.origin !== 'null' && event.origin !== this.#parentOrigin) return

    const { type, data } = event.data || {}
    if (type === 'ready') {
      this.#ready = true
      this.#post('init', { challenge: this.challenge })
      this.#readyResolve?.()
    } else if (type === 'complete') {
      this.#dispatch('lab-complete', data)
    } else if (type === 'fail') {
      this.#dispatch('lab-fail', data)
    } else if (type === 'hint') {
      this.#dispatch('lab-hint', data)
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
