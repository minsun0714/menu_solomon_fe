import { Star } from 'lucide-react'
import { MAX_RATING } from '@/constants/review'
import { cn } from '@/lib/cn'

type StarRatingInputProps = {
  value: number
  onChange: (rating: number) => void
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  return (
    <div role="radiogroup" aria-label="별점" className="flex gap-1">
      {Array.from({ length: MAX_RATING }, (_, index) => index + 1).map((rating) => (
        <button key={rating} type="button" role="radio" aria-checked={value === rating} aria-label={`${rating}점`} onClick={() => onChange(rating)} className="cursor-pointer">
          <Star className={cn('size-6', rating <= value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40')} />
        </button>
      ))}
    </div>
  )
}
