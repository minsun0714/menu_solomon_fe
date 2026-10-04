import { useState } from 'react'
import { MAX_RATING } from '@/constants/review'
import { validateReview } from '@/domain/reviewRules'
import type { Review, ReviewRequest } from '@/types/review'

type UseReviewFormParams = {
  initialReview?: Review
  onSubmit: (request: ReviewRequest) => void
}

export function useReviewForm({ initialReview, onSubmit }: UseReviewFormParams) {
  const [rating, setRating] = useState(initialReview?.rating ?? MAX_RATING)
  const [content, setContent] = useState(initialReview?.content ?? '')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    const request = { rating, content: content.trim() }
    const validationError = validateReview(request)
    setError(validationError)
    if (!validationError) onSubmit(request)
  }

  return { rating, content, error, setRating, setContent, handleSubmit }
}
