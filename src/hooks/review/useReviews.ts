import { useTeamPermissions } from '@/hooks/team/useTeamPermissions'
import { findMemberReview, getAverageRating } from '@/domain/reviewRules'
import { useCreateReviewMutation, useDeleteReviewMutation, useUpdateReviewMutation } from './mutations/useReviewMutations'
import { useReviewsQuery } from './queries/useReviewsQuery'
import type { ReviewRequest } from '@/types/review'

export function useReviews(teamId: string, teamRestaurantId: string) {
  const { currentMember } = useTeamPermissions(teamId)
  const { data: reviews = [], isLoading, isError } = useReviewsQuery(teamRestaurantId)
  const { mutate: create, isPending: isCreating } = useCreateReviewMutation(teamRestaurantId)
  const { mutate: update, isPending: isUpdating } = useUpdateReviewMutation(teamRestaurantId)
  const { mutate: remove, isPending: isDeleting } = useDeleteReviewMutation(teamRestaurantId)

  const currentUserReview = findMemberReview(reviews, currentMember?.id)
  const hasReview = currentUserReview !== undefined

  const createOrUpdateReview = (request: ReviewRequest, onDone?: () => void) => {
    const options = { onSuccess: onDone }
    if (currentUserReview) update({ reviewId: currentUserReview.id, request }, options)
    else create(request, options)
  }

  return {
    reviews,
    currentUserReview,
    currentMemberId: currentMember?.id,
    hasReview,
    averageRating: getAverageRating(reviews),
    isLoading,
    isError,
    isSaving: isCreating || isUpdating,
    isDeleting,
    createOrUpdateReview,
    deleteReview: (reviewId: string) => remove(reviewId),
  }
}
