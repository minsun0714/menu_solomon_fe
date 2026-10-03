import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { restaurantService } from '@/services/restaurantService'

export function useRestaurantDetailQuery(teamRestaurantId: string) {
  return useQuery({
    queryKey: queryKeys.restaurant.detail(teamRestaurantId),
    queryFn: () => restaurantService.getRestaurantDetail(teamRestaurantId),
  })
}
