import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Rating } from '@/components/common/Rating'
import { DIALOG_MESSAGES } from '@/constants/messages'
import { formatDate } from '@/lib/date'
import type { ReviewWithAuthor } from '@/types/review'

type ReviewItemProps = {
  review: ReviewWithAuthor
  isOwn: boolean
  isDeleting: boolean
  onEdit: () => void
  onDelete: (reviewId: string) => void
}

export function ReviewItem({ review, isOwn, isDeleting, onEdit, onDelete }: ReviewItemProps) {
  const { id, authorNickname, rating, content, createdAt } = review

  return (
    <li className="space-y-1.5 px-1 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{authorNickname}{isOwn && ' (나)'}</span>
          <Rating value={rating} />
          <span className="text-xs text-muted-foreground">{formatDate(createdAt)}</span>
        </div>
        {isOwn && (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="size-8" aria-label="리뷰 수정" onClick={onEdit}><Pencil /></Button>
            <ConfirmDialog
              trigger={<Button variant="ghost" size="icon" className="size-8" disabled={isDeleting} aria-label="리뷰 삭제"><Trash2 /></Button>}
              message={DIALOG_MESSAGES.DELETE_REVIEW}
              onConfirm={() => onDelete(id)}
            />
          </div>
        )}
      </div>
      <p className="text-sm">{content}</p>
    </li>
  )
}
