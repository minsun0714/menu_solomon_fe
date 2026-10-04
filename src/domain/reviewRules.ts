import { MAX_RATING, MAX_REVIEW_LENGTH, MIN_RATING } from '@/constants/review'
import type { ReviewRequest } from '@/types/review'

export function findMyReview<T extends { isMine: boolean }>(reviews: T[]): T | undefined {
  return reviews.find(({ isMine }) => isMine)
}

export function getAverageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0
  const total = reviews.reduce((sum, { rating }) => sum + rating, 0)
  return Math.round((total / reviews.length) * 10) / 10
}

export function validateReview({ rating, content }: ReviewRequest): string | null {
  if (rating < MIN_RATING || rating > MAX_RATING) return '별점을 선택해 주세요.'
  if (content.trim().length === 0) return '리뷰 내용을 입력해 주세요.'
  if (content.length > MAX_REVIEW_LENGTH) return `리뷰는 ${MAX_REVIEW_LENGTH}자 이하로 작성해 주세요.`
  return null
}
