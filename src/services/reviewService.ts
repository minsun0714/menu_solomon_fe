import { api } from '@/lib/api'
import type { Review, ReviewRequest, ReviewWithAuthor } from '@/types/review'

const reviewPath = (teamId: string, teamRestaurantId: string) =>
  `/teams/${teamId}/restaurants/${teamRestaurantId}/reviews`

export const reviewService = {
  getReviews(teamId: string, teamRestaurantId: string): Promise<ReviewWithAuthor[]> {
    return api.get<ReviewWithAuthor[]>(reviewPath(teamId, teamRestaurantId))
  },

  /** 한 팀원당 한 식당에 리뷰 한 개. 신규는 201, 기존 리뷰는 덮어쓰기(200). */
  saveMyReview(teamId: string, teamRestaurantId: string, request: ReviewRequest): Promise<Review> {
    return api.put<Review>(`${reviewPath(teamId, teamRestaurantId)}/me`, request)
  },

  deleteMyReview(teamId: string, teamRestaurantId: string): Promise<void> {
    return api.delete(`${reviewPath(teamId, teamRestaurantId)}/me`)
  },
}
