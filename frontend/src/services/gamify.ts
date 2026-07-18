import type { Badge, ChallengeManifest, Profile, Progress } from '../types'
import { DOMAINS } from '../config/domains'

export const XP_PER_LEVEL = 1000

export function getLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function getLevelProgress(xp: number) {
  const level = getLevel(xp)
  const current = (level - 1) * XP_PER_LEVEL
  const next = level * XP_PER_LEVEL
  return {
    level,
    current,
    next,
    remainder: xp - current,
    percentage: ((xp - current) / XP_PER_LEVEL) * 100,
  }
}

export function computeXpForChallenge(base: number, score: number, hintsUsed: number): number {
  const hintPenalty = hintsUsed * 50
  const scoreBonus = Math.round((score / 100) * base)
  return Math.max(0, scoreBonus - hintPenalty)
}

export function updateStreak(profile: Profile, { activity = false }: { activity?: boolean } = {}): Profile {
  const now = new Date().toISOString()
  const today = now.slice(0, 10)
  const last = profile.lastActive?.slice(0, 10)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  if (activity) {
    if (!last) {
      profile.streak = 1
    } else if (last === today) {
      if (!profile.streak) profile.streak = 1
    } else if (last === yesterdayStr) {
      profile.streak = (profile.streak || 0) + 1
    } else {
      profile.streak = 1
    }
    profile.lastActive = now
  } else if (last && last !== today && last !== yesterdayStr) {
    profile.streak = 0
  }

  return profile
}

export function checkBadges(progress: Progress[], profile: Profile): Badge[] {
  const domainIds = DOMAINS.map((d) => d.id)
  const completedCount = progress.filter((p) => p.status === 'completed').length
  const hasPerfectScore = progress.some((p) => p.status === 'completed' && p.score === 100)
  const noHintCount = progress.filter((p) => p.status === 'completed' && p.hintsUsed === 0).length
  const domainCounts: Record<string, number> = {}

  for (const p of progress) {
    if (p.status !== 'completed' || !p.domain || !domainIds.includes(p.domain)) continue
    domainCounts[p.domain] = (domainCounts[p.domain] || 0) + 1
  }

  const domainBadges: Badge[] = DOMAINS.filter((d) => d.id !== 'general').map((d) => ({
    id: `${d.id}-hunter`,
    name: `${d.label} Hunter`,
    description: `Complete 2 ${d.label} challenges.`,
    domain: d.id,
    earnedAt: new Date().toISOString(),
  }))

  const generalBadges: Badge[] = [
    {
      id: 'first-blood',
      name: 'First Blood',
      description: 'Complete your first challenge.',
      domain: 'general',
      earnedAt: new Date().toISOString(),
    },
    {
      id: 'perfect-score',
      name: 'Perfect Score',
      description: 'Complete a challenge with 100 points.',
      domain: 'general',
      earnedAt: new Date().toISOString(),
    },
    {
      id: 'streak-3',
      name: 'Three Day Streak',
      description: 'Keep a 3-day streak.',
      domain: 'general',
      earnedAt: new Date().toISOString(),
    },
    {
      id: 'hint-master',
      name: 'Hint Master',
      description: 'Complete 5 challenges without hints.',
      domain: 'general',
      earnedAt: new Date().toISOString(),
    },
  ]

  const earned: Badge[] = []

  for (const b of generalBadges) {
    if (b.id === 'first-blood' && completedCount >= 1) earned.push(b)
    if (b.id === 'perfect-score' && hasPerfectScore) earned.push(b)
    if (b.id === 'streak-3' && (profile.streak || 0) >= 3) earned.push(b)
    if (b.id === 'hint-master' && noHintCount >= 5) earned.push(b)
  }

  for (const b of domainBadges) {
    if ((domainCounts[b.domain || ''] || 0) >= 2) {
      earned.push(b)
    }
  }

  return earned
}

export function pickDailyChallenge(challenges: ChallengeManifest[]): { id: string; date: string } {
  const today = new Date().toISOString().slice(0, 10)
  const seed = today.split('-').reduce((a, b) => a + parseInt(b, 10), 0)
  const available = challenges.filter((c) => c.difficulty === 'beginner' || c.difficulty === 'easy')
  const pool = available.length ? available : challenges
  const index = seed % pool.length
  return { id: pool[index].id, date: today }
}

export function getDomainColor(domainId: string): string {
  return DOMAINS.find((d) => d.id === domainId)?.color ?? 'var(--color-primary)'
}
