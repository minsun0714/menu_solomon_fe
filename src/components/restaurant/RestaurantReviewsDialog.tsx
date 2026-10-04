import { useState, type ReactNode } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { ReviewSection } from '@/components/review/ReviewSection'
import { useReviews } from '@/hooks/review/useReviews'

type RestaurantReviewsDialogProps = {
  teamId: string
  teamRestaurantId: string
  restaurantName: string
  reviewCount: number
  trigger: ReactNode
}

export function RestaurantReviewsDialog({ teamId, teamRestaurantId, restaurantName, reviewCount, trigger }: RestaurantReviewsDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{restaurantName} 리뷰</DialogTitle>
          <DialogDescription>팀원들이 남긴 리뷰 {reviewCount}개를 확인해 보세요.</DialogDescription>
        </DialogHeader>
        <RestaurantReviewsContent teamId={teamId} teamRestaurantId={teamRestaurantId} enabled={open} />
      </DialogContent>
    </Dialog>
  )
}

type RestaurantReviewsContentProps = {
  teamId: string
  teamRestaurantId: string
  enabled: boolean
}

function RestaurantReviewsContent({ teamId, teamRestaurantId, enabled }: RestaurantReviewsContentProps) {
  const {
    reviews, currentUserReview, hasReview, isLoading, isError,
    isSaving, isDeleting, createOrUpdateReview, deleteReview,
  } = useReviews(teamId, teamRestaurantId, enabled)

  if (isLoading) return <ListSkeleton count={3} itemClassName="h-24" />
  if (isError) return <p className="py-8 text-center text-sm text-destructive">리뷰를 불러오지 못했습니다.</p>

  return <ReviewSection
    reviews={reviews}
    currentUserReview={currentUserReview}
    hasReview={hasReview}
    isSaving={isSaving}
    isDeleting={isDeleting}
    onSave={createOrUpdateReview}
    onDelete={deleteReview}
  />
}
