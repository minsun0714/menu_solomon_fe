import { useEffect, useRef, useState } from 'react'
import { CANDIDATE_SOURCE } from '@/constants/vote'
import { ALL_CATEGORIES, RESTAURANT_SORT } from '@/domain/restaurantRules'
import { usePlaceSearchQuery } from '@/hooks/restaurant/queries/usePlaceSearchQuery'
import { useTeamRestaurantsQuery } from '@/hooks/restaurant/queries/useTeamRestaurantsQuery'
import { useAddCandidateMutation } from './mutations/useCandidateMutations'
import { useRecommendedCandidatesQuery } from './queries/useVoteQueries'
import { analytics } from '@/lib/analytics'

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
  const [submittedKakaoKeyword, setSubmittedKakaoKeyword] = useState('')
  const trackedKakaoKeyword = useRef('')
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
  const { data: searchPage, isFetching: isSearching } = usePlaceSearchQuery(isKakaoPickerOpen ? submittedKakaoKeyword : '', 1)
  const { mutate, isPending: isAdding } = useAddCandidateMutation(sessionId, teamId)

  useEffect(() => {
    if (!searchPage || isSearching || !submittedKakaoKeyword || trackedKakaoKeyword.current === submittedKakaoKeyword) return
    trackedKakaoKeyword.current = submittedKakaoKeyword
    analytics.track('menu_search_performed', {
      search_query: submittedKakaoKeyword,
      results_count: searchPage.totalCount,
      search_mode: 'restaurants',
      is_autocomplete_used: false,
    })
  }, [isSearching, searchPage, submittedKakaoKeyword])

  return {
    keyword,
    setKeyword,
    submittedKakaoKeyword,
    recommended,
    teamRestaurants: teamRestaurantPage?.restaurants ?? [],
    searchResults: searchPage?.items ?? [],
    isRecommendedLoading,
    isRecommendedFetching,
    isSearching,
    isTeamRestaurantsLoading,
    isAdding,
    submitKakaoSearch: () => setSubmittedKakaoKeyword(keyword.trim()),
    resetSearch: () => {
      setKeyword('')
      setSubmittedKakaoKeyword('')
      trackedKakaoKeyword.current = ''
    },
    refreshRecommendations: () => setRecommendationPage((page) => page + 1),
    addCandidate: (kakaoPlaceId: string, onAdded?: () => void) =>
      mutate({ kakaoPlaceId, source: CANDIDATE_SOURCE.MANUAL }, { onSuccess: onAdded }),
    addRecommended: (kakaoPlaceId: string, onAdded?: () => void) =>
      mutate({ kakaoPlaceId, source: CANDIDATE_SOURCE.RECOMMENDED }, { onSuccess: onAdded }),
  }
}
