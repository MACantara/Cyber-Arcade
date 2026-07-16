(function () {
  const CA = window.CA || (window.CA = {})
  CA.services = CA.services || {}

  const PREFIX = 'CA::'

  function load() {
    const raw = window.name || ''
    if (raw.startsWith(PREFIX)) {
      try {
        return JSON.parse(raw.slice(PREFIX.length)) || {}
      } catch (e) {}
    }
    return {}
  }

  function save(data) {
    window.name = PREFIX + JSON.stringify(data)
  }

  function getStore(data, store) {
    if (!data[store]) data[store] = {}
    return data[store]
  }

  function recordKey(value) {
    return value.id ?? value.challengeId
  }

  CA.services.db = {
    ready: () => Promise.resolve(),
    open: () => Promise.resolve(),

    get(store, key) {
      const data = load()
      const s = getStore(data, store)
      for (const k of Object.keys(s)) {
        const v = s[k]
        if (k === key || (v && (v.id === key || v.challengeId === key))) {
          return Promise.resolve(v)
        }
      }
      return Promise.resolve(null)
    },

    put(store, value) {
      const data = load()
      const s = getStore(data, store)
      const key = recordKey(value) || 'default'
      s[key] = value
      save(data)
      return Promise.resolve()
    },

    delete(store, key) {
      const data = load()
      const s = getStore(data, store)
      delete s[key]
      for (const k of Object.keys(s)) {
        const v = s[k]
        if (v && (v.id === key || v.challengeId === key)) {
          delete s[k]
        }
      }
      save(data)
      return Promise.resolve()
    },

    getAll(store) {
      const data = load()
      const s = getStore(data, store)
      return Promise.resolve(Object.values(s))
    },

    clear(store) {
      const data = load()
      data[store] = {}
      save(data)
      return Promise.resolve()
    },

    exportProfile() {
      const data = load()
      const profile = data.profiles?.default ?? null
      const settings = data.settings?.default ?? null
      const progress = Object.values(data.progress || {})
      const badges = Object.values(data.badges || {})
      return Promise.resolve(JSON.stringify({ profile, settings, progress, badges }))
    },

    importProfile(json) {
      try {
        const parsed = JSON.parse(json)
        const data = load()
        if (parsed.profile) {
          data.profiles = { [parsed.profile.id || 'default']: parsed.profile }
        }
        if (parsed.settings) {
          data.settings = { [parsed.settings.id || 'default']: parsed.settings }
        }
        if (parsed.badges) {
          data.badges = {}
          for (const b of parsed.badges) data.badges[b.id] = b
        }
        if (parsed.progress) {
          data.progress = {}
          for (const p of parsed.progress) data.progress[p.challengeId] = p
        }
        save(data)
        return Promise.resolve()
      } catch (e) {
        return Promise.reject(e)
      }
    }
  }
})()
