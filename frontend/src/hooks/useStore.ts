import { useSyncExternalStore } from 'react'
import { store } from '../services/store'

export function useStore<T>(path: string): T | undefined {
  return useSyncExternalStore(
    (callback) => store.subscribe(callback),
    () => store.get(path) as T,
    () => store.get(path) as T,
  )
}
