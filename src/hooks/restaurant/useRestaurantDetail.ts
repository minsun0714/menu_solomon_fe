import { useReviews } from '@/hooks/review/useReviews'
import { useRestaurantDetailQuery } from './queries/useRestaurantDetailQuery'

export function useRestaurantDetail(teamId: string, teamRestaurantId: string) {
  const { data: restaurant, isLoading: isRestaurantLoading, isError: isRestaurantError } = useRestaurantDetailQuery(teamRestaurantId)
  const reviewState = useReviews(teamId, teamRestaurantId)

  return {
    restaurant,
    ...reviewState,
    isLoading: isRestaurantLoading || reviewState.isLoading,
    isError: isRestaurantError || reviewState.isError,
  }
}
