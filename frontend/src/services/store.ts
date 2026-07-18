type Listener = (state: any) => void

class Store {
  private state: any = {}
  private listeners = new Set<Listener>()

  get(path?: string) {
    if (!path) return this.state
    const parts = path.split('.')
    let value: any = this.state
    for (const part of parts) {
      if (value == null || typeof value !== 'object') return undefined
      value = value[part]
    }
    return value
  }

  set(path: string, value: any) {
    const parts = path.split('.')
    const last = parts.pop()!
    let target: any = this.state
    for (const part of parts) {
      if (target[part] == null || typeof target[part] !== 'object') {
        target[part] = {}
      }
      target = target[part]
    }
    if (target[last] !== value) {
      target[last] = value
      this.notify()
    }
  }

  merge(value: any) {
    this.state = { ...this.state, ...value }
    this.notify()
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    const snapshot = structuredClone(this.state)
    for (const fn of this.listeners) {
      try {
        fn(snapshot)
      } catch (err) {
        console.error(err)
      }
    }
  }
}

export const store = new Store()
