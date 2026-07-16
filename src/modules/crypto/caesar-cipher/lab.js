const SHIFT = 7
const PLAINTEXT = 'RETRO ARCADE'
const CIPHERTEXT = 'YLAYV HYJHKL'
const FLAG = 'FLAG{CAESAR_ROT7_RETRO}'

function caesar(text, shift) {
  return text.toUpperCase().replace(/[A-Z]/g, (ch) => {
    const code = (ch.charCodeAt(0) - 65 + shift + 26) % 26 + 65
    return String.fromCharCode(code)
  })
}

function createText(tag, text, styles = {}) {
  const el = document.createElement(tag)
  el.textContent = text
  Object.assign(el.style, styles)
  return el
}

export default {
  mount(container, hooks) {
    const s = container.style
    s.fontFamily = "'VT323', monospace"
    s.fontSize = '1.25rem'
    s.color = 'var(--color-white, #f0f0f0)'
    s.background = 'var(--color-bg, #0b0c15)'
    s.padding = '1rem'

    container.appendChild(createText('h2', 'CAESAR TRANSMISSION', {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '0.625rem',
      color: 'var(--color-primary, #00ff9d)',
      margin: '0 0 1rem 0'
    }))

    container.appendChild(createText('div', `SHIFT: ${SHIFT}`, {
      color: 'var(--color-tertiary, #00ccff)',
      marginBottom: '0.5rem'
    }))

    container.appendChild(createText('div', CIPHERTEXT, {
      padding: '0.75rem',
      background: 'var(--color-black, #05060a)',
      border: '2px solid var(--color-gray-300, #4a5068)',
      marginBottom: '1rem',
      letterSpacing: '0.08em'
    }))

    const label = createText('label', 'ENTER DECODED PLAINTEXT:', {
      display: 'block',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '0.625rem',
      color: 'var(--color-primary, #00ff9d)',
      marginBottom: '0.5rem'
    })
    container.appendChild(label)

    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Plaintext...'
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
      const value = input.value.trim().toUpperCase()
      if (value === PLAINTEXT) {
        status.textContent = 'Decryption verified!'
        status.style.color = 'var(--color-primary, #00ff9d)'
        hooks.onComplete({ score: 100, flag: FLAG, message: `Decoded: ${PLAINTEXT}` })
      } else {
        status.textContent = 'Incorrect plaintext. Try again.'
        status.style.color = 'var(--color-danger, #ff0055)'
        hooks.onFail({ message: 'The decoded text does not match.' })
      }
    }

    button.addEventListener('click', verify)
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') verify() })

    return { submit: (payload) => { input.value = payload != null ? payload : input.value; verify() } }
  }
}
