import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MAX_REVIEW_LENGTH } from '@/constants/review'
import { useReviewForm } from '@/hooks/review/useReviewForm'
import { StarRatingInput } from './StarRatingInput'
import type { Review, ReviewRequest } from '@/types/review'

type ReviewFormProps = {
  initialReview?: Review
  isSubmitting: boolean
  onSubmit: (request: ReviewRequest) => void
  onCancel?: () => void
}

export function ReviewForm({ initialReview, isSubmitting, onSubmit, onCancel }: ReviewFormProps) {
  const { rating, content, error, setRating, setContent, handleSubmit } = useReviewForm({ initialReview, onSubmit })

  return (
    <div className="grid gap-3">
      <StarRatingInput value={rating} onChange={setRating} />
      <Textarea
        value={content}
        maxLength={MAX_REVIEW_LENGTH}
        placeholder="이 식당은 어땠나요?"
        aria-label="리뷰 내용"
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{content.length}/{MAX_REVIEW_LENGTH}</span>
        <div className="flex gap-2">
          {onCancel && <Button variant="outline" size="sm" onClick={onCancel}>취소</Button>}
          <Button size="sm" disabled={isSubmitting} onClick={handleSubmit}>{initialReview ? '리뷰 수정' : '리뷰 등록'}</Button>
        </div>
      </div>
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
