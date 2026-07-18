import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useChallenges } from '../hooks/useChallenges'
import { LabFrame } from '../components/LabFrame'
import { startChallenge, completeChallenge, useHint } from '../services/progress'

export function Challenge() {
  const { id } = useParams<{ id: string }>()
  const { data: challenges } = useChallenges()
  const navigate = useNavigate()
  const challenge = challenges?.find((c) => c.id === id)
  const [done, setDone] = useState(false)
  const [result, setResult] = useState<{ xp: number; message: string } | null>(null)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [showHints, setShowHints] = useState(false)

  useEffect(() => {
    if (challenge) startChallenge(challenge)
  }, [challenge])

  if (!challenge) {
    return <div className="font-headline text-danger">Challenge not found.</div>
  }

  if (done && result) {
    return (
      <div className="card max-w-2xl mx-auto">
        <div className="challenge-complete">
          <h2 className="font-headline text-xl text-primary">Challenge Complete!</h2>
          <p className="text-gray-100">{result.message}</p>
          <p className="text-quaternary font-headline">+{result.xp} XP</p>
          <div className="completion-actions">
            <button className="btn" onClick={() => navigate('/learn')}>
              Back to Learn
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/')}>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const revealHint = () => {
    if (challenge.hints && hintsRevealed < challenge.hints.length) {
      useHint(challenge.id)
      setHintsRevealed((h) => h + 1)
      setShowHints(true)
    }
  }

  const handleComplete = async (detail: { score: number; flag?: string; message?: string }) => {
    const { xp } = await completeChallenge(challenge, detail, hintsRevealed)
    setResult({ xp, message: detail.message || 'Great work!' })
    setDone(true)
  }

  return (
    <div className="space-y-4">
      <h1 className="font-headline text-xl text-primary">{challenge.title}</h1>
      <p className="text-gray-100">{challenge.objective}</p>
      <LabFrame challenge={challenge} onComplete={handleComplete} />
      <div className="card">
        <h3 className="font-headline text-sm text-white">Hints</h3>
        {showHints &&
          challenge.hints.slice(0, hintsRevealed).map((hint, index) => (
            <p key={index} className="text-sm text-gray-100 mt-2">
              {index + 1}. {hint}
            </p>
          ))}
        <button
          className="btn mt-2"
          onClick={revealHint}
          disabled={hintsRevealed >= challenge.hints.length}
        >
          Show Hint
        </button>
      </div>
    </div>
  )
}
