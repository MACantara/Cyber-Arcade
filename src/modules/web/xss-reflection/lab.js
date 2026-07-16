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

export default {
  mount(container, hooks) {
    const style = container.style
    style.fontFamily = "'VT323', monospace"
    style.fontSize = '1.25rem'
    style.color = 'var(--color-white, #f0f0f0)'
    style.background = 'var(--color-bg, #0b0c15)'
    style.padding = '1rem'

    const label = document.createElement('label')
    label.textContent = 'SEARCH DATABASE'
    label.style.display = 'block'
    label.style.marginBottom = '0.5rem'
    label.style.fontFamily = "'Press Start 2P', monospace"
    label.style.fontSize = '0.625rem'
    label.style.color = 'var(--color-primary, #00ff9d)'

    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Enter payload...'
    input.style.width = '100%'
    input.style.boxSizing = 'border-box'
    input.style.padding = '0.5rem'
    input.style.background = 'var(--color-black, #05060a)'
    input.style.color = 'var(--color-primary, #00ff9d)'
    input.style.border = '2px solid var(--color-gray-300, #4a5068)'
    input.style.fontFamily = "'VT323', monospace"
    input.style.fontSize = '1.25rem'

    const button = document.createElement('button')
    button.textContent = 'EXECUTE'
    button.style.marginTop = '1rem'
    button.style.padding = '0.75rem 1.25rem'
    button.style.background = 'var(--color-primary, #00ff9d)'
    button.style.color = 'var(--color-black, #05060a)'
    button.style.border = '2px solid var(--color-white, #f0f0f0)'
    button.style.boxShadow = '4px 4px 0 var(--color-white, #f0f0f0)'
    button.style.fontFamily = "'Press Start 2P', monospace"
    button.style.fontSize = '0.625rem'
    button.style.cursor = 'pointer'

    const mirror = document.createElement('div')
    mirror.style.marginTop = '1rem'
    mirror.style.padding = '0.75rem'
    mirror.style.background = 'var(--color-surface, #151725)'
    mirror.style.border = '2px solid var(--color-gray-300, #4a5068)'
    mirror.style.minHeight = '2rem'
    mirror.style.wordBreak = 'break-word'
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
