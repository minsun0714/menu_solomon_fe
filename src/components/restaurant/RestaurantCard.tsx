import { useState } from 'react'
import { ChevronRight, MapPin, MessageSquare, MoreHorizontal, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Rating } from '@/components/common/Rating'
import { DIALOG_MESSAGES } from '@/constants/messages'
import { RestaurantReviewsDialog } from './RestaurantReviewsDialog'
import type { TeamRestaurantSummary } from '@/types/restaurant'

type RestaurantCardProps = {
  teamId: string
  item: TeamRestaurantSummary
  isDeleting: boolean
  onDelete: (teamRestaurantId: string) => void
}

export function RestaurantCard({ teamId, item, isDeleting, onDelete }: RestaurantCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { id, restaurant, averageRating, reviewCount, registeredByNickname, latestReview } = item
  const { name, category, address } = restaurant

  return (
    <Card className="gap-3 rounded-md">
      <CardHeader className="flex-row items-start justify-between">
        <CardTitle className="text-base">{name}</CardTitle>
        <div className="flex items-center gap-1">
          <Badge variant="secondary">{category}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="size-8" disabled={isDeleting} aria-label={`${name} 메뉴`}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setDeleteDialogOpen(true)}>
                <Trash2 /> 식당 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-1"><MapPin className="size-4 shrink-0" />{address}</p>
        <div className="flex items-center justify-between">
          <Rating value={averageRating} reviewCount={reviewCount} />
          <span className="text-xs">등록: {registeredByNickname}</span>
        </div>
        <div className="flex items-start gap-2 pt-1">
          <RestaurantReviewsDialog
            teamId={teamId}
            teamRestaurantId={id}
            restaurantName={name}
            reviewCount={reviewCount}
            trigger={
              <button
                type="button"
                className="flex min-w-0 flex-1 cursor-pointer items-start gap-2 border-t pt-3 text-left transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <MessageSquare className="mt-0.5 size-4 shrink-0" />
                <span className="min-w-0 flex-1">
                  {latestReview ? (
                    <>
                      <span className="block line-clamp-2 text-sm text-foreground">{latestReview.content}</span>
                      <span className="mt-1 flex items-center gap-2 text-xs">
                        <Rating value={latestReview.rating} />
                        {latestReview.authorNickname}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm">아직 리뷰가 없어요.</span>
                  )}
                </span>
                <ChevronRight className="mt-0.5 size-4 shrink-0" />
              </button>
            }
          />
        </div>
      </CardContent>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{DIALOG_MESSAGES.DELETE_RESTAURANT.title}</AlertDialogTitle>
            <AlertDialogDescription>{DIALOG_MESSAGES.DELETE_RESTAURANT.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => onDelete(id)}>
              {DIALOG_MESSAGES.DELETE_RESTAURANT.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
