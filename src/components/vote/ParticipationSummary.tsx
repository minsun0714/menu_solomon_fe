import { UserCheck, UserX } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ParticipantDetail } from '@/types/vote'

type ParticipationSummaryProps = {
  participants: ParticipantDetail[]
  nonParticipants: ParticipantDetail[]
  isParticipating: boolean
  isUpdating: boolean
  canToggle: boolean
  onToggleParticipation: () => void
}

function NameBadges({ members, emptyText }: { members: ParticipantDetail[]; emptyText: string }) {
  if (members.length === 0) return <span className="text-sm text-muted-foreground">{emptyText}</span>
  return (
    <div className="flex flex-wrap gap-1.5">
      {members.map(({ id, nickname }) => (
        <Badge key={id} variant="secondary">{nickname}</Badge>
      ))}
    </div>
  )
}

export function ParticipationSummary({
  participants,
  nonParticipants,
  isParticipating,
  isUpdating,
  canToggle,
  onToggleParticipation,
}: ParticipationSummaryProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>투표 참여 현황</CardTitle>
        {canToggle && (
          <Button variant={isParticipating ? 'outline' : 'default'} size="sm" disabled={isUpdating} onClick={onToggleParticipation}>
          {isParticipating ? <><UserX /> 이번 투표 불참</> : <><UserCheck /> 다시 참여하기</>}
        </Button>
        )}
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium">참여 {participants.length}명</p>
          <NameBadges members={participants} emptyText="참여자가 없어요" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">불참 {nonParticipants.length}명</p>
          <NameBadges members={nonParticipants} emptyText="모두 참여 중이에요" />
        </div>
      </CardContent>
    </Card>
  )
}
