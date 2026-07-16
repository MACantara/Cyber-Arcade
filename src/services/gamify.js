(function () {

const XP_PER_LEVEL = 1000

function getLevel(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

function getLevelProgress(xp) {
  const level = getLevel(xp)
  const current = (level - 1) * XP_PER_LEVEL
  const next = level * XP_PER_LEVEL
  return { level, current, next, remainder: xp - current, percentage: ((xp - current) / XP_PER_LEVEL) * 100 }
}

function computeXpForChallenge(base, score, hintsUsed) {
  const hintPenalty = hintsUsed * 50
  const scoreBonus = Math.round((score / 100) * base)
  return Math.max(0, scoreBonus - hintPenalty)
}

function updateStreak(profile, { activity = false } = {}) {
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

const DOMAINS = window.CA?.DOMAINS || []

const DOMAIN_BADGE_NAMES = {
  web: { id: 'web-hunter', name: 'Web Hunter' },
  network: { id: 'network-ninja', name: 'Network Ninja' },
  crypto: { id: 'crypto-cracker', name: 'Crypto Cracker' }
}

const DOMAIN_BADGES = DOMAINS
  .filter(d => d.id !== 'general')
  .map(d => {
    const preset = DOMAIN_BADGE_NAMES[d.id] || { id: `${d.id}-hunter`, name: `${d.label} Hunter` }
    return {
      id: preset.id,
      name: preset.name,
      description: `Complete 2 ${d.label} challenges.`,
      domain: d.id,
      check: (p) => (p[`${d.id}Count`] || 0) >= 2
    }
  })

const GENERAL_BADGES = [
  { id: 'first-blood', name: 'First Blood', description: 'Complete your first challenge.', domain: 'general', check: (p) => p.completedCount >= 1 },
  { id: 'perfect-score', name: 'Perfect Score', description: 'Complete a challenge with 100 points.', domain: 'general', check: (p) => p.hasPerfectScore },
  { id: 'streak-3', name: 'Three Day Streak', description: 'Keep a 3-day streak.', domain: 'general', check: (p) => p.streak >= 3 },
  { id: 'hint-master', name: 'Hint Master', description: 'Complete 5 challenges without hints.', domain: 'general', check: (p) => p.noHintCount >= 5 }
]

const BADGES = [...GENERAL_BADGES, ...DOMAIN_BADGES]

function checkBadges(progress, profile) {
  const domainIds = (window.CA?.DOMAINS || []).map(d => d.id)
  const counts = { completedCount: 0, hasPerfectScore: false, noHintCount: 0, streak: profile.streak || 0 }
  for (const d of domainIds) {
    counts[`${d}Count`] = 0
  }
  for (const p of progress) {
    if (p.status !== 'completed') continue
    counts.completedCount++
    if (p.score === 100) counts.hasPerfectScore = true
    if (p.hintsUsed === 0) counts.noHintCount++
    if (domainIds.includes(p.domain)) {
      counts[`${p.domain}Count`] = (counts[`${p.domain}Count`] || 0) + 1
    }
  }
  return BADGES.filter(b => b.check(counts))
}

function pickDailyChallenge(challenges) {
  const today = new Date().toISOString().slice(0, 10)
  const seed = today.split('-').reduce((a, b) => a + parseInt(b, 10), 0)
  const available = challenges.filter(c => c.difficulty === 'beginner' || c.difficulty === 'easy')
  const index = seed % available.length
  return { id: available[index].id, date: today }
}

window.CA = window.CA || {}
window.CA.services = window.CA.services || {}
window.CA.services.gamify = {
  getLevel,
  getLevelProgress,
  computeXpForChallenge,
  updateStreak,
  BADGES,
  checkBadges,
  pickDailyChallenge
}


})()
