import { Pencil, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { DIALOG_MESSAGES } from '@/constants/messages'
import { useVoteManagement } from '@/hooks/vote/useVoteManagement'
import { ClosingTimeDialog } from './ClosingTimeDialog'
import type { LunchVoteSession } from '@/types/vote'

type VoteManagementActionsProps = {
  teamId: string
  session: LunchVoteSession
  canEdit: boolean
  canRevote: boolean
}

export function VoteManagementActions({ teamId, session, canEdit, canRevote }: VoteManagementActionsProps) {
  const { isPending, updateClosesAt, revote } = useVoteManagement(teamId, session.id)

  if (!canEdit && !canRevote) return null

  return (
    <div className="flex flex-wrap gap-2">
      {canEdit && (
        <ClosingTimeDialog
          trigger={<Button variant="outline" size="sm"><Pencil /> 마감 시간 수정</Button>}
          title="마감 시간 수정"
          description="투표 마감 시간을 변경합니다."
          submitLabel="저장"
          initialClosesAt={session.closesAt}
          isSubmitting={isPending}
          onSubmit={updateClosesAt}
        />
      )}
      {canRevote && (
        <ConfirmDialog
          trigger={<Button variant="outline" size="sm" disabled={isPending}><RotateCcw /> 투표 다시 시작</Button>}
          message={DIALOG_MESSAGES.REVOTE}
          destructive={false}
          onConfirm={revote}
        />
      )}
    </div>
  )
}
