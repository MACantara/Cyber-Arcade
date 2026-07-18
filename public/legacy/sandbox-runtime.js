(function () {

let parentOrigin = '*'
if (document.referrer) {
  try {
    const origin = new URL(document.referrer).origin
    parentOrigin = (origin && origin !== 'null') ? origin : '*'
  } catch {}
}

let controller = null

window.addEventListener('message', async (event) => {
  if (event.origin !== parentOrigin && parentOrigin !== '*') return
  if (event.source !== window.parent) return

  const { type, data } = event.data || {}

  if (type === 'init') {
    const { challenge } = data
    const key = challenge.domain + '/' + challenge.id
    const lab = window.CA && window.CA.labs && window.CA.labs[key]
    if (!lab || typeof lab.mount !== 'function') {
      console.error('Lab not found:', key)
      send('fail', { message: 'Failed to load lab.' })
      return
    }
    try {
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


})()
