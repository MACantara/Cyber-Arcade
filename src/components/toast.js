(function () {

class XToast extends HTMLElement {
  connectedCallback() {
    this.className = 'toast'
  }

  show(message, type = 'info') {
    const icons = {
      success: 'check-circle',
      error: 'x-circle',
      warning: 'alert-triangle',
      info: 'info'
    }
    const item = document.createElement('div')
    item.className = `toast-item toast-${type}`
    const icon = document.createElement('i')
    icon.setAttribute('data-lucide', icons[type] || icons.info)
    icon.setAttribute('aria-hidden', 'true')
    const text = document.createElement('span')
    text.textContent = ' ' + message
    item.appendChild(icon)
    item.appendChild(text)
    this.appendChild(item)
    if (window.lucide) window.lucide.createIcons()
    setTimeout(() => {
      item.classList.add('toast-fade')
      setTimeout(() => item.remove(), 300)
    }, 3000)
  }
}

customElements.define('x-toast', XToast)

function toast(message, type) {
  const el = document.querySelector('x-toast') || document.createElement('x-toast')
  if (!el.isConnected) document.body.appendChild(el)
  el.show(message, type)
}

window.CA = window.CA || {}
window.CA.toast = toast


})()
