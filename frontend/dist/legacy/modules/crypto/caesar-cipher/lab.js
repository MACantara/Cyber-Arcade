(function () {

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

window.CA = window.CA || {}
window.CA.labs = window.CA.labs || {}
window.CA.labs['crypto/caesar-cipher'] = {
  mount(container, hooks) {
    container.className = 'lab-body'

    const title = document.createElement('h2')
    title.textContent = 'CAESAR TRANSMISSION'
    title.className = 'lab-title'
    container.appendChild(title)

    const shift = document.createElement('div')
    shift.textContent = `SHIFT: ${SHIFT}`
    shift.className = 'lab-label tertiary'
    container.appendChild(shift)

    const cipher = document.createElement('div')
    cipher.textContent = CIPHERTEXT
    cipher.className = 'lab-output'
    container.appendChild(cipher)

    const label = document.createElement('label')
    label.textContent = 'ENTER DECODED PLAINTEXT:'
    label.className = 'lab-label'
    container.appendChild(label)

    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Plaintext...'
    input.className = 'lab-input'
    container.appendChild(input)

    const button = document.createElement('button')
    button.textContent = 'SUBMIT'
    button.className = 'lab-btn'
    container.appendChild(button)

    const status = document.createElement('div')
    status.className = 'lab-status'
    container.appendChild(status)

    const verify = () => {
      const value = input.value.trim().toUpperCase()
      if (value === PLAINTEXT) {
        status.textContent = 'Decryption verified!'
        status.className = 'lab-status ok'
        hooks.onComplete({ score: 100, flag: FLAG, message: `Decoded: ${PLAINTEXT}` })
      } else {
        status.textContent = 'Incorrect plaintext. Try again.'
        status.className = 'lab-status bad'
        hooks.onFail({ message: 'The decoded text does not match.' })
      }
    }

    button.addEventListener('click', verify)
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') verify() })

    return { submit: (payload) => { input.value = payload != null ? payload : input.value; verify() } }
  }
}


})()
