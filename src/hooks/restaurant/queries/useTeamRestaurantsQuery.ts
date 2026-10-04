import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { restaurantService } from '@/services/restaurantService'
import { ALL_CATEGORIES, type RestaurantSort } from '@/domain/restaurantRules'

export function useTeamRestaurantsQuery(teamId: string, keyword = '', category = ALL_CATEGORIES, sort?: RestaurantSort) {
  return useQuery({
    queryKey: queryKeys.restaurant.list(teamId, keyword, category, sort),
    queryFn: () => restaurantService.getTeamRestaurants(teamId, keyword, category, sort),
  })
}
