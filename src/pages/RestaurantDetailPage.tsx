import { ArrowLeft, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { Rating } from '@/components/common/Rating'
import { ReviewSection } from '@/components/review/ReviewSection'
import { ROUTES, TEAM_TAB } from '@/constants/routes'
import { useRestaurantDetail } from '@/hooks/restaurant/useRestaurantDetail'

export function RestaurantDetailPage() {
  const { teamId = '', teamRestaurantId = '' } = useParams()
  const {
    restaurant, reviews, currentUserReview, currentMemberId, hasReview, averageRating,
    isLoading, isError, isSaving, isDeleting, createOrUpdateReview, deleteReview,
  } = useRestaurantDetail(teamId, teamRestaurantId)

  if (isLoading) return <ListSkeleton count={3} />
  if (isError || !restaurant) return <ErrorState message="식당을 찾을 수 없습니다." />

  const { name, category, address } = restaurant.restaurant

  return (
    <div className="space-y-6">
      <Link to={`${ROUTES.TEAM_DETAIL(teamId)}?tab=${TEAM_TAB.RESTAURANTS}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> 팀으로 돌아가기
      </Link>
      <section className="space-y-2 rounded-xl border bg-card p-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{name}</h1>
          <Badge variant="secondary">{category}</Badge>
        </div>
        <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-4" />{address}</p>
        <div className="flex items-center gap-3">
          <Rating value={averageRating} reviewCount={reviews.length} />
          <span className="text-xs text-muted-foreground">등록: {restaurant.registeredByNickname}</span>
        </div>
      </section>
      <ReviewSection
        reviews={reviews}
        currentUserReview={currentUserReview}
        currentMemberId={currentMemberId}
        hasReview={hasReview}
        isSaving={isSaving}
        isDeleting={isDeleting}
        onSave={createOrUpdateReview}
        onDelete={deleteReview}
      />
    </div>
  )
}
