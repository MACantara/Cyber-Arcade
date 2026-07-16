(function () {

window.CA = window.CA || {}
window.CA.labs = window.CA.labs || {}
window.CA.labs['general/terminal-hunt'] = {
  mount(container, hooks) {
    const style = document.createElement('style')
    style.textContent = `
      body { margin: 0; background: #0b0c15; color: #f0f0f0; font-family: 'VT323', monospace; }
      .wrap { max-width: 800px; margin: 0 auto; padding: 1rem; }
      h1 { font-family: 'Press Start 2P', monospace; font-size: 1rem; color: #00ff9d; margin: 0 0 1rem; letter-spacing: 0.08em; text-transform: uppercase; }
      .terminal { background: #05060a; border: 2px solid #00ff9d; padding: 1rem; box-shadow: 0 0 8px #00ff9d; min-height: 300px; max-height: 60vh; overflow-y: auto; }
      .line { white-space: pre-wrap; margin: 0.25rem 0; }
      .prompt { display: flex; align-items: center; gap: 0.5rem; color: #00ff9d; }
      .input { flex: 1; background: transparent; border: none; color: #00ff9d; font-family: 'VT323', monospace; font-size: 1.25rem; outline: none; }
      .blink { animation: blink 1s step-end infinite; }
      @keyframes blink { 50% { opacity: 0; } }
      .error { color: #ff0055; }
    `
    container.appendChild(style)

    const wrap = document.createElement('div')
    wrap.className = 'wrap'

    const title = document.createElement('h1')
    title.textContent = 'Terminal Hunt'
    wrap.appendChild(title)

    const terminal = document.createElement('div')
    terminal.className = 'terminal'
    terminal.setAttribute('role', 'log')
    terminal.setAttribute('aria-live', 'polite')

    const boot = [
      'ARCADE-OS v1.0 boot...',
      'Welcome to the mainframe.',
      'Type "help" for commands, "ls" to browse.',
      'Find the hidden flag.'
    ]
    boot.forEach(text => {
      const line = document.createElement('div')
      line.className = 'line'
      line.textContent = text
      terminal.appendChild(line)
    })

    const prompt = document.createElement('div')
    prompt.className = 'prompt'
    const promptText = document.createElement('span')
    promptText.textContent = 'guest@arcade:~$'
    const input = document.createElement('input')
    input.className = 'input'
    input.setAttribute('type', 'text')
    input.setAttribute('autocomplete', 'off')
    input.setAttribute('autocorrect', 'off')
    input.setAttribute('autocapitalize', 'off')
    input.setAttribute('spellcheck', 'false')
    input.setAttribute('aria-label', 'Terminal command')
    const cursor = document.createElement('span')
    cursor.className = 'blink'
    cursor.textContent = '▮'

    prompt.appendChild(promptText)
    prompt.appendChild(input)
    prompt.appendChild(cursor)
    terminal.appendChild(prompt)
    wrap.appendChild(terminal)
    container.appendChild(wrap)
    input.focus()

    const files = {
      'readme.txt': 'Find the flag by reading the right files.\nTry "cat secret.txt" or searching the logs for "flag".',
      'secret.txt': 'FLAG{TERMINAL_HUNT_1990}\n(keep it secret!)',
      'logs.txt': '2025-05-20 14:32 boot ok\n2025-05-20 14:33 user logged in\n2025-05-20 14:34 flag captured: FLAG{TERMINAL_HUNT_1990}\n2025-05-20 14:35 logout',
      'notes.txt': 'The admin left a secret file and some logs. grep is your friend.'
    }
    const flag = 'FLAG{TERMINAL_HUNT_1990}'
    let completed = false

    function addLine(text, cls = 'line') {
      const line = document.createElement('div')
      line.className = cls
      line.textContent = text
      terminal.insertBefore(line, prompt)
      terminal.scrollTop = terminal.scrollHeight
    }

    function checkForFlag(text) {
      if (completed) return
      if (text.includes(flag)) {
        completed = true
        hooks.onComplete({ score: 100, flag, message: 'Flag captured in the terminal!' })
      }
    }

    function escapeRegex(s) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    function handleCommand(raw) {
      const cmd = raw.trim()
      if (!cmd) return
      addLine(`guest@arcade:~$ ${cmd}`)
      const parts = cmd.split(/\s+/).filter(Boolean)
      const [name, ...args] = parts

      if (name === 'help') {
        addLine('Available commands: ls, cat <file>, grep <pattern> <file>, clear, help')
      } else if (name === 'ls') {
        addLine(Object.keys(files).sort().join('  '))
      } else if (name === 'cat') {
        if (!args[0]) {
          addLine('cat: missing file', 'error')
        } else if (files[args[0]]) {
          const out = files[args[0]]
          addLine(out)
          checkForFlag(out)
        } else {
          addLine(`cat: ${args[0]}: No such file`, 'error')
        }
      } else if (name === 'grep') {
        const pattern = args[0]
        const fileName = args[1]
        if (!pattern || !fileName) {
          addLine('usage: grep <pattern> <file>', 'error')
        } else if (!files[fileName]) {
          addLine(`grep: ${fileName}: No such file`, 'error')
        } else {
          const lines = files[fileName].split('\n')
          const rx = new RegExp(escapeRegex(pattern), 'i')
          const matched = lines.filter(line => rx.test(line))
          if (matched.length) {
            const out = matched.join('\n')
            addLine(out)
            checkForFlag(out)
          } else {
            addLine('no matches')
          }
        }
      } else if (name === 'clear') {
        while (terminal.firstChild && terminal.firstChild !== prompt) {
          terminal.removeChild(terminal.firstChild)
        }
      } else {
        addLine(`${name}: command not found`, 'error')
      }
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = input.value
        input.value = ''
        handleCommand(value)
      }
    })

    return { submit: (payload) => handleCommand(typeof payload === 'string' ? payload : '') }
  }
}


})()
