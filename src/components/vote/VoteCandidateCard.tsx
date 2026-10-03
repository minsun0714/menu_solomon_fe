import { Check, Trash2, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Rating } from '@/components/common/Rating'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { DIALOG_MESSAGES } from '@/constants/messages'
import { CANDIDATE_SOURCE, CANDIDATE_SOURCE_LABEL } from '@/constants/vote'
import { cn } from '@/lib/cn'
import type { CandidateDetail, VoteResult } from '@/types/vote'

type VoteCandidateCardProps = {
  candidate: CandidateDetail
  result: VoteResult
  isSelected: boolean
  isWinner: boolean
  isSelectable: boolean
  canDelete: boolean
  isDeleting: boolean
  onSelect: (candidateId: string) => void
  onDelete: (candidateId: string) => void
}

export function VoteCandidateCard({ candidate, result, isSelected, isWinner, isSelectable, canDelete, isDeleting, onSelect, onDelete }: VoteCandidateCardProps) {
  const { id, restaurant, averageRating, source } = candidate
  const { voteCount, percentage } = result

  return (
    <div
      className={cn(
        'relative w-full rounded-xl border bg-card shadow-xs transition-all',
        isSelectable && 'hover:border-primary/50',
        isSelected && 'border-primary ring-1 ring-primary',
      )}
    >
      <button
        type="button"
        disabled={!isSelectable}
        aria-pressed={isSelected}
        onClick={() => onSelect(id)}
        className={cn('w-full p-4 text-left focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none', isSelectable && 'cursor-pointer', canDelete && 'pr-14')}
      >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{restaurant.name}</span>
            <Badge variant="outline">{restaurant.category}</Badge>
            {source === CANDIDATE_SOURCE.RECOMMENDED && <Badge variant="secondary">{CANDIDATE_SOURCE_LABEL[source]}</Badge>}
            {isWinner && <Badge variant="success"><Trophy /> 선두</Badge>}
          </div>
          <Rating value={averageRating} />
        </div>
        {isSelected && (
          <span className="flex items-center gap-1 text-sm font-medium text-primary"><Check className="size-4" />내 선택</span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Progress value={percentage} aria-label={`${restaurant.name} 득표율`} />
        <span className="w-20 shrink-0 text-right text-sm tabular-nums text-muted-foreground">{voteCount}표 · {percentage}%</span>
      </div>
      </button>
      {canDelete && (
        <div className="absolute top-2 right-2">
          <ConfirmDialog
            trigger={<Button variant="ghost" size="icon" disabled={isDeleting} aria-label={`${restaurant.name} 후보 삭제`}><Trash2 /></Button>}
            message={DIALOG_MESSAGES.DELETE_CANDIDATE}
            onConfirm={() => onDelete(id)}
          />
        </div>
      )}
    </div>
  )
}
