import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { restaurantService } from '@/services/restaurantService'

export function useRestaurantSearchQuery(keyword: string, page: number) {
  return useQuery({
    queryKey: queryKeys.restaurant.search(keyword, page),
    queryFn: () => restaurantService.searchRestaurants(keyword, page),
    enabled: keyword.trim().length > 0,
    placeholderData: (previousData) => previousData,
  })
}
