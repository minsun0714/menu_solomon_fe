import { useState } from 'react'
import { CANDIDATE_SOURCE } from '@/constants/vote'
import { useRestaurantSearchQuery } from '@/hooks/restaurant/queries/useRestaurantSearchQuery'
import { useAddCandidateMutation } from './mutations/useCandidateMutations'
import { useRecommendedCandidatesQuery } from './queries/useVoteQueries'

export function useCandidateManagement(teamId: string, sessionId: string, canAdd: boolean, showRecommendations = false) {
  const [keyword, setKeyword] = useState('')
  const [recommendationPage, setRecommendationPage] = useState(0)
  const { data: recommended = [], isLoading: isRecommendedLoading, isFetching: isRecommendedFetching } =
    useRecommendedCandidatesQuery(sessionId, canAdd && showRecommendations, recommendationPage)
  const { data: searchPage, isLoading: isSearching } = useRestaurantSearchQuery(keyword, 1)
  const { mutate, isPending: isAdding } = useAddCandidateMutation(sessionId, teamId)

  return {
    keyword,
    setKeyword,
    recommended,
    searchResults: searchPage?.items ?? [],
    isRecommendedLoading,
    isRecommendedFetching,
    isSearching,
    isAdding,
    refreshRecommendations: () => setRecommendationPage((page) => page + 1),
    addCandidate: (restaurantId: string, onAdded?: () => void) =>
      mutate({ restaurantId, source: CANDIDATE_SOURCE.MANUAL }, { onSuccess: onAdded }),
    addRecommended: (restaurantId: string, onAdded?: () => void) =>
      mutate({ restaurantId, source: CANDIDATE_SOURCE.RECOMMENDED }, { onSuccess: onAdded }),
  }
}
