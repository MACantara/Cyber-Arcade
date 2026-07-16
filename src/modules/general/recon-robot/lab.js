export default {
  mount(container, hooks) {
    const style = document.createElement('style')
    style.textContent = `
      body { margin: 0; background: #0b0c15; color: #f0f0f0; font-family: 'VT323', monospace; }
      .wrap { max-width: 800px; margin: 0 auto; padding: 1rem; }
      h1 { font-family: 'Press Start 2P', monospace; font-size: 1rem; color: #00ccff; margin: 0 0 1rem; letter-spacing: 0.08em; text-transform: uppercase; }
      .panel { background: #151725; border: 2px solid #00ccff; padding: 1rem; box-shadow: 0 0 8px #00ccff; }
      .desc { margin: 0 0 1rem; }
      pre { background: #05060a; border: 2px solid #7a8194; padding: 1rem; overflow: auto; color: #00ff9d; font-size: 1.1rem; }
      .line { display: block; margin: 0.2rem 0; }
      .form { display: flex; gap: 0.5rem; margin-top: 1rem; }
      input { flex: 1; background: #05060a; border: 2px solid #00ccff; color: #00ff9d; font-family: 'VT323', monospace; font-size: 1.2rem; padding: 0.5rem; }
      button { background: #00ff9d; color: #05060a; border: 2px solid #f0f0f0; padding: 0.5rem 1rem; font-family: 'Press Start 2P', monospace; font-size: 0.65rem; cursor: pointer; box-shadow: 4px 4px 0 #f0f0f0; }
      button:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #f0f0f0; }
      .msg { margin-top: 0.75rem; }
      .ok { color: #00ff9d; }
      .bad { color: #ff0055; }
    `
    container.appendChild(style)

    const wrap = document.createElement('div')
    wrap.className = 'wrap'

    const title = document.createElement('h1')
    title.textContent = 'Recon Robot'
    wrap.appendChild(title)

    const panel = document.createElement('div')
    panel.className = 'panel'

    const desc = document.createElement('p')
    desc.className = 'desc'
    desc.textContent = 'Inspect robots.txt. One disallowed path hides the flag. Enter it below.'
    panel.appendChild(desc)

    const pre = document.createElement('pre')
    const robots = [
      'User-agent: *',
      'Disallow: /admin/',
      'Disallow: /system/',
      'Disallow: /api/private/',
      'Disallow: /secret/FLAG{ROBOT_RECON_42}',
      'Disallow: /public/'
    ]
    robots.forEach(line => {
      const span = document.createElement('span')
      span.className = 'line'
      span.textContent = line
      pre.appendChild(span)
    })
    panel.appendChild(pre)

    const form = document.createElement('div')
    form.className = 'form'
    const label = document.createElement('label')
    label.setAttribute('for', 'flag-input')
    label.textContent = 'Flag'
    label.style.position = 'absolute'
    label.style.width = '1px'
    label.style.height = '1px'
    label.style.overflow = 'hidden'
    const input = document.createElement('input')
    input.id = 'flag-input'
    input.setAttribute('type', 'text')
    input.setAttribute('placeholder', 'FLAG{...}')
    input.setAttribute('autocomplete', 'off')
    input.setAttribute('autocorrect', 'off')
    input.setAttribute('autocapitalize', 'off')
    input.setAttribute('spellcheck', 'false')
    const btn = document.createElement('button')
    btn.textContent = 'SUBMIT'
    const msg = document.createElement('div')
    msg.className = 'msg'

    form.appendChild(label)
    form.appendChild(input)
    form.appendChild(btn)
    panel.appendChild(form)
    panel.appendChild(msg)
    wrap.appendChild(panel)
    container.appendChild(wrap)
    input.focus()

    const flag = 'FLAG{ROBOT_RECON_42}'

    function submit(value) {
      const answer = typeof value === 'string' ? value.trim() : input.value.trim()
      if (answer === flag) {
        hooks.onComplete({ score: 100, flag, message: 'Correct! You found the secret path.' })
      } else {
        hooks.onFail({ message: 'That flag is not correct. Inspect robots.txt again.' })
        msg.textContent = 'Incorrect flag. Try again.'
        msg.className = 'msg bad'
      }
    }

    btn.addEventListener('click', () => submit())
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit()
    })

    return { submit }
  }
}
