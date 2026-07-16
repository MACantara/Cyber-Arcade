const DB_NAME = 'cyber-arcade'
const DB_VERSION = 1

const SCHEMA = {
  profiles: { keyPath: 'id' },
  progress: { keyPath: 'challengeId' },
  badges: { keyPath: 'id', indexes: { byDomain: 'domain' } },
  settings: { keyPath: 'id' },
  logs: { keyPath: 'id', autoIncrement: true, indexes: { byType: 'type', byChallenge: 'challengeId' } }
}

class Database {
  #db = null
  #ready = null

  open() {
    if (this.#ready) return this.#ready
    this.#ready = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.#db = request.result
        resolve(this)
      }
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        for (const [store, meta] of Object.entries(SCHEMA)) {
          if (!db.objectStoreNames.contains(store)) {
            const objectStore = db.createObjectStore(store, {
              keyPath: meta.keyPath,
              autoIncrement: meta.autoIncrement ?? false
            })
            if (meta.indexes) {
              for (const [name, keyPath] of Object.entries(meta.indexes)) {
                objectStore.createIndex(name, keyPath, { unique: false })
              }
            }
          }
        }
      }
    })
    return this.#ready
  }

  async #tx(store, mode) {
    await this.open()
    return this.#db.transaction(store, mode).objectStore(store)
  }

  async get(store, key) {
    const objectStore = await this.#tx(store, 'readonly')
    return new Promise((resolve, reject) => {
      const request = objectStore.get(key)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result ?? null)
    })
  }

  async put(store, value) {
    const objectStore = await this.#tx(store, 'readwrite')
    return new Promise((resolve, reject) => {
      const request = objectStore.put(value)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async delete(store, key) {
    const objectStore = await this.#tx(store, 'readwrite')
    return new Promise((resolve, reject) => {
      const request = objectStore.delete(key)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getAll(store) {
    const objectStore = await this.#tx(store, 'readonly')
    return new Promise((resolve, reject) => {
      const request = objectStore.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result ?? [])
    })
  }

  async clear(store) {
    const objectStore = await this.#tx(store, 'readwrite')
    return new Promise((resolve, reject) => {
      const request = objectStore.clear()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async exportProfile() {
    const [profile, progress, badges, settings] = await Promise.all([
      this.get('profiles', 'default'),
      this.getAll('progress'),
      this.getAll('badges'),
      this.get('settings', 'default')
    ])
    return JSON.stringify({ profile, progress, badges, settings })
  }

  async importProfile(json) {
    const data = JSON.parse(json)
    if (data.profile) await this.put('profiles', data.profile)
    if (data.settings) await this.put('settings', data.settings)
    if (data.badges) {
      for (const badge of data.badges) await this.put('badges', badge)
    }
    if (data.progress) {
      for (const p of data.progress) await this.put('progress', p)
    }
  }
}

export const db = new Database()
