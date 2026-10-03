import { UserCheck, UserX } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/cn'
import type { ParticipantDetail } from '@/types/vote'

type ParticipationSummaryProps = {
  participants: ParticipantDetail[]
  nonParticipants: ParticipantDetail[]
  currentMemberId?: string
  isUpdating: boolean
  canToggle: boolean
  canManageParticipants?: boolean
  onSetParticipation?: (teamMemberId: string, participating: boolean) => void
  compact?: boolean
}

function NameBadges({
  members,
  emptyText,
  canManage,
  canToggle,
  currentMemberId,
  isUpdating,
  nextParticipating,
  onSetParticipation,
}: {
  members: ParticipantDetail[]
  emptyText: string
  canManage: boolean
  canToggle: boolean
  currentMemberId?: string
  isUpdating: boolean
  nextParticipating: boolean
  onSetParticipation?: (teamMemberId: string, participating: boolean) => void
}) {
  if (members.length === 0) return <span className="text-sm text-muted-foreground">{emptyText}</span>
  return (
    <div className="flex flex-wrap gap-1.5">
      {members.map(({ id, teamMemberId, nickname }) => {
        const isEditable = canToggle && (canManage || teamMemberId === currentMemberId)
        const badge = (
          <Badge
            variant={nextParticipating ? 'destructive' : 'success'}
            className={cn('gap-1', isEditable && 'cursor-pointer transition-opacity hover:opacity-75')}
          >
            {nickname}
            {isEditable && (nextParticipating ? <UserCheck /> : <UserX />)}
          </Badge>
        )

        return isEditable ? (
          <button
            key={id}
            type="button"
            disabled={isUpdating}
            aria-label={`${nickname}님 ${nextParticipating ? '참여 처리' : '불참 처리'}`}
            title={nextParticipating ? '참여 처리' : '불참 처리'}
            onClick={() => onSetParticipation?.(teamMemberId, nextParticipating)}
          >
            {badge}
          </button>
        ) : <span key={id}>{badge}</span>
      })}
    </div>
  )
}

export function ParticipationSummary({
  participants,
  nonParticipants,
  currentMemberId,
  isUpdating,
  canToggle,
  canManageParticipants = false,
  onSetParticipation,
  compact = false,
}: ParticipationSummaryProps) {
  return (
    <Card className={cn(compact && 'gap-3 py-3 shadow-none')}>
      <CardContent className={cn('grid gap-4 sm:grid-cols-2', compact && 'gap-2 px-3')}>
        <div className="space-y-2">
          <p className={cn('text-sm font-medium', compact && 'text-xs')}>참여 {participants.length}명</p>
          <NameBadges members={participants} emptyText="참여자가 없어요" canManage={canManageParticipants} canToggle={canToggle} currentMemberId={currentMemberId} isUpdating={isUpdating} nextParticipating={false} onSetParticipation={onSetParticipation} />
        </div>
        <div className="space-y-2">
          <p className={cn('text-sm font-medium text-muted-foreground', compact && 'text-xs')}>불참 {nonParticipants.length}명</p>
          <NameBadges members={nonParticipants} emptyText="모두 참여 중이에요" canManage={canManageParticipants} canToggle={canToggle} currentMemberId={currentMemberId} isUpdating={isUpdating} nextParticipating onSetParticipation={onSetParticipation} />
        </div>
      </CardContent>
    </Card>
  )
}
