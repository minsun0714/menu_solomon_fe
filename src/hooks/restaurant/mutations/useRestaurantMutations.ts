import { TOAST_MESSAGES } from '@/constants/messages'
import { useAppMutation } from '@/hooks/shared/useAppMutation'
import { queryKeys } from '@/queries/queryKeys'
import { restaurantService } from '@/services/restaurantService'

export function useAddTeamRestaurantMutation(teamId: string) {
  return useAppMutation({
    mutationFn: (kakaoPlaceId: string) => restaurantService.addTeamRestaurant(teamId, kakaoPlaceId),
    invalidateKeys: () => [queryKeys.restaurant.list(teamId)],
    successMessage: TOAST_MESSAGES.RESTAURANT_ADDED,
  })
}

export function useDeleteTeamRestaurantMutation(teamId: string) {
  return useAppMutation({
    mutationFn: (teamRestaurantId: string) => restaurantService.deleteTeamRestaurant(teamId, teamRestaurantId),
    invalidateKeys: () => [queryKeys.restaurant.list(teamId), queryKeys.review.all],
    successMessage: TOAST_MESSAGES.RESTAURANT_REMOVED,
  })
}
