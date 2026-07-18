import { Link } from 'react-router-dom'
import type { ChallengeManifest, Progress } from '../types'
import { getChallengeStatus, getChallengeLockReason } from '../services/progress'
import { getDomainColor } from '../services/gamify'

interface ChallengeCardProps {
  challenge: ChallengeManifest
  progress: Map<string, Progress>
  titles: Map<string, string>
}

const labels: Record<string, string> = {
  available: 'Available',
  started: 'In Progress',
  completed: 'Completed',
  locked: 'Locked',
}

export function ChallengeCard({ challenge, progress, titles }: ChallengeCardProps) {
  const status = getChallengeStatus(challenge, progress)
  const isLocked = status === 'locked'
  const isStarted = status === 'started'
  const lockReason = isLocked ? getChallengeLockReason(challenge, progress, titles) : ''

  return (
    <div className="card" style={{ '--domain-color': getDomainColor(challenge.domain) } as React.CSSProperties}>
      <div className="font-headline text-sm mb-2" style={{ color: getDomainColor(challenge.domain) }}>
        {challenge.title}
      </div>
      <p className="text-sm text-gray-100 mb-4">{challenge.description}</p>
      <div className="card-footer">
        <div className="flex items-center flex-wrap gap-2">
          <span className="badge">{challenge.difficulty.toUpperCase()}</span>
          <span className="font-headline text-xs text-quaternary">+{challenge.xp} XP</span>
          <span className="text-xs font-headline text-gray-200">{labels[status]}</span>
        </div>
        {isLocked ? (
          <button className="btn btn-ghost" disabled title={lockReason}>
            LOCKED
          </button>
        ) : (
          <Link to={`/challenge/${challenge.id}`} className="btn">
            {isStarted ? 'CONTINUE' : 'PLAY'}
          </Link>
        )}
      </div>
      {isLocked && <p className="text-xs text-gray-200 mt-2">{lockReason}</p>}
    </div>
  )
}
