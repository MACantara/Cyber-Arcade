(function () {

window.CA = window.CA || {}
window.CA.labs = window.CA.labs || {}

window.CA.labs['general/welcome'] = {
  mount(container, hooks) {
    const FLAG = 'FLAG{WELCOME}'
    const bootLog = [
      'Booting Cyber-Arcade...',
      'Loading kernel modules...',
      'Mounting filesystem...',
      'Checking arcade cabinet sensors...',
      'Welcome, Player 1.',
      `Hidden boot token: ${FLAG}`,
      'Ready.'
    ]

    const wrap = document.createElement('div')
    wrap.className = 'lab wrap'

    const style = document.createElement('style')
    style.textContent = `
      .lab.wrap {
        min-height: 100%;
        box-sizing: border-box;
        padding: var(--space-4);
        background-color: var(--color-bg);
        color: var(--color-white);
        font-family: var(--font-terminal);
        font-size: var(--text-lg);
      }
      .lab.wrap .terminal-line {
        white-space: pre-wrap;
        line-height: 1.4;
      }
      .lab.wrap .prompt {
        margin-top: var(--space-4);
        color: var(--color-primary);
      }
      .lab.wrap .input {
        margin-top: var(--space-2);
        font-family: var(--font-terminal);
        font-size: var(--text-lg);
        background-color: var(--color-black);
        color: var(--color-primary);
        border: 2px solid var(--color-gray-300);
        padding: var(--space-2);
        width: 100%;
        box-sizing: border-box;
        outline: none;
      }
      .lab.wrap .input:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px var(--color-primary);
      }
      .lab.wrap .btn {
        margin-top: var(--space-4);
        font-family: var(--font-headline);
        font-size: var(--text-xs);
        text-transform: uppercase;
        padding: var(--space-3) var(--space-4);
        border: 2px solid var(--color-white);
        background-color: var(--color-primary);
        color: var(--color-black);
        cursor: pointer;
      }
      .lab.wrap .btn:hover {
        filter: brightness(1.1);
      }
    `
    wrap.appendChild(style)

    const output = document.createElement('div')
    output.className = 'terminal-output'
    bootLog.forEach(line => {
      const div = document.createElement('div')
      div.className = 'terminal-line'
      div.textContent = line
      output.appendChild(div)
    })
    wrap.appendChild(output)

    const prompt = document.createElement('div')
    prompt.className = 'prompt'
    prompt.textContent = 'Enter the flag from the boot log:'
    wrap.appendChild(prompt)

    const input = document.createElement('input')
    input.type = 'text'
    input.className = 'input'
    input.placeholder = 'FLAG{...}'
    wrap.appendChild(input)

    const submitBtn = document.createElement('button')
    submitBtn.className = 'btn'
    submitBtn.textContent = 'Submit'
    wrap.appendChild(submitBtn)

    function check() {
      const value = input.value.trim()
      if (!value) return
      if (value.toUpperCase() === FLAG.toUpperCase()) {
        hooks.onComplete({ score: 100, flag: FLAG, message: 'Welcome to the Arcade!' })
      } else {
        hooks.onFail({ message: 'That flag is not correct.' })
      }
    }

    submitBtn.addEventListener('click', check)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') check()
    })

    container.innerHTML = ''
    container.appendChild(wrap)

    return {
      submit(payload) {
        input.value = String(payload || '')
        check()
      }
    }
  }
}

})()
