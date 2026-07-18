import { useState } from 'react'
import { useStore } from '../hooks/useStore'
import { useChallenges } from '../hooks/useChallenges'
import { ChallengeCard } from '../components/ChallengeCard'
import { DOMAINS } from '../config/domains'

export function Learn() {
  const { data: challenges } = useChallenges()
  const [filter, setFilter] = useState<string | null>(null)
  const progress = useStore<Map<string, any>>('progress') ?? new Map()
  const titles = new Map(challenges?.map((c) => [c.id, c.title]) ?? [])

  const filtered = filter
    ? challenges?.filter((c) => c.domain === filter)
    : challenges

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-2xl text-primary">Learn</h1>
      <div className="flex flex-wrap gap-2">
        <button
          className={`btn ${filter === null ? '' : 'btn-ghost'}`}
          onClick={() => setFilter(null)}
        >
          ALL
        </button>
        {DOMAINS.map((domain) => (
          <button
            key={domain.id}
            className={`btn ${filter === domain.id ? '' : 'btn-ghost'}`}
            onClick={() => setFilter(domain.id)}
          >
            {domain.label.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            progress={progress}
            titles={titles}
          />
        ))}
      </div>
    </div>
  )
}
