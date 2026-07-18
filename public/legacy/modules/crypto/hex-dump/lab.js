(function () {

const MESSAGE = 'FLAG{HEX_DUMP_8BIT}'
const HEX = MESSAGE.split('').map((ch) => ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join(' ')

window.CA = window.CA || {}
window.CA.labs = window.CA.labs || {}
window.CA.labs['crypto/hex-dump'] = {
  mount(container, hooks) {
    container.className = 'lab-body'

    const title = document.createElement('h2')
    title.textContent = 'PACKET HEX DUMP'
    title.className = 'lab-title'
    container.appendChild(title)

    const label1 = document.createElement('div')
    label1.textContent = 'CAPTURED BYTES:'
    label1.className = 'lab-label'
    container.appendChild(label1)

    const dump = document.createElement('div')
    dump.textContent = HEX
    dump.className = 'lab-output'
    container.appendChild(dump)

    const label2 = document.createElement('label')
    label2.textContent = 'DECODED FLAG:'
    label2.className = 'lab-label'
    container.appendChild(label2)

    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'FLAG{...}'
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
      const value = input.value.trim()
      if (value === MESSAGE) {
        status.textContent = 'Hex decoded correctly!'
        status.className = 'lab-status ok'
        hooks.onComplete({ score: 100, flag: MESSAGE, message: `Decoded: ${MESSAGE}` })
      } else {
        status.textContent = 'Incorrect decode. Check your ASCII.'
        status.className = 'lab-status bad'
        hooks.onFail({ message: 'The decoded string does not match the hex dump.' })
      }
    }

    button.addEventListener('click', verify)
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') verify() })

    return { submit: (payload) => { if (payload != null) input.value = payload; verify() } }
  }
}


})()
