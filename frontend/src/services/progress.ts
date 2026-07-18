import type { ChallengeManifest, Progress, Profile, Badge, Settings } from '../types'
import * as db from './db'
import { store } from './store'
import { getLevel, computeXpForChallenge, updateStreak, checkBadges, pickDailyChallenge } from './gamify'

export async function loadProfile(): Promise<Profile> {
  let profile = await db.get<Profile>('profiles', 'default')
  const now = new Date().toISOString()
  if (!profile) {
    profile = {
      id: 'default',
      name: 'Player 1',
      xp: 0,
      level: 1,
      streak: 0,
      lastActive: now,
      createdAt: now,
      updatedAt: now,
    }
    await db.put('profiles', profile, 'default')
  } else {
    updateStreak(profile, { activity: false })
    profile.updatedAt = now
    await db.put('profiles', profile, 'default')
  }
  store.merge({ profile: { ...profile, level: getLevel(profile.xp) } })
  return profile
}

export async function loadProgress(): Promise<Map<string, Progress>> {
  const rows = await db.getAll<Progress>('progress')
  const map = new Map(rows.map((p) => [p.challengeId, p]))
  store.merge({ progress: map })
  return map
}

export async function loadBadges(): Promise<Set<string>> {
  const rows = await db.getAll<Badge>('badges')
  const set = new Set(rows.map((b) => b.id))
  store.merge({ badges: set })
  return set
}

export async function loadSettings(): Promise<Settings> {
  let settings = await db.get<Settings>('settings', 'default')
  if (!settings) {
    settings = {
      id: 'default',
      theme: 'dark',
      sound: false,
      reducedMotion: false,
      dailyChallengeDate: null,
      dailyChallengeId: null,
    }
    await db.put('settings', settings, 'default')
  }
  store.merge({ settings })
  return settings
}

export async function startChallenge(challenge: ChallengeManifest): Promise<Progress> {
  const existing = await db.get<Progress>('progress', challenge.id)
  if (existing && existing.status !== 'locked') return existing
  const record: Progress = {
    challengeId: challenge.id,
    status: 'started',
    attempts: 0,
    score: 0,
    hintsUsed: 0,
    domain: challenge.domain,
    startedAt: new Date().toISOString(),
    completedAt: null,
  }
  await db.put('progress', record, challenge.id)
  const progress = new Map(store.get('progress') || new Map<string, Progress>())
  progress.set(challenge.id, record)
  store.set('progress', progress)
  return record
}

export interface CompletionDetail {
  score?: number
  flag?: string
  message?: string
}

export async function completeChallenge(
  challenge: ChallengeManifest,
  detail: CompletionDetail,
  hintsRevealed: number,
): Promise<{ record: Progress; xp: number; profile: Profile; newBadges: Badge[] }> {
  const started = await db.get<Progress>('progress', challenge.id) ?? {
    challengeId: challenge.id,
    status: 'started',
    attempts: 0,
    score: 0,
    hintsUsed: 0,
    startedAt: null,
    completedAt: null,
  }
  const score = Math.max(0, Math.min(100, detail.score ?? 100))
  started.attempts += 1
  started.score = Math.max(started.score, score)
  started.hintsUsed = hintsRevealed
  started.status = 'completed'
  started.completedAt = new Date().toISOString()
  await db.put('progress', started, challenge.id)

  const loadedProfile = await db.get<Profile>('profiles', 'default')
  const profile = loadedProfile ?? (await loadProfile())
  updateStreak(profile, { activity: true })
  const xp = computeXpForChallenge(challenge.xp, score, hintsRevealed)
  profile.xp += xp
  profile.level = getLevel(profile.xp)
  profile.updatedAt = new Date().toISOString()
  await db.put('profiles', profile, 'default')

  const progress = await db.getAll<Progress>('progress')
  const earned = checkBadges(progress, profile)
  const existingBadges = new Set((await db.getAll<Badge>('badges')).map((b) => b.id))
  const newBadges: Badge[] = []
  for (const b of earned) {
    if (!existingBadges.has(b.id)) {
      await db.put('badges', b, b.id)
      newBadges.push(b)
    }
  }

  const progressMap = new Map(progress.map((p) => [p.challengeId, p]))
  const badgeSet = new Set((await db.getAll<Badge>('badges')).map((b) => b.id))
  store.merge({
    profile: { ...profile, level: getLevel(profile.xp) },
    progress: progressMap,
    badges: badgeSet,
  })
  return { record: started, xp, profile, newBadges }
}

export async function useHint(challengeId: string): Promise<Progress | null> {
  const record = await db.get<Progress>('progress', challengeId)
  if (!record) return null
  record.hintsUsed = (record.hintsUsed || 0) + 1
  await db.put('progress', record, challengeId)
  const progress = new Map(store.get('progress') || new Map<string, Progress>())
  progress.set(challengeId, record)
  store.set('progress', progress)
  return record
}

export async function loadDaily(challenges: ChallengeManifest[]): Promise<string> {
  let settings = await db.get<Settings>('settings', 'default')
  const today = new Date().toISOString().slice(0, 10)
  if (!settings || settings.dailyChallengeDate !== today) {
    const daily = pickDailyChallenge(challenges)
    const next: Settings = {
      id: 'default',
      theme: 'dark',
      sound: false,
      reducedMotion: false,
      dailyChallengeDate: today,
      dailyChallengeId: daily.id,
      ...(settings || {}),
    }
    await db.put('settings', next, 'default')
    store.set('dailyChallengeId', daily.id)
    return daily.id
  }
  store.set('dailyChallengeId', settings.dailyChallengeId)
  return settings.dailyChallengeId ?? ''
}

export function getChallengeStatus(
  challenge: ChallengeManifest,
  progressMap: Map<string, Progress>,
): 'available' | 'started' | 'completed' | 'locked' {
  const prerequisites = challenge.prerequisites || []
  if (prerequisites.length) {
    const locked = prerequisites.some((id) => progressMap.get(id)?.status !== 'completed')
    if (locked) return 'locked'
  }
  return progressMap.get(challenge.id)?.status ?? 'available'
}

export function getChallengeLockReason(
  challenge: ChallengeManifest,
  progressMap: Map<string, Progress>,
  titles: Map<string, string>,
): string {
  const missing = (challenge.prerequisites || []).filter(
    (id) => progressMap.get(id)?.status !== 'completed',
  )
  if (!missing.length) return ''
  const names = missing.map((id) => titles.get(id) || id)
  return `Complete ${names.join(', ')} first.`
}
