const XP_PER_LEVEL = 1000

export function getLevel(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function getLevelProgress(xp) {
  const level = getLevel(xp)
  const current = (level - 1) * XP_PER_LEVEL
  const next = level * XP_PER_LEVEL
  return { level, current, next, remainder: xp - current, percentage: ((xp - current) / XP_PER_LEVEL) * 100 }
}

export function computeXpForChallenge(base, score, hintsUsed) {
  const hintPenalty = hintsUsed * 50
  const scoreBonus = Math.round((score / 100) * base)
  return Math.max(0, scoreBonus - hintPenalty)
}

export function updateStreak(profile) {
  const today = new Date().toISOString().slice(0, 10)
  const last = profile.lastActive?.slice(0, 10)
  if (!last || last === today) return profile
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)
  if (last === yesterdayStr) {
    profile.streak = (profile.streak || 0) + 1
  } else {
    profile.streak = 1
  }
  profile.lastActive = new Date().toISOString()
  return profile
}

export const BADGES = [
  { id: 'first-blood', name: 'First Blood', description: 'Complete your first challenge.', domain: 'general', check: (p) => p.completedCount >= 1 },
  { id: 'web-hunter', name: 'Web Hunter', description: 'Complete 2 web challenges.', domain: 'web', check: (p) => p.webCount >= 2 },
  { id: 'network-ninja', name: 'Network Ninja', description: 'Complete 2 network challenges.', domain: 'network', check: (p) => p.networkCount >= 2 },
  { id: 'crypto-cracker', name: 'Crypto Cracker', description: 'Complete 2 crypto challenges.', domain: 'crypto', check: (p) => p.cryptoCount >= 2 },
  { id: 'perfect-score', name: 'Perfect Score', description: 'Complete a challenge with 100 points.', domain: 'general', check: (p) => p.hasPerfectScore },
  { id: 'streak-3', name: 'Three Day Streak', description: 'Keep a 3-day streak.', domain: 'general', check: (p) => p.streak >= 3 },
  { id: 'hint-master', name: 'Hint Master', description: 'Complete 5 challenges without hints.', domain: 'general', check: (p) => p.noHintCount >= 5 }
]

export function checkBadges(progress, profile) {
  const counts = { completedCount: 0, webCount: 0, networkCount: 0, cryptoCount: 0, hasPerfectScore: false, noHintCount: 0, streak: profile.streak || 0 }
  for (const p of progress) {
    if (p.status !== 'completed') continue
    counts.completedCount++
    if (p.score === 100) counts.hasPerfectScore = true
    if (p.hintsUsed === 0) counts.noHintCount++
    if (p.domain === 'web') counts.webCount++
    if (p.domain === 'network') counts.networkCount++
    if (p.domain === 'crypto') counts.cryptoCount++
  }
  return BADGES.filter(b => b.check(counts))
}

export function pickDailyChallenge(challenges) {
  const today = new Date().toISOString().slice(0, 10)
  const seed = today.split('-').reduce((a, b) => a + parseInt(b, 10), 0)
  const available = challenges.filter(c => c.difficulty === 'beginner' || c.difficulty === 'easy')
  const index = seed % available.length
  return { id: available[index].id, date: today }
}
