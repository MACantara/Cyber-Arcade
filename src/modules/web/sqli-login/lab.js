(function () {

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

window.CA = window.CA || {}
window.CA.labs = window.CA.labs || {}
window.CA.labs['web/sqli-login'] = {
  mount(container, hooks) {
    container.className = 'lab-body'

    const title = document.createElement('div')
    title.textContent = 'ADMIN PORTAL'
    title.className = 'lab-title secondary'

    const makeField = (labelText, id) => {
      const label = document.createElement('label')
      label.textContent = labelText
      label.className = 'lab-label tertiary'

      const input = document.createElement('input')
      input.type = 'text'
      input.id = id
      input.className = 'lab-input'
      return { label, input }
    }

    const userField = makeField('USERNAME', 'username')
    const passField = makeField('PASSWORD', 'password')

    const button = document.createElement('button')
    button.textContent = 'LOGIN'
    button.className = 'lab-btn secondary'

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


})()
