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
  currentMemberId: string | undefined
  hasReview: boolean
  isSaving: boolean
  isDeleting: boolean
  onSave: (request: ReviewRequest, onDone: () => void) => void
  onDelete: (reviewId: string) => void
}

export function ReviewSection({ reviews, currentUserReview, currentMemberId, hasReview, isSaving, isDeleting, onSave, onDelete }: ReviewSectionProps) {
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
        <div className="rounded-xl border bg-card p-4">
          <ReviewForm initialReview={currentUserReview} isSubmitting={isSaving} onSubmit={handleSave} onCancel={closeForm} />
        </div>
      )}
      {reviews.length === 0 ? (
        <EmptyState icon={MessageSquare} title="아직 리뷰가 없어요" description="첫 리뷰를 남겨 보세요." />
      ) : (
        <ul className="grid gap-3">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} isOwn={review.teamMemberId === currentMemberId} isDeleting={isDeleting} onEdit={handleOpenForm} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </section>
  )
}
