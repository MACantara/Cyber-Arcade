import { Link } from 'react-router-dom'
import { useStore } from '../hooks/useStore'
import { useChallenges } from '../hooks/useChallenges'
import { ChallengeCard } from '../components/ChallengeCard'
import { getDomainColor } from '../services/gamify'
import type { Profile } from '../types'

export function Dashboard() {
  const { data: challenges } = useChallenges()
  const profile = useStore<Profile>('profile')
  const dailyId = useStore<string>('dailyChallengeId')
  const progress = useStore<Map<string, any>>('progress') ?? new Map()
  const badges = useStore<Set<string>>('badges') ?? new Set()

  const daily = challenges?.find((c) => c.id === dailyId)
  const titles = new Map(challenges?.map((c) => [c.id, c.title]) ?? [])
  const started =
    challenges?.filter((c) => progress.get(c.id)?.status === 'started').slice(0, 3) ?? []

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-2xl text-primary">Dashboard</h1>
      {profile && (
        <div className="card">
          <h2 className="font-headline text-sm text-white">Welcome, {profile.name}</h2>
          <p className="text-gray-100 mt-2">
            Level {profile.level} • {profile.xp} XP • {badges.size} badges •{' '}
            {progress.size} challenges in progress
          </p>
        </div>
      )}
      {daily && (
        <div
          className="card border-2"
          style={{ borderColor: getDomainColor(daily.domain) }}
        >
          <h2 className="font-headline text-sm text-white">Daily Challenge</h2>
          <p className="text-gray-100 mt-2">{daily.title}</p>
          <Link to={`/challenge/${daily.id}`} className="btn mt-4">
            PLAY DAILY
          </Link>
        </div>
      )}
      <h2 className="font-headline text-sm text-white">Continue Learning</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {started.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            progress={progress}
            titles={titles}
          />
        ))}
      </div>
      {started.length === 0 && (
        <p className="text-gray-200">
          No challenges in progress. <Link to="/learn" className="text-primary underline">Start one!</Link>
        </p>
      )}
    </div>
  )
}
