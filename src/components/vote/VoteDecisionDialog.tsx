import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { VOTE_STATUS } from '@/constants/vote'
import { useVoteSessionQuery } from '@/hooks/vote/queries/useVoteQueries'
import { VoteDecisionPanel } from './VoteDecisionPanel'
import type { VoteStatus } from '@/types/vote'

type VoteDecisionDialogProps = {
  teamId: string
  sessionId: string
  status: VoteStatus
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VoteDecisionDialog({ teamId, sessionId, status, open, onOpenChange }: VoteDecisionDialogProps) {
  const { data: detail } = useVoteSessionQuery(teamId, sessionId)
  const currentStatus = detail?.session.status ?? status
  const isConfirmed = currentStatus === VOTE_STATUS.CONFIRMED

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isConfirmed ? '확정 메뉴 변경' : '점심 메뉴 확정'}</DialogTitle>
          <DialogDescription>
            {isConfirmed ? '확정된 메뉴를 다른 후보로 변경하거나 확정을 취소할 수 있습니다.' : '투표 결과를 바탕으로 오늘의 점심 메뉴를 확정하세요.'}
          </DialogDescription>
        </DialogHeader>
        <VoteDecisionPanel
          teamId={teamId}
          sessionId={sessionId}
          status={currentStatus}
          onDecisionSaved={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
