import { openDB } from 'idb'

const DB_NAME = 'cyber-arcade'
const DB_VERSION = 1

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db: any) {
      const stores = ['profiles', 'progress', 'badges', 'settings', 'logs']
      for (const name of stores) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name)
        }
      }
    },
  })
}

type StoreName = 'profiles' | 'progress' | 'badges' | 'settings' | 'logs'

export async function get<T>(store: StoreName, key: string): Promise<T | undefined> {
  return (await getDB()).get(store, key)
}

export async function getAll<T>(store: StoreName): Promise<T[]> {
  return (await getDB()).getAll(store)
}

export async function put<T>(store: StoreName, value: T, key: string): Promise<void> {
  await (await getDB()).put(store, value, key)
}

export async function del(store: StoreName, key: string): Promise<void> {
  await (await getDB()).delete(store, key)
}

export async function clear(store: StoreName): Promise<void> {
  await (await getDB()).clear(store)
}

export async function exportProfile(): Promise<string> {
  const db = await getDB()
  const [profiles, progress, badges, settings] = await Promise.all([
    db.getAll('profiles'),
    db.getAll('progress'),
    db.getAll('badges'),
    db.getAll('settings'),
  ])
  return JSON.stringify({ profiles, progress, badges, settings })
}

export async function importProfile(json: string): Promise<void> {
  const data = JSON.parse(json)
  const db = await getDB()
  const tx = db.transaction(['profiles', 'progress', 'badges', 'settings'], 'readwrite')
  for (const profile of data.profiles ?? []) {
    tx.objectStore('profiles').put(profile, profile.id)
  }
  for (const p of data.progress ?? []) {
    tx.objectStore('progress').put(p, p.challengeId)
  }
  for (const badge of data.badges ?? []) {
    tx.objectStore('badges').put(badge, badge.id)
  }
  for (const setting of data.settings ?? []) {
    tx.objectStore('settings').put(setting, setting.id)
  }
  await tx.done
}
