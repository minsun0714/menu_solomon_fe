import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { reviewService } from '@/services/reviewService'

export function useReviewsQuery(teamId: string, teamRestaurantId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.review.list(teamId, teamRestaurantId),
    queryFn: () => reviewService.getReviews(teamId, teamRestaurantId),
    enabled,
  })
}
