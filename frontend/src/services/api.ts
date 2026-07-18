import type { ChallengeManifest, Domain, DailyChallenge } from '../types'

const BASE = ''

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(`${BASE}${url}`)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  return response.json()
}

export function getChallenges(): Promise<ChallengeManifest[]> {
  return fetchJson('/api/challenges')
}

export function getChallenge(id: string): Promise<ChallengeManifest> {
  return fetchJson(`/api/challenges/${id}`)
}

export function getDomains(): Promise<Domain[]> {
  return fetchJson('/api/domains')
}

export function getDaily(): Promise<DailyChallenge> {
  return fetchJson('/api/daily')
}
