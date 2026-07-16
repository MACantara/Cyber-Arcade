export class Store {
  #state = {}
  #listeners = new Set()

  get(path) {
    if (!path) return this.#state
    const parts = path.split('.')
    let value = this.#state
    for (const part of parts) {
      if (value == null || typeof value !== 'object') return undefined
      value = value[part]
    }
    return value
  }

  set(path, value) {
    const parts = path.split('.')
    const last = parts.pop()
    let target = this.#state
    for (const part of parts) {
      if (target[part] == null || typeof target[part] !== 'object') {
        target[part] = {}
      }
      target = target[part]
    }
    if (target[last] !== value) {
      target[last] = value
      this.#notify()
    }
  }

  merge(value) {
    this.#state = { ...this.#state, ...value }
    this.#notify()
  }

  subscribe(fn) {
    this.#listeners.add(fn)
    return () => this.#listeners.delete(fn)
  }

  #notify() {
    const snapshot = structuredClone(this.#state)
    for (const fn of this.#listeners) {
      try {
        fn(snapshot)
      } catch (err) {
        console.error(err)
      }
    }
  }
}

export const store = new Store()
