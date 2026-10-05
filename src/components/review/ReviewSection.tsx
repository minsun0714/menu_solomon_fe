import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { TOAST_MESSAGES } from '@/constants/messages'
import { ReviewForm } from './ReviewForm'
import { ReviewItem } from './ReviewItem'
import type { Review, ReviewRequest, ReviewWithAuthor } from '@/types/review'

type ReviewSectionProps = {
  reviews: ReviewWithAuthor[]
  currentUserReview: Review | undefined
  hasReview: boolean
  isSaving: boolean
  isDeleting: boolean
  onSave: (request: ReviewRequest, onDone: () => void) => void
  onDelete: (reviewId: string) => void
}

export function ReviewSection({ reviews, currentUserReview, hasReview, isSaving, isDeleting, onSave, onDelete }: ReviewSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const closeForm = () => setIsFormOpen(false)

  const handleOpenForm = () => {
    if (hasReview) toast.info(TOAST_MESSAGES.REVIEW_ALREADY_EXISTS)
    setIsFormOpen(true)
  }
  const handleSave = (request: ReviewRequest) => onSave(request, closeForm)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">리뷰 {reviews.length}</h2>
        {!isFormOpen && <Button size="sm" onClick={handleOpenForm}>{hasReview ? '내 리뷰 수정' : '리뷰 작성'}</Button>}
      </div>
      {isFormOpen && (
        <div className="rounded-md border bg-card p-4">
          <ReviewForm initialReview={currentUserReview} isSubmitting={isSaving} onSubmit={handleSave} onCancel={closeForm} />
        </div>
      )}
      {reviews.length === 0 ? (
        <EmptyState icon={MessageSquare} title="등록된 리뷰가 없습니다." />
      ) : (
        <ul className="divide-y border-y">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} isOwn={review.isMine} isDeleting={isDeleting} onEdit={handleOpenForm} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </section>
  )
}
