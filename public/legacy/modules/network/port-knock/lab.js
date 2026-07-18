(function () {

const PALETTE = {
  bg: '#0b0c15',
  surface: '#151725',
  border: '#4a5068',
  primary: '#00ff9d',
  secondary: '#ff0055',
  tertiary: '#00ccff',
  quaternary: '#ffcc00',
  white: '#f0f0f0',
  black: '#05060a'
}

window.CA = window.CA || {}
window.CA.labs = window.CA.labs || {}
window.CA.labs['network/port-knock'] = {
  mount(container, hooks) {
    const styleText = `
      .lab { font-family: 'VT323', monospace; padding: 1rem; color: ${PALETTE.white}; background: ${PALETTE.bg}; min-height: 100%; }
      .lab h2 { font-family: 'Press Start 2P', monospace; font-size: 0.875rem; color: ${PALETTE.primary}; margin: 0 0 0.75rem; }
      .lab p { margin: 0 0 1rem; line-height: 1.4; }
      .lab .door { padding: 0.75rem; background: ${PALETTE.black}; border: 2px solid ${PALETTE.border}; text-align: center; font-size: 1.5rem; margin-bottom: 1rem; color: ${PALETTE.secondary}; }
      .lab .door.open { color: ${PALETTE.primary}; border-color: ${PALETTE.primary}; }
      .lab .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1rem; }
      .lab .port { padding: 0.75rem; background: ${PALETTE.surface}; border: 2px solid ${PALETTE.border}; color: ${PALETTE.white}; font-family: 'Press Start 2P', monospace; font-size: 0.625rem; cursor: pointer; box-shadow: 4px 4px 0 ${PALETTE.border}; white-space: pre; }
      .lab .port:hover { border-color: ${PALETTE.quaternary}; box-shadow: 4px 4px 0 ${PALETTE.quaternary}; }
      .lab .port:disabled { opacity: 0.4; cursor: not-allowed; }
      .lab .btn { font-family: 'Press Start 2P', monospace; font-size: 0.625rem; text-transform: uppercase; padding: 0.6rem 1rem; background: ${PALETTE.primary}; color: ${PALETTE.black}; border: 2px solid ${PALETTE.white}; box-shadow: 4px 4px 0 ${PALETTE.white}; cursor: pointer; }
      .lab .btn:active { box-shadow: 2px 2px 0 ${PALETTE.white}; transform: translate(2px, 2px); }
      .lab .log { margin-top: 1rem; padding: 0.75rem; background: ${PALETTE.black}; border: 2px solid ${PALETTE.border}; min-height: 3rem; color: ${PALETTE.tertiary}; font-size: 1.25rem; }
    `

    const ports = [
      { num: 22, label: 'SSH' },
      { num: 80, label: 'HTTP' },
      { num: 443, label: 'HTTPS' },
      { num: 8080, label: 'HTTP-alt' },
      { num: 21, label: 'FTP' },
      { num: 25, label: 'SMTP' },
      { num: 53, label: 'DNS' },
      { num: 3306, label: 'MySQL' },
      { num: 1337, label: 'Leet' }
    ]
    const sequence = [22, 80, 443, 8080]
    let knocks = []
    let finished = false

    function render() {
      container.innerHTML = ''
      const wrapper = document.createElement('div')
      wrapper.className = 'lab'

      const style = document.createElement('style')
      style.textContent = styleText
      wrapper.appendChild(style)

      const title = document.createElement('h2')
      title.textContent = 'PORT KNOCK'
      wrapper.appendChild(title)

      const desc = document.createElement('p')
      desc.textContent = 'Knock the ports in the correct order to unlock the server.'
      wrapper.appendChild(desc)

      const door = document.createElement('div')
      door.className = 'door'
      door.textContent = '██ CLOSED ██'
      door.id = 'door'
      wrapper.appendChild(door)

      const grid = document.createElement('div')
      grid.className = 'grid'
      const log = document.createElement('div')
      log.className = 'log'
      log.id = 'log'
      log.textContent = '> waiting for knock...'

      ports.forEach((port) => {
        const btn = document.createElement('button')
        btn.className = 'port'
        btn.textContent = `${port.num}\n${port.label}`
        btn.addEventListener('click', () => {
          if (finished) return
          log.textContent = `> knocked port ${port.num} (${port.label})`
          const expected = sequence[knocks.length]
          if (port.num !== expected) {
            finished = true
            disableAll(grid)
            door.textContent = '██ LOCKED ██'
            hooks.onFail({ message: `Wrong knock! Port ${port.num} is not the next in the sequence.` })
            return
          }
          knocks.push(port.num)
          if (knocks.length === sequence.length) {
            finished = true
            door.classList.add('open')
            door.textContent = '>> OPEN <<'
            disableAll(grid)
            hooks.onComplete({ score: 100, flag: 'FLAG{KNOCKKNOCK}', message: 'Server door opened!' })
          }
        })
        grid.appendChild(btn)
      })

      wrapper.appendChild(grid)

      const resetBtn = document.createElement('button')
      resetBtn.className = 'btn'
      resetBtn.textContent = 'Reset'
      resetBtn.addEventListener('click', () => {
        knocks = []
        finished = false
        render()
      })
      wrapper.appendChild(resetBtn)

      wrapper.appendChild(log)
      container.appendChild(wrapper)
    }

    function disableAll(grid) {
      grid.querySelectorAll('button').forEach(b => { b.disabled = true })
    }

    render()
    return { submit() {} }
  }
}


})()
