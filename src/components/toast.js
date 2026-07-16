class XToast extends HTMLElement {
  connectedCallback() {
    this.className = 'toast'
  }

  show(message, type = 'info') {
    const item = document.createElement('div')
    item.className = 'toast-item'
    if (type === 'success') item.style.borderColor = 'var(--color-primary)'
    if (type === 'error') item.style.borderColor = 'var(--color-secondary)'
    if (type === 'warning') item.style.borderColor = 'var(--color-warning)'
    item.textContent = message
    this.appendChild(item)
    setTimeout(() => {
      item.style.opacity = '0'
      setTimeout(() => item.remove(), 300)
    }, 3000)
  }
}

customElements.define('x-toast', XToast)

export function toast(message, type) {
  const el = document.querySelector('x-toast') || document.createElement('x-toast')
  if (!el.isConnected) document.body.appendChild(el)
  el.show(message, type)
}
