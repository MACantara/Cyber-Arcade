import { useChallenges } from '../hooks/useChallenges'
import { useStore } from '../hooks/useStore'
import type { Progress } from '../types'

export function Leaderboard() {
  const progress = useStore<Map<string, Progress>>('progress') ?? new Map()
  const { data: challenges } = useChallenges()

  const rows = Array.from(progress.values())
    .filter((p) => p.status === 'completed')
    .map((p) => ({
      ...p,
      title: challenges?.find((c) => c.id === p.challengeId)?.title ?? p.challengeId,
    }))
    .sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-headline text-2xl text-primary">Leaderboard</h1>
      <div className="card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="py-2 font-headline text-white">Rank</th>
              <th className="py-2 font-headline text-white">Challenge</th>
              <th className="py-2 font-headline text-white">Score</th>
              <th className="py-2 font-headline text-white">Hints</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.challengeId} className="border-b border-gray-300">
                <td className="py-2 text-gray-100">{index + 1}</td>
                <td className="py-2 text-gray-100">{row.title}</td>
                <td className="py-2 text-primary">{row.score}</td>
                <td className="py-2 text-gray-200">{row.hintsUsed}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="text-gray-100 mt-2">No completed challenges yet. Go learn something!</p>
        )}
      </div>
    </div>
  )
}
