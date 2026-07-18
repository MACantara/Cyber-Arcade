export interface Domain {
  id: string
  label: string
  color: string
  description: string
}

export interface ChallengeManifest {
  id: string
  title: string
  domain: string
  difficulty: 'beginner' | 'easy' | 'medium' | 'hard'
  description: string
  xp: number
  objective: string
  hints: string[]
  successCriteria: string | string[]
  prerequisites?: string[]
}

export interface Progress {
  challengeId: string
  status: 'available' | 'started' | 'completed' | 'locked'
  attempts: number
  score: number
  hintsUsed: number
  domain?: string
  startedAt: string | null
  completedAt: string | null
}

export interface Profile {
  id: string
  name: string
  xp: number
  level: number
  streak: number
  lastActive: string
  createdAt: string
  updatedAt: string
}

export interface Badge {
  id: string
  name: string
  description: string
  domain?: string
  icon?: string
  earnedAt: string
}

export interface Settings {
  id: string
  theme: 'dark' | 'light' | 'high-contrast'
  sound: boolean
  reducedMotion: boolean
  dailyChallengeDate: string | null
  dailyChallengeId: string | null
}

export interface DailyChallenge {
  id: string
  date: string
}
