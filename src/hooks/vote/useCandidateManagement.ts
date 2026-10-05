import { useState } from 'react'
import { CANDIDATE_SOURCE } from '@/constants/vote'
import { ALL_CATEGORIES, RESTAURANT_SORT } from '@/domain/restaurantRules'
import { usePlaceSearchQuery } from '@/hooks/restaurant/queries/usePlaceSearchQuery'
import { useTeamRestaurantsQuery } from '@/hooks/restaurant/queries/useTeamRestaurantsQuery'
import { useAddCandidateMutation } from './mutations/useCandidateMutations'
import { useRecommendedCandidatesQuery } from './queries/useVoteQueries'

export type CandidateSourceTab = 'TEAM' | 'KAKAO'

export function useCandidateManagement(
  teamId: string,
  sessionId: string,
  canAdd: boolean,
  showRecommendations = false,
  pickerOpen = false,
  sourceTab: CandidateSourceTab = 'TEAM',
) {
  const [keyword, setKeyword] = useState('')
  const [recommendationPage, setRecommendationPage] = useState(0)
  const { data: recommended = [], isLoading: isRecommendedLoading, isFetching: isRecommendedFetching } =
    useRecommendedCandidatesQuery(teamId, sessionId, canAdd && showRecommendations, recommendationPage)
  const isTeamPickerOpen = canAdd && pickerOpen && sourceTab === 'TEAM'
  const isKakaoPickerOpen = canAdd && pickerOpen && sourceTab === 'KAKAO'
  const { data: teamRestaurantPage, isLoading: isTeamRestaurantsLoading } = useTeamRestaurantsQuery(
    teamId,
    isTeamPickerOpen ? keyword : '',
    ALL_CATEGORIES,
    RESTAURANT_SORT.RATING_DESC,
    isTeamPickerOpen,
  )
  const { data: searchPage, isLoading: isSearching } = usePlaceSearchQuery(isKakaoPickerOpen ? keyword : '', 1)
  const { mutate, isPending: isAdding } = useAddCandidateMutation(sessionId, teamId)

  return {
    keyword,
    setKeyword,
    recommended,
    teamRestaurants: teamRestaurantPage?.restaurants ?? [],
    searchResults: searchPage?.items ?? [],
    isRecommendedLoading,
    isRecommendedFetching,
    isSearching,
    isTeamRestaurantsLoading,
    isAdding,
    refreshRecommendations: () => setRecommendationPage((page) => page + 1),
    addCandidate: (kakaoPlaceId: string, onAdded?: () => void) =>
      mutate({ kakaoPlaceId, source: CANDIDATE_SOURCE.MANUAL }, { onSuccess: onAdded }),
    addRecommended: (kakaoPlaceId: string, onAdded?: () => void) =>
      mutate({ kakaoPlaceId, source: CANDIDATE_SOURCE.RECOMMENDED }, { onSuccess: onAdded }),
  }
}
