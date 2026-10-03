import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { restaurantService } from '@/services/restaurantService'

export function useRestaurantSearchQuery(keyword: string) {
  return useQuery({
    queryKey: queryKeys.restaurant.search(keyword),
    queryFn: () => restaurantService.searchMockRestaurants(keyword),
  })
}
