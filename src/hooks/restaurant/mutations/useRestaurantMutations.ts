import { TOAST_MESSAGES } from '@/constants/messages'
import { useAppMutation } from '@/hooks/shared/useAppMutation'
import { queryKeys } from '@/queries/queryKeys'
import { restaurantService } from '@/services/restaurantService'
import { analytics } from '@/lib/analytics'

export function useAddTeamRestaurantMutation(teamId: string) {
  return useAppMutation({
    mutationFn: (kakaoPlaceId: string) => restaurantService.addTeamRestaurant(teamId, kakaoPlaceId),
    invalidateKeys: () => [queryKeys.restaurant.lists(teamId)],
    trackSuccess: ({ id }) => analytics.track('restaurant_added', {
      team_id: teamId,
      restaurant_id: id,
      source: 'kakao_search',
    }),
    successMessage: TOAST_MESSAGES.RESTAURANT_ADDED,
  })
}

export function useDeleteTeamRestaurantMutation(teamId: string) {
  return useAppMutation({
    mutationFn: (teamRestaurantId: string) => restaurantService.deleteTeamRestaurant(teamId, teamRestaurantId),
    invalidateKeys: () => [queryKeys.restaurant.lists(teamId), queryKeys.review.all],
    successMessage: TOAST_MESSAGES.RESTAURANT_REMOVED,
  })
}
