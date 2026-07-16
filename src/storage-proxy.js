(function () {
  const CA = window.CA || (window.CA = {})
  CA.services = CA.services || {}

  let iframe = document.getElementById('storage-frame')
  if (!iframe) {
    iframe = document.createElement('iframe')
    iframe.id = 'storage-frame'
    iframe.src = './storage.html'
    iframe.style.display = 'none'
    if (document.body) {
      document.body.appendChild(iframe)
    } else {
      window.addEventListener('DOMContentLoaded', () => document.body.appendChild(iframe))
    }
  }

  let readyResolve
  let readyReject
  const readyPromise = new Promise((resolve, reject) => {
    readyResolve = resolve
    readyReject = reject
  })

  const pending = new Map()
  let msgId = 0

  window.addEventListener('message', (event) => {
    if (event.source !== iframe.contentWindow) return
    const data = event.data || {}
    if (data.type === 'storage-ready') {
      if (readyResolve) readyResolve()
    } else if (data.type === 'storage-error') {
      if (readyReject) readyReject(new Error(data.error))
    } else if (data.id && pending.has(data.id)) {
      const p = pending.get(data.id)
      pending.delete(data.id)
      if (data.error) p.reject(new Error(data.error))
      else p.resolve(data.result)
    }
  })

  function post(method, args = []) {
    return readyPromise.then(() => {
      return new Promise((resolve, reject) => {
        const id = ++msgId
        pending.set(id, { resolve, reject })
        iframe.contentWindow.postMessage({ id, method, args }, '*')
      })
    })
  }

  CA.services.db = {
    ready: () => readyPromise,
    open: () => readyPromise,
    get: (store, key) => post('get', [store, key]),
    put: (store, value) => post('put', [store, value]),
    delete: (store, key) => post('delete', [store, key]),
    getAll: (store) => post('getAll', [store]),
    clear: (store) => post('clear', [store]),
    exportProfile: () => post('exportProfile'),
    importProfile: (json) => post('importProfile', [json])
  }
})()
