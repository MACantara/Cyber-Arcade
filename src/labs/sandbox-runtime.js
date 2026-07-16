const parentOrigin = document.referrer ? new URL(document.referrer).origin : '*'

let controller = null

window.addEventListener('message', async (event) => {
  if (event.origin !== parentOrigin && parentOrigin !== '*') return
  if (event.source !== window.parent) return

  const { type, data } = event.data || {}

  if (type === 'init') {
    const { challenge } = data
    try {
      const mod = await import(`../modules/${challenge.domain}/${challenge.id}/lab.js`)
      const lab = mod.default || mod
      controller = lab.mount(document.body, {
        onComplete: (detail) => send('complete', detail),
        onFail: (detail) => send('fail', detail),
        onHint: (text) => send('hint', { text })
      })
    } catch (err) {
      console.error(err)
      send('fail', { message: 'Failed to load lab.' })
    }
  } else if (type === 'check' && controller?.submit) {
    controller.submit(data.payload)
  }
})

function send(type, data) {
  window.parent.postMessage({ type, data }, parentOrigin)
}

send('ready', {})
