import { useState } from 'react'
import { Gavel, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { DATE_FORMATS } from '@/constants/date'
import { DIALOG_MESSAGES } from '@/constants/messages'
import { CONFIRMATION_TYPE_LABEL, VOTE_STATUS } from '@/constants/vote'
import { useVoteDecision } from '@/hooks/vote/useVoteDecision'
import { formatDate } from '@/lib/date'
import type { VoteStatus } from '@/types/vote'

type VoteDecisionPanelProps = {
  teamId: string
  sessionId: string
  status: VoteStatus
  onDecisionSaved?: () => void
}

export function VoteDecisionPanel({ teamId, sessionId, status, onDecisionSaved }: VoteDecisionPanelProps) {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('')
  const {
    currentDecision, decidedRestaurant, confirmedByNickname, winnerCandidates, confirmableCandidates,
    isTied, canConfirm, canEditDecision, isPending, confirm, editDecision, deleteDecision,
  } = useVoteDecision(teamId, sessionId)
  const handleSubmit = () => (currentDecision
    ? editDecision(selectedRestaurantId, onDecisionSaved)
    : confirm(selectedRestaurantId, onDecisionSaved))
  const showEditor = canConfirm || canEditDecision

  return (
    <Card className="rounded-md border-l-2 border-l-primary">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><Trophy className="size-4 text-primary" />점심 결정</CardTitle>
        {currentDecision && <Badge variant="success">{CONFIRMATION_TYPE_LABEL[currentDecision.confirmationType]}</Badge>}
      </CardHeader>
      <CardContent className="space-y-3">
        {currentDecision ? (
          <p>
            <span className="text-lg font-bold">{decidedRestaurant?.name}</span>
            <span className="ml-2 text-sm text-muted-foreground">
              {formatDate(currentDecision.confirmedAt, DATE_FORMATS.DATE_TIME)}
              {confirmedByNickname && ` · ${confirmedByNickname} 확정`}
            </span>
          </p>
        ) : status === VOTE_STATUS.OPEN ? (
          <p className="text-sm text-muted-foreground">
            투표가 진행 중이에요. 마감 후 최다 득표 식당이 자동으로 확정됩니다.
            {winnerCandidates.length > 0 && ` 현재 선두: ${winnerCandidates.map(({ restaurant }) => restaurant.name).join(', ')}`}
          </p>
        ) : isTied ? (
          <p className="text-sm font-medium text-amber-700">
            동점이에요! ({winnerCandidates.map(({ restaurant }) => restaurant.name).join(', ')}) 재투표하거나 직접 확정해 주세요.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">투표가 종료되었어요. 아직 확정된 식당이 없습니다.</p>
        )}

        {showEditor && (
          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedRestaurantId} onValueChange={setSelectedRestaurantId}>
              <SelectTrigger className="w-56" aria-label="확정할 식당 선택"><SelectValue placeholder="식당 선택" /></SelectTrigger>
              <SelectContent>
                {confirmableCandidates.map(({ id, restaurantId, restaurant }) => (
                  <SelectItem key={id} value={restaurantId}>{restaurant.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button disabled={!selectedRestaurantId || isPending} onClick={handleSubmit}>
              <Gavel /> {currentDecision ? '확정 메뉴 수정' : '수동 확정'}
            </Button>
            {canEditDecision && (
              <ConfirmDialog
                trigger={<Button variant="outline" disabled={isPending}>확정 삭제</Button>}
                message={DIALOG_MESSAGES.DELETE_DECISION}
                onConfirm={deleteDecision}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
