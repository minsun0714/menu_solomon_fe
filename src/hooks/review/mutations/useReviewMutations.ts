import { TOAST_MESSAGES } from '@/constants/messages'
import { useAppMutation } from '@/hooks/shared/useAppMutation'
import { queryKeys } from '@/queries/queryKeys'
import { reviewService } from '@/services/reviewService'
import { analytics } from '@/lib/analytics'
import type { ReviewRequest } from '@/types/review'

function reviewInvalidation(teamId: string, teamRestaurantId: string) {
  return () => [queryKeys.review.list(teamId, teamRestaurantId), queryKeys.restaurant.all]
}

export function useCreateReviewMutation(teamId: string, teamRestaurantId: string) {
  return useAppMutation({
    mutationFn: (request: ReviewRequest) => reviewService.saveMyReview(teamId, teamRestaurantId, request),
    invalidateKeys: reviewInvalidation(teamId, teamRestaurantId),
    trackSuccess: (review) => analytics.track('review_saved', {
      team_id: teamId,
      team_restaurant_id: teamRestaurantId,
      review_id: review.id,
      rating: review.rating,
      operation: 'created',
    }),
    successMessage: TOAST_MESSAGES.REVIEW_CREATED,
  })
}

export function useUpdateReviewMutation(teamId: string, teamRestaurantId: string) {
  return useAppMutation({
    mutationFn: (request: ReviewRequest) => reviewService.saveMyReview(teamId, teamRestaurantId, request),
    invalidateKeys: reviewInvalidation(teamId, teamRestaurantId),
    trackSuccess: (review) => analytics.track('review_saved', {
      team_id: teamId,
      team_restaurant_id: teamRestaurantId,
      review_id: review.id,
      rating: review.rating,
      operation: 'updated',
    }),
    successMessage: TOAST_MESSAGES.REVIEW_UPDATED,
  })
}

export function useDeleteReviewMutation(teamId: string, teamRestaurantId: string) {
  return useAppMutation({
    mutationFn: () => reviewService.deleteMyReview(teamId, teamRestaurantId),
    invalidateKeys: reviewInvalidation(teamId, teamRestaurantId),
    successMessage: TOAST_MESSAGES.REVIEW_DELETED,
  })
}
