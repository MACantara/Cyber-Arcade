import { useEffect, useState } from 'react'
import { loadProfile, loadProgress, loadBadges, loadSettings, loadDaily } from '../services/progress'
import { getChallenges } from '../services/api'

export function useInitState() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true

    async function init() {
      await Promise.all([loadProfile(), loadProgress(), loadBadges(), loadSettings()])
      try {
        const challenges = await getChallenges()
        await loadDaily(challenges)
      } catch (err) {
        console.warn('Failed to load daily challenge from API:', err)
      }
      if (mounted) setReady(true)
    }

    init()
    return () => {
      mounted = false
    }
  }, [])

  return ready
}
