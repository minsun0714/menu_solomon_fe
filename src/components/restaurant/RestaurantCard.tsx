import { MapPin, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Rating } from '@/components/common/Rating'
import { DIALOG_MESSAGES } from '@/constants/messages'
import type { TeamRestaurantSummary } from '@/types/restaurant'

type RestaurantCardProps = {
  item: TeamRestaurantSummary
  isDeleting: boolean
  onOpenDetail: (teamRestaurantId: string) => void
  onDelete: (teamRestaurantId: string) => void
}

export function RestaurantCard({ item, isDeleting, onOpenDetail, onDelete }: RestaurantCardProps) {
  const { id, restaurant, averageRating, reviewCount, registeredByNickname } = item
  const { name, category, address } = restaurant

  return (
    <Card className="gap-3">
      <CardHeader className="flex-row items-start justify-between">
        <CardTitle className="text-base">{name}</CardTitle>
        <Badge variant="secondary">{category}</Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-1"><MapPin className="size-4 shrink-0" />{address}</p>
        <div className="flex items-center justify-between">
          <Rating value={averageRating} reviewCount={reviewCount} />
          <span className="text-xs">등록: {registeredByNickname}</span>
        </div>
        <div className="flex gap-2 pt-1">
          <Button size="sm" className="flex-1" onClick={() => onOpenDetail(id)}>상세 보기</Button>
          <ConfirmDialog
            trigger={<Button size="icon" variant="outline" className="size-8" disabled={isDeleting} aria-label={`${name} 삭제`}><Trash2 /></Button>}
            message={DIALOG_MESSAGES.DELETE_RESTAURANT}
            onConfirm={() => onDelete(id)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
