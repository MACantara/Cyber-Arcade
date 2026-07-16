const FLAG = 'FLAG{SQL1_1NJ3CT10N_8BIT}'

function isCommentAttack(input) {
  return /admin['"]\s*--/.test(input.toLowerCase()) ||
    /admin['"]\s*#/.test(input.toLowerCase()) ||
    /admin['"]\s*\/\*/.test(input.toLowerCase())
}

function isTautology(input) {
  const lower = input.toLowerCase()
  return /or\s+['"]1['"]\s*=\s*['"]1/.test(lower) ||
    lower.includes("'='1")
}

function isSqlInjection(username, password) {
  return isCommentAttack(username) ||
    isCommentAttack(password) ||
    isTautology(username) ||
    isTautology(password)
}

export default {
  mount(container, hooks) {
    container.style.fontFamily = "'VT323', monospace"
    container.style.fontSize = '1.25rem'
    container.style.color = 'var(--color-white, #f0f0f0)'
    container.style.background = 'var(--color-bg, #0b0c15)'
    container.style.padding = '1rem'

    const title = document.createElement('div')
    title.textContent = 'ADMIN PORTAL'
    title.style.fontFamily = "'Press Start 2P', monospace"
    title.style.fontSize = '0.625rem'
    title.style.color = 'var(--color-secondary, #ff0055)'
    title.style.marginBottom = '1rem'

    const makeField = (labelText, id) => {
      const label = document.createElement('label')
      label.textContent = labelText
      label.style.display = 'block'
      label.style.marginTop = '0.75rem'
      label.style.marginBottom = '0.25rem'
      label.style.fontFamily = "'Press Start 2P', monospace"
      label.style.fontSize = '0.5rem'
      label.style.color = 'var(--color-tertiary, #00ccff)'

      const input = document.createElement('input')
      input.type = 'text'
      input.id = id
      input.style.width = '100%'
      input.style.boxSizing = 'border-box'
      input.style.padding = '0.5rem'
      input.style.background = 'var(--color-black, #05060a)'
      input.style.color = 'var(--color-primary, #00ff9d)'
      input.style.border = '2px solid var(--color-gray-300, #4a5068)'
      input.style.fontFamily = "'VT323', monospace"
      input.style.fontSize = '1.25rem'
      return { label, input }
    }

    const userField = makeField('USERNAME', 'username')
    const passField = makeField('PASSWORD', 'password')

    const button = document.createElement('button')
    button.textContent = 'LOGIN'
    button.style.marginTop = '1rem'
    button.style.padding = '0.75rem 1.25rem'
    button.style.background = 'var(--color-secondary, #ff0055)'
    button.style.color = 'var(--color-white, #f0f0f0)'
    button.style.border = '2px solid var(--color-white, #f0f0f0)'
    button.style.boxShadow = '4px 4px 0 var(--color-white, #f0f0f0)'
    button.style.fontFamily = "'Press Start 2P', monospace"
    button.style.fontSize = '0.625rem'
    button.style.cursor = 'pointer'

    const check = () => {
      const username = userField.input.value
      const password = passField.input.value

      if (isSqlInjection(username, password)) {
        hooks.onComplete({
          score: 100,
          flag: FLAG,
          message: 'Authentication bypassed. Welcome, admin.'
        })
      } else {
        hooks.onFail({ message: 'Invalid credentials. The portal is secure... or is it?' })
      }
    }

    button.addEventListener('click', check)
    passField.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check() })

    container.appendChild(title)
    container.appendChild(userField.label)
    container.appendChild(userField.input)
    container.appendChild(passField.label)
    container.appendChild(passField.input)
    container.appendChild(button)

    return { submit: (payload) => { userField.input.value = payload != null ? payload : userField.input.value; check() } }
  }
}
