import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { restaurantService } from '@/services/restaurantService'

export function useTeamRestaurantsQuery(teamId: string) {
  return useQuery({ queryKey: queryKeys.restaurant.list(teamId), queryFn: () => restaurantService.getTeamRestaurants(teamId) })
}
