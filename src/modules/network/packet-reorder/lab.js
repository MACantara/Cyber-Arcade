(function () {

const PALETTE = {
  bg: '#0b0c15',
  surface: '#151725',
  border: '#4a5068',
  primary: '#00ff9d',
  secondary: '#ff0055',
  tertiary: '#00ccff',
  white: '#f0f0f0',
  black: '#05060a'
}

function setStyle(el, styles) {
  Object.assign(el.style, styles)
}

function createCard(text, seq) {
  const btn = document.createElement('button')
  btn.className = 'packet'
  setStyle(btn, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.25rem',
    padding: '0.75rem',
    background: PALETTE.surface,
    border: '2px solid ' + PALETTE.border,
    color: PALETTE.white,
    fontFamily: "'VT323', monospace",
    fontSize: '1.25rem',
    cursor: 'pointer',
    boxShadow: '4px 4px 0 ' + PALETTE.border,
    transition: 'transform 0.05s'
  })
  const seqLine = document.createElement('span')
  seqLine.textContent = `SEQ ${seq}`
  setStyle(seqLine, { color: PALETTE.tertiary, fontSize: '1rem' })
  const payloadLine = document.createElement('span')
  payloadLine.textContent = text
  setStyle(payloadLine, { color: PALETTE.primary, fontSize: '1.5rem' })
  btn.append(seqLine, payloadLine)
  return btn
}

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

window.CA = window.CA || {}
window.CA.labs = window.CA.labs || {}
window.CA.labs['network/packet-reorder'] = {
  mount(container, hooks) {
    const doc = container.ownerDocument
    const style = doc.createElement('style')
    style.textContent = `
      .lab { font-family: 'VT323', monospace; padding: 1rem; color: ${PALETTE.white}; }
      .lab h2 { font-family: 'Press Start 2P', monospace; font-size: 0.875rem; color: ${PALETTE.primary}; margin: 0 0 0.75rem; }
      .lab p { margin: 0 0 1rem; line-height: 1.4; }
      .lab .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1rem; }
      .lab .packet:hover { border-color: ${PALETTE.tertiary}; box-shadow: 4px 4px 0 ${PALETTE.tertiary}; }
      .lab .packet:disabled { opacity: 0.4; cursor: not-allowed; }
      .lab .chain { background: ${PALETTE.black}; border: 2px solid ${PALETTE.border}; padding: 0.75rem; min-height: 2.5rem; font-size: 1.5rem; color: ${PALETTE.primary}; letter-spacing: 0.05em; margin-bottom: 1rem; }
      .lab .btn { font-family: 'Press Start 2P', monospace; font-size: 0.625rem; text-transform: uppercase; padding: 0.6rem 1rem; background: ${PALETTE.primary}; color: ${PALETTE.black}; border: 2px solid ${PALETTE.white}; box-shadow: 4px 4px 0 ${PALETTE.white}; cursor: pointer; }
      .lab .btn:active { box-shadow: 2px 2px 0 ${PALETTE.white}; transform: translate(2px, 2px); }
    `
    doc.head.appendChild(style)

    const packets = [
      { seq: 1000, payload: 'FLAG' },
      { seq: 1020, payload: '{RE' },
      { seq: 1040, payload: 'ORDE' },
      { seq: 1060, payload: 'R}' }
    ]
    const expected = packets.slice().sort((a, b) => a.seq - b.seq)
    const flag = expected.map(p => p.payload).join('')

    let picked = []
    let finished = false

    function render() {
      container.textContent = ''
      const wrapper = document.createElement('div')
      wrapper.className = 'lab'
      setStyle(wrapper, {
        background: PALETTE.bg,
        minHeight: '100vh',
        padding: '1rem'
      })

      const title = document.createElement('h2')
      title.textContent = 'PACKET REORDER'
      wrapper.appendChild(title)

      const desc = document.createElement('p')
      desc.textContent = 'Click packets in ascending sequence order to rebuild the message.'
      wrapper.appendChild(desc)

      const chain = document.createElement('div')
      chain.className = 'chain'
      chain.id = 'chain'
      wrapper.appendChild(chain)

      const grid = document.createElement('div')
      grid.className = 'grid'
      const shuffled = shuffle(packets)
      shuffled.forEach((pkt) => {
        const btn = createCard(pkt.payload, pkt.seq)
        btn.addEventListener('click', () => {
          if (finished) return
          const next = expected[picked.length]
          if (pkt.seq !== next.seq) {
            finished = true
            disableAll(grid)
            hooks.onFail({ message: `Out of order! Packet SEQ ${pkt.seq} arrived too early.` })
            return
          }
          picked.push(pkt)
          btn.disabled = true
          chain.textContent = picked.map(p => p.payload).join('')
          if (picked.length === expected.length) {
            finished = true
            hooks.onComplete({ score: 100, flag, message: 'Message reassembled!' })
          }
        })
        grid.appendChild(btn)
      })
      wrapper.appendChild(grid)

      const resetBtn = document.createElement('button')
      resetBtn.className = 'btn'
      resetBtn.textContent = 'Reset'
      resetBtn.addEventListener('click', () => {
        picked = []
        finished = false
        render()
      })
      wrapper.appendChild(resetBtn)

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
