import { useState, type ReactNode } from 'react'
import { MessageSquare } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { Rating } from '@/components/common/Rating'
import { useReviewsQuery } from '@/hooks/review/queries/useReviewsQuery'
import { formatDate } from '@/lib/date'

type RestaurantReviewsDialogProps = {
  teamRestaurantId: string
  restaurantName: string
  reviewCount: number
  trigger: ReactNode
}

export function RestaurantReviewsDialog({ teamRestaurantId, restaurantName, reviewCount, trigger }: RestaurantReviewsDialogProps) {
  const [open, setOpen] = useState(false)
  const { data: reviews = [], isLoading, isError } = useReviewsQuery(teamRestaurantId, open)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{restaurantName} 리뷰</DialogTitle>
          <DialogDescription>팀원들이 남긴 리뷰 {reviewCount}개를 확인해 보세요.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <ListSkeleton count={3} itemClassName="h-24" />
        ) : isError ? (
          <p className="py-8 text-center text-sm text-destructive">리뷰를 불러오지 못했습니다.</p>
        ) : reviews.length === 0 ? (
          <EmptyState icon={MessageSquare} title="아직 리뷰가 없어요" />
        ) : (
          <ul className="grid max-h-[60vh] gap-3 overflow-y-auto pr-1">
            {reviews.map(({ id, authorNickname, rating, content, createdAt }) => (
              <li key={id} className="space-y-2 rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{authorNickname}</span>
                    <Rating value={rating} />
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(createdAt)}</span>
                </div>
                <p className="text-sm leading-relaxed">{content}</p>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
