(function () {

const FLAG = 'FLAG{XSS_R3FL3CT3D_8BIT}'
const WRONG_MSG = 'No script detected. Try a <script> tag or an onerror handler.'

function hasScript(payload) {
  const lower = payload.toLowerCase()
  if (lower.includes('<script')) return true
  const doc = new DOMParser().parseFromString(payload, 'text/html')
  if (doc.querySelector('script')) return true
  const walk = (node) => {
    if (node.nodeType !== 1) return false
    for (const attr of node.attributes) {
      if (attr.name.toLowerCase().startsWith('on')) return true
    }
    for (const child of node.children) {
      if (walk(child)) return true
    }
    return false
  }
  return walk(doc.body)
}

window.CA = window.CA || {}
window.CA.labs = window.CA.labs || {}
window.CA.labs['web/xss-reflection'] = {
  mount(container, hooks) {
    container.className = 'lab-body'

    const label = document.createElement('label')
    label.textContent = 'SEARCH DATABASE'
    label.className = 'lab-label'

    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Enter payload...'
    input.className = 'lab-input'

    const button = document.createElement('button')
    button.textContent = 'EXECUTE'
    button.className = 'lab-btn'

    const mirror = document.createElement('div')
    mirror.className = 'lab-output'
    mirror.setAttribute('aria-live', 'polite')

    const check = () => {
      const payload = input.value
      mirror.textContent = `Results for: ${payload}`
      if (hasScript(payload)) {
        hooks.onComplete({
          score: 100,
          flag: FLAG,
          message: 'XSS payload reflected and executed!'
        })
      } else {
        hooks.onFail({ message: WRONG_MSG })
      }
    }

    button.addEventListener('click', check)
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check() })

    container.appendChild(label)
    container.appendChild(input)
    container.appendChild(button)
    container.appendChild(mirror)

    return { submit: (payload) => { input.value = payload != null ? payload : input.value; check() } }
  }
}


})()
