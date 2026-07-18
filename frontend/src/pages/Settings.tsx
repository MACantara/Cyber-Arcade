import { useStore } from '../hooks/useStore'
import { store } from '../services/store'
import * as db from '../services/db'
import { clear } from '../services/db'
import type { Settings } from '../types'

export function SettingsPage() {
  const settings = useStore<Settings>('settings')

  if (!settings) return null

  const update = async (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch }
    await db.put('settings', next, 'default')
    store.merge({ settings: next })
  }

  const reset = async () => {
    await Promise.all([
      clear('profiles'),
      clear('progress'),
      clear('badges'),
      clear('settings'),
      clear('logs'),
    ])
    window.location.reload()
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-headline text-2xl text-primary">Settings</h1>
      <div className="card space-y-4">
        <h2 className="font-headline text-sm text-white">Appearance</h2>
        <label className="block text-sm text-gray-100">
          Theme
          <select
            className="input mt-1"
            value={settings.theme}
            onChange={(e) => update({ theme: e.target.value as Settings['theme'] })}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="high-contrast">High Contrast</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-100">
          <input
            type="checkbox"
            checked={settings.sound}
            onChange={(e) => update({ sound: e.target.checked })}
          />
          Sound effects
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-100">
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => update({ reducedMotion: e.target.checked })}
          />
          Reduced motion
        </label>
      </div>
      <div className="card space-y-4">
        <h2 className="font-headline text-sm text-white">Danger Zone</h2>
        <button className="btn btn-danger" onClick={reset}>
          Reset All Data
        </button>
      </div>
    </div>
  )
}
