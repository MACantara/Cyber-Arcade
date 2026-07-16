(function () {

const db = window.CA.services.db
const store = window.CA.services.store
const gamify = window.CA.services.gamify
const { getLevel, computeXpForChallenge, updateStreak, checkBadges, pickDailyChallenge } = gamify

async function loadProfile() {
  let profile = await db.get('profiles', 'default')
  if (!profile) {
    const now = new Date().toISOString()
    profile = { id: 'default', name: 'Player 1', xp: 0, level: 1, streak: 0, lastActive: now, createdAt: now, updatedAt: now }
    await db.put('profiles', profile)
  } else {
    profile = updateStreak(profile)
    profile.updatedAt = new Date().toISOString()
    await db.put('profiles', profile)
  }
  store.merge({ profile: { ...profile, level: getLevel(profile.xp) } })
  return profile
}

async function loadProgress() {
  const progress = await db.getAll('progress')
  const progressMap = new Map(progress.map(p => [p.challengeId, p]))
  store.merge({ progress: progressMap })
  return progressMap
}

async function loadBadges() {
  const badges = await db.getAll('badges')
  const badgeSet = new Set(badges.map(b => b.id))
  store.merge({ badges: badgeSet })
  return badgeSet
}

async function loadSettings() {
  let settings = await db.get('settings', 'default')
  if (!settings) {
    settings = { id: 'default', theme: 'dark', sound: false, reducedMotion: false }
    await db.put('settings', settings)
  }
  store.merge({ settings })
  return settings
}

async function startChallenge(challenge) {
  const existing = await db.get('progress', challenge.id)
  if (existing && existing.status !== 'locked') return existing
  const record = {
    challengeId: challenge.id,
    status: 'started',
    attempts: 0,
    score: 0,
    hintsUsed: 0,
    domain: challenge.domain,
    startedAt: new Date().toISOString(),
    completedAt: null
  }
  await db.put('progress', record)
  const progress = new Map(store.get('progress') || [])
  progress.set(challenge.id, record)
  store.set('progress', progress)
  return record
}

async function completeChallenge(challenge, score, hintsUsed) {
  const started = await db.get('progress', challenge.id) || { challengeId: challenge.id, attempts: 0, hintsUsed: 0, domain: challenge.domain }
  started.attempts += 1
  started.score = Math.max(started.score || 0, score)
  started.hintsUsed = hintsUsed
  started.status = 'completed'
  started.completedAt = new Date().toISOString()
  await db.put('progress', started)

  const profile = await db.get('profiles', 'default')
  const xp = computeXpForChallenge(challenge.xp, score, hintsUsed)
  profile.xp += xp
  profile.level = getLevel(profile.xp)
  profile.updatedAt = new Date().toISOString()
  await db.put('profiles', profile)

  const progress = await db.getAll('progress')
  const earned = checkBadges(progress, profile)
  const existingBadges = new Set((await db.getAll('badges')).map(b => b.id))
  for (const b of earned) {
    if (!existingBadges.has(b.id)) {
      await db.put('badges', { ...b, earnedAt: new Date().toISOString() })
    }
  }

  const progressMap = new Map(progress.map(p => [p.challengeId, p]))
  const badgeSet = new Set((await db.getAll('badges')).map(b => b.id))
  store.merge({ profile: { ...profile, level: getLevel(profile.xp) }, progress: progressMap, badges: badgeSet })
  return { record: started, xp, profile }
}

async function useHint(challengeId) {
  const record = await db.get('progress', challengeId)
  if (!record) return null
  record.hintsUsed = (record.hintsUsed || 0) + 1
  await db.put('progress', record)
  const progress = new Map(store.get('progress') || [])
  progress.set(challengeId, record)
  store.set('progress', progress)
  return record
}

async function loadDaily(challenges) {
  let settings = await db.get('settings', 'default')
  const today = new Date().toISOString().slice(0, 10)
  if (!settings || settings.dailyChallengeDate !== today) {
    const daily = pickDailyChallenge(challenges)
    settings = { ...settings, dailyChallengeDate: today, dailyChallengeId: daily.id }
    await db.put('settings', settings)
  }
  store.set('dailyChallengeId', settings.dailyChallengeId)
  return settings.dailyChallengeId
}

function getChallengeStatus(challenge, progressMap) {
  const prerequisites = challenge.prerequisites || []
  if (prerequisites.length) {
    const locked = prerequisites.some(id => progressMap?.get(id)?.status !== 'completed')
    if (locked) return 'locked'
  }
  return progressMap?.get(challenge.id)?.status || 'available'
}

function getChallengeLockReason(challenge, progressMap) {
  const registry = window.CA?.registry
  const missing = (challenge.prerequisites || []).filter(id => progressMap?.get(id)?.status !== 'completed')
  if (!missing.length) return ''
  const names = missing.map(id => registry?.getById(id)?.title || id)
  return `Complete ${names.join(', ')} first.`
}

window.CA = window.CA || {}
window.CA.services = window.CA.services || {}
window.CA.services.progress = {
  loadProfile,
  loadProgress,
  loadBadges,
  loadSettings,
  startChallenge,
  completeChallenge,
  useHint,
  loadDaily,
  getChallengeStatus,
  getChallengeLockReason
}


})()
