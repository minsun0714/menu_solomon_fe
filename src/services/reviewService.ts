import { validateReview } from '@/domain/reviewRules'
import { ApiError } from '@/mocks/api/errors'
import { db, findOrThrow, getMemberNickname, getMyMember, nextId, simulateLatency } from '@/mocks/api/db'
import type { Review, ReviewRequest, ReviewWithAuthor } from '@/types/review'

function assertValid(request: ReviewRequest) {
  const message = validateReview(request)
  if (message) throw new ApiError('BAD_REQUEST', message)
}

function getOwnReview(reviewId: string): Review {
  const review = findOrThrow(db.reviews.find(({ id }) => id === reviewId), '리뷰를 찾을 수 없습니다.')
  const teamRestaurant = findOrThrow(db.teamRestaurants.find(({ id }) => id === review.teamRestaurantId), '식당을 찾을 수 없습니다.')
  if (getMyMember(teamRestaurant.teamId).id !== review.teamMemberId) {
    throw new ApiError('FORBIDDEN', '본인의 리뷰만 수정할 수 있습니다.')
  }
  return review
}

export const reviewService = {
  getReviews(teamRestaurantId: string): Promise<ReviewWithAuthor[]> {
    return simulateLatency(() => {
      const teamRestaurant = findOrThrow(db.teamRestaurants.find(({ id }) => id === teamRestaurantId), '식당을 찾을 수 없습니다.')
      getMyMember(teamRestaurant.teamId)
      return db.reviews
        .filter((review) => review.teamRestaurantId === teamRestaurantId)
        .map((review) => ({ ...review, authorNickname: getMemberNickname(review.teamMemberId) }))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    })
  },

  createReview(teamRestaurantId: string, request: ReviewRequest): Promise<Review> {
    return simulateLatency(() => {
      assertValid(request)
      const teamRestaurant = findOrThrow(db.teamRestaurants.find(({ id }) => id === teamRestaurantId), '식당을 찾을 수 없습니다.')
      const me = getMyMember(teamRestaurant.teamId)
      if (db.reviews.some((r) => r.teamRestaurantId === teamRestaurantId && r.teamMemberId === me.id)) {
        throw new ApiError('CONFLICT', '이미 리뷰를 작성했습니다.')
      }
      const now = new Date().toISOString()
      const review: Review = { id: nextId('rv'), teamRestaurantId, teamMemberId: me.id, ...request, createdAt: now, updatedAt: now }
      db.reviews.push(review)
      return review
    })
  },

  updateReview(reviewId: string, request: ReviewRequest): Promise<Review> {
    return simulateLatency(() => {
      assertValid(request)
      const review = getOwnReview(reviewId)
      Object.assign(review, request, { updatedAt: new Date().toISOString() })
      return review
    })
  },

  deleteReview(reviewId: string): Promise<void> {
    return simulateLatency(() => {
      getOwnReview(reviewId)
      db.reviews = db.reviews.filter(({ id }) => id !== reviewId)
    })
  },
}
