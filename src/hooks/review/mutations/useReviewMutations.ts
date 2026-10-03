import { TOAST_MESSAGES } from '@/constants/messages'
import { useAppMutation } from '@/hooks/shared/useAppMutation'
import { queryKeys } from '@/queries/queryKeys'
import { reviewService } from '@/services/reviewService'
import type { ReviewRequest } from '@/types/review'

type UpdateReviewVariables = { reviewId: string; request: ReviewRequest }

export function useCreateReviewMutation(teamRestaurantId: string) {
  return useAppMutation({
    mutationFn: (request: ReviewRequest) => reviewService.createReview(teamRestaurantId, request),
    invalidateKeys: () => [queryKeys.review.list(teamRestaurantId), queryKeys.restaurant.all],
    successMessage: TOAST_MESSAGES.REVIEW_CREATED,
  })
}

export function useUpdateReviewMutation(teamRestaurantId: string) {
  return useAppMutation({
    mutationFn: ({ reviewId, request }: UpdateReviewVariables) => reviewService.updateReview(reviewId, request),
    invalidateKeys: () => [queryKeys.review.list(teamRestaurantId), queryKeys.restaurant.all],
    successMessage: TOAST_MESSAGES.REVIEW_UPDATED,
  })
}

export function useDeleteReviewMutation(teamRestaurantId: string) {
  return useAppMutation({
    mutationFn: (reviewId: string) => reviewService.deleteReview(reviewId),
    invalidateKeys: () => [queryKeys.review.list(teamRestaurantId), queryKeys.restaurant.all],
    successMessage: TOAST_MESSAGES.REVIEW_DELETED,
  })
}
