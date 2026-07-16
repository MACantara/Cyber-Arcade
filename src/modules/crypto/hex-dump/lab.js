(function () {

const MESSAGE = 'FLAG{HEX_DUMP_8BIT}'
const HEX = MESSAGE.split('').map((ch) => ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join(' ')

function createText(tag, text, styles = {}) {
  const el = document.createElement(tag)
  el.textContent = text
  Object.assign(el.style, styles)
  return el
}

window.CA = window.CA || {}
window.CA.labs = window.CA.labs || {}
window.CA.labs['crypto/hex-dump'] = {
  mount(container, hooks) {
    const s = container.style
    s.fontFamily = "'VT323', monospace"
    s.fontSize = '1.25rem'
    s.color = 'var(--color-white, #f0f0f0)'
    s.background = 'var(--color-bg, #0b0c15)'
    s.padding = '1rem'

    container.appendChild(createText('h2', 'PACKET HEX DUMP', {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '0.625rem',
      color: 'var(--color-primary, #00ff9d)',
      margin: '0 0 1rem 0'
    }))

    container.appendChild(createText('div', 'CAPTURED BYTES:', {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '0.625rem',
      color: 'var(--color-tertiary, #00ccff)',
      marginBottom: '0.5rem'
    }))

    const dump = createText('div', HEX, {
      padding: '0.75rem',
      background: 'var(--color-black, #05060a)',
      border: '2px solid var(--color-gray-300, #4a5068)',
      marginBottom: '1rem',
      wordBreak: 'break-word',
      letterSpacing: '0.08em'
    })
    container.appendChild(dump)

    const label = createText('label', 'DECODED FLAG:', {
      display: 'block',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '0.625rem',
      color: 'var(--color-primary, #00ff9d)',
      marginBottom: '0.5rem'
    })
    container.appendChild(label)

    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'FLAG{...}'
    input.style.width = '100%'
    input.style.boxSizing = 'border-box'
    input.style.padding = '0.5rem'
    input.style.background = 'var(--color-black, #05060a)'
    input.style.color = 'var(--color-primary, #00ff9d)'
    input.style.border = '2px solid var(--color-gray-300, #4a5068)'
    input.style.fontFamily = "'VT323', monospace"
    input.style.fontSize = '1.25rem'
    container.appendChild(input)

    const button = document.createElement('button')
    button.textContent = 'SUBMIT'
    button.style.marginTop = '1rem'
    button.style.padding = '0.75rem 1.25rem'
    button.style.background = 'var(--color-primary, #00ff9d)'
    button.style.color = 'var(--color-black, #05060a)'
    button.style.border = '2px solid var(--color-white, #f0f0f0)'
    button.style.boxShadow = '4px 4px 0 var(--color-white, #f0f0f0)'
    button.style.fontFamily = "'Press Start 2P', monospace"
    button.style.fontSize = '0.625rem'
    button.style.cursor = 'pointer'
    container.appendChild(button)

    const status = createText('div', '', {
      marginTop: '0.75rem',
      minHeight: '1.5rem'
    })
    container.appendChild(status)

    const verify = () => {
      const value = input.value.trim()
      if (value === MESSAGE) {
        status.textContent = 'Hex decoded correctly!'
        status.style.color = 'var(--color-primary, #00ff9d)'
        hooks.onComplete({ score: 100, flag: MESSAGE, message: `Decoded: ${MESSAGE}` })
      } else {
        status.textContent = 'Incorrect decode. Check your ASCII.'
        status.style.color = 'var(--color-danger, #ff0055)'
        hooks.onFail({ message: 'The decoded string does not match the hex dump.' })
      }
    }

    button.addEventListener('click', verify)
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') verify() })

    return { submit: (payload) => { if (payload != null) input.value = payload; verify() } }
  }
}


})()
