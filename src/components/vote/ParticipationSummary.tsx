import { MousePointerClick, UserCheck, UserX } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
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

        const actionLabel = `${nickname}님을 ${nextParticipating ? '참여' : '불참'}으로 변경`

        return isEditable ? (
          <Tooltip key={id}>
            <TooltipTrigger asChild>
              <button
                type="button"
                disabled={isUpdating}
                aria-label={actionLabel}
                onClick={() => onSetParticipation?.(teamMemberId, nextParticipating)}
              >
                {badge}
              </button>
            </TooltipTrigger>
            <TooltipContent>{actionLabel}</TooltipContent>
          </Tooltip>
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
    <section className={cn('grid gap-4 border-y py-4 sm:grid-cols-2', compact && 'gap-2 py-2')}>
        {canToggle && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground sm:col-span-2">
            <MousePointerClick className="size-3.5" /> 팀원 뱃지를 눌러 참여 여부를 변경할 수 있어요.
          </p>
        )}
        <div className="space-y-2">
          <p className={cn('text-sm font-medium', compact && 'text-xs')}>참여 {participants.length}명</p>
          <NameBadges members={participants} emptyText="참여자가 없어요" canManage={canManageParticipants} canToggle={canToggle} currentMemberId={currentMemberId} isUpdating={isUpdating} nextParticipating={false} onSetParticipation={onSetParticipation} />
        </div>
        <div className="space-y-2">
          <p className={cn('text-sm font-medium text-muted-foreground', compact && 'text-xs')}>불참 {nonParticipants.length}명</p>
          <NameBadges members={nonParticipants} emptyText="모두 참여 중이에요" canManage={canManageParticipants} canToggle={canToggle} currentMemberId={currentMemberId} isUpdating={isUpdating} nextParticipating onSetParticipation={onSetParticipation} />
        </div>
    </section>
  )
}
