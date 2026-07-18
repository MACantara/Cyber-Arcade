import { useQuery } from '@tanstack/react-query'
import { getChallenges } from '../services/api'

export const CHALLENGES_QUERY_KEY = ['challenges'] as const

export function useChallenges() {
  return useQuery({
    queryKey: CHALLENGES_QUERY_KEY,
    queryFn: getChallenges,
    staleTime: Infinity,
  })
}
