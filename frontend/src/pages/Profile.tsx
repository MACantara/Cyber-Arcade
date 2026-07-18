import { useState } from 'react'
import { useStore } from '../hooks/useStore'
import { store } from '../services/store'
import * as db from '../services/db'
import { useChallenges } from '../hooks/useChallenges'
import type { Profile, Progress } from '../types'

export function Profile() {
  const profile = useStore<Profile>('profile')
  const progress = useStore<Map<string, Progress>>('progress') ?? new Map()
  const { data: challenges } = useChallenges()
  const [name, setName] = useState(profile?.name ?? '')
  const [exportData, setExportData] = useState('')
  const [importData, setImportData] = useState('')

  if (!profile) return null

  const completed = Array.from(progress.values()).filter((p) => p.status === 'completed')
  const completedChallenges = completed
    .map((p) => challenges?.find((c) => c.id === p.challengeId))
    .filter(Boolean)

  const saveName = async () => {
    const next = { ...profile, name, updatedAt: new Date().toISOString() }
    await db.put('profiles', next, 'default')
    store.merge({ profile: next })
  }

  const handleExport = async () => {
    setExportData(await db.exportProfile())
  }

  const handleImport = async () => {
    if (!importData) return
    await db.importProfile(importData)
    window.location.reload()
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-headline text-2xl text-primary">Profile</h1>
      <div className="card">
        <label className="font-headline text-sm text-white">Player Name</label>
        <input
          className="input mt-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn mt-2" onClick={saveName}>
          Save Name
        </button>
      </div>
      <div className="card">
        <h2 className="font-headline text-sm text-white">Stats</h2>
        <p className="text-gray-100 mt-2">
          Level {profile.level} • {profile.xp} XP • {completed.length} completed
        </p>
      </div>
      <div className="card">
        <h2 className="font-headline text-sm text-white">Completed Challenges</h2>
        <ul className="mt-2 space-y-1">
          {completedChallenges.map((c) => (
            <li key={c!.id} className="text-gray-100 text-sm">
              {c!.title} — {progress.get(c!.id)?.score ?? 0} pts
            </li>
          ))}
        </ul>
      </div>
      <div className="card space-y-2">
        <h2 className="font-headline text-sm text-white">Backup / Restore</h2>
        <button className="btn" onClick={handleExport}>
          Export Profile
        </button>
        {exportData && (
          <textarea className="input h-24 text-xs" readOnly value={exportData} />
        )}
        <textarea
          className="input h-24 text-xs"
          placeholder="Paste exported JSON here"
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
        />
        <button className="btn" onClick={handleImport}>
          Import Profile
        </button>
      </div>
    </div>
  )
}
