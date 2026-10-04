import { useState } from 'react'
import { CANDIDATE_SOURCE } from '@/constants/vote'
import { usePlaceSearchQuery } from '@/hooks/restaurant/queries/usePlaceSearchQuery'
import { useAddCandidateMutation } from './mutations/useCandidateMutations'
import { useRecommendedCandidatesQuery } from './queries/useVoteQueries'

export function useCandidateManagement(teamId: string, sessionId: string, canAdd: boolean, showRecommendations = false) {
  const [keyword, setKeyword] = useState('')
  const [recommendationPage, setRecommendationPage] = useState(0)
  const { data: recommended = [], isLoading: isRecommendedLoading, isFetching: isRecommendedFetching } =
    useRecommendedCandidatesQuery(teamId, sessionId, canAdd && showRecommendations, recommendationPage)
  const { data: searchPage, isLoading: isSearching } = usePlaceSearchQuery(keyword, 1)
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
    addCandidate: (kakaoPlaceId: string, onAdded?: () => void) =>
      mutate({ kakaoPlaceId, source: CANDIDATE_SOURCE.MANUAL }, { onSuccess: onAdded }),
    addRecommended: (kakaoPlaceId: string, onAdded?: () => void) =>
      mutate({ kakaoPlaceId, source: CANDIDATE_SOURCE.RECOMMENDED }, { onSuccess: onAdded }),
  }
}
