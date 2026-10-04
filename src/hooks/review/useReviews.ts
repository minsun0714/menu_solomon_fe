import { findMyReview, getAverageRating } from '@/domain/reviewRules'
import { useCreateReviewMutation, useDeleteReviewMutation, useUpdateReviewMutation } from './mutations/useReviewMutations'
import { useReviewsQuery } from './queries/useReviewsQuery'
import type { ReviewRequest } from '@/types/review'

export function useReviews(teamId: string, teamRestaurantId: string, enabled = true) {
  const { data: reviews = [], isLoading, isError } = useReviewsQuery(teamId, teamRestaurantId, enabled)
  const { mutate: create, isPending: isCreating } = useCreateReviewMutation(teamId, teamRestaurantId)
  const { mutate: update, isPending: isUpdating } = useUpdateReviewMutation(teamId, teamRestaurantId)
  const { mutate: remove, isPending: isDeleting } = useDeleteReviewMutation(teamId, teamRestaurantId)

  const currentUserReview = findMyReview(reviews)
  const hasReview = currentUserReview !== undefined

  const createOrUpdateReview = (request: ReviewRequest, onDone?: () => void) => {
    const options = { onSuccess: onDone }
    if (hasReview) update(request, options)
    else create(request, options)
  }

  return {
    reviews,
    currentUserReview,
    hasReview,
    averageRating: getAverageRating(reviews),
    isLoading,
    isError,
    isSaving: isCreating || isUpdating,
    isDeleting,
    createOrUpdateReview,
    deleteReview: () => remove(),
  }
}
