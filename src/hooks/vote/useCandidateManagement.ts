import { useState } from 'react'
import { CANDIDATE_SOURCE } from '@/constants/vote'
import { useRestaurantSearchQuery } from '@/hooks/restaurant/queries/useRestaurantSearchQuery'
import { useAddCandidateMutation } from './mutations/useCandidateMutations'
import { useRecommendedCandidatesQuery } from './queries/useVoteQueries'

export function useCandidateManagement(teamId: string, sessionId: string, canAdd: boolean) {
  const [keyword, setKeyword] = useState('')
  const { data: recommended = [], isLoading: isRecommendedLoading } = useRecommendedCandidatesQuery(sessionId, canAdd)
  const { data: searchResults = [], isLoading: isSearching } = useRestaurantSearchQuery(keyword)
  const { mutate, isPending: isAdding } = useAddCandidateMutation(sessionId, teamId)

  return {
    keyword,
    setKeyword,
    recommended,
    searchResults,
    isRecommendedLoading,
    isSearching,
    isAdding,
    addCandidate: (restaurantId: string, onAdded?: () => void) =>
      mutate({ restaurantId, source: CANDIDATE_SOURCE.MANUAL }, { onSuccess: onAdded }),
    addRecommended: (restaurantId: string) => mutate({ restaurantId, source: CANDIDATE_SOURCE.RECOMMENDED }),
  }
}
