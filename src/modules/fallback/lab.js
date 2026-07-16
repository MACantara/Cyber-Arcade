(function () {

const FLAG = 'FLAG{W3LC0M3_T0_CY83R_ARC4D3}'

window.CA = window.CA || {}
window.CA.labs = window.CA.labs || {}
window.CA.labs['general/welcome'] = {
  mount(container, hooks) {
    container.style.cssText = 'background:#0b0c15; color:#00ff9d; font-family:VT323,monospace; padding:1rem; min-height:100%; box-sizing:border-box;'

    const output = document.createElement('div')
    output.style.cssText = 'white-space:pre-wrap; line-height:1.4;'
    output.textContent = `> BOOT SEQUENCE INITIATED
> LOADING CYBER-ARCADE OS v1.0
> MOUNTING /home/player
> cat /home/player/welcome.txt
> ${FLAG}
> _`

    const input = document.createElement('input')
    input.type = 'text'
    input.className = 'input'
    input.style.cssText = 'margin-top:1rem;'
    input.setAttribute('placeholder', 'Enter the flag...')

    const button = document.createElement('button')
    button.className = 'btn'
    button.style.cssText = 'margin-top:0.5rem;'
    button.textContent = 'Submit'

    const check = () => {
      const value = input.value.trim()
      if (value.toUpperCase() === FLAG) {
        hooks.onComplete({ score: 100, flag: FLAG, message: 'Welcome, recruit. First blood earned.' })
      } else {
        hooks.onFail({ message: 'That is not the flag. Try again.' })
      }
    }

    button.addEventListener('click', check)
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check() })

    container.appendChild(output)
    container.appendChild(input)
    container.appendChild(button)

    return { submit: check }
  }
}


})()
