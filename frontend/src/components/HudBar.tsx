import { Zap, Trophy, Flame, Star } from 'lucide-react'
import { useStore } from '../hooks/useStore'
import type { Profile } from '../types'

export function HudBar() {
  const profile = useStore<Profile>('profile')

  return (
    <header className="sticky top-0 z-50 bg-surface-alt border-b-2 border-gray-300 p-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="font-headline text-primary text-sm">Cyber-Arcade</div>
        {profile && (
          <div className="flex flex-wrap gap-4 text-xs font-headline">
            <span className="flex items-center gap-1 text-white">
              <Star size={14} /> LVL {profile.level}
            </span>
            <span className="flex items-center gap-1 text-primary">
              <Zap size={14} /> {profile.xp} XP
            </span>
            <span className="flex items-center gap-1 text-quaternary">
              <Trophy size={14} /> {profile.streak}
            </span>
            <span className="flex items-center gap-1 text-secondary">
              <Flame size={14} /> {profile.streak}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
