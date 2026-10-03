import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { reviewService } from '@/services/reviewService'

export function useReviewsQuery(teamRestaurantId: string, enabled = true) {
  return useQuery({ queryKey: queryKeys.review.list(teamRestaurantId), queryFn: () => reviewService.getReviews(teamRestaurantId), enabled })
}
