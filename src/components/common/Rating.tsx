import { Star } from 'lucide-react'
import { MAX_RATING } from '@/constants/review'
import { cn } from '@/lib/cn'

type RatingProps = {
  value: number
  reviewCount?: number
  className?: string
}

export function Rating({ value, reviewCount, className }: RatingProps) {
  const hasRating = value > 0
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm', className)} aria-label={`평점 ${value} / ${MAX_RATING}`}>
      <Star className={cn('size-4', hasRating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground')} />
      <span className="font-medium">{hasRating ? value.toFixed(1) : '-'}</span>
      {reviewCount !== undefined && <span className="text-muted-foreground">({reviewCount})</span>}
    </span>
  )
}
