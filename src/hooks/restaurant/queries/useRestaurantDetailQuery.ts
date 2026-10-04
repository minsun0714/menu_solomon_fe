import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { restaurantService } from '@/services/restaurantService'

export function useRestaurantDetailQuery(teamId: string, teamRestaurantId: string) {
  return useQuery({
    queryKey: queryKeys.restaurant.detail(teamId, teamRestaurantId),
    queryFn: () => restaurantService.getRestaurantDetail(teamId, teamRestaurantId),
  })
}
