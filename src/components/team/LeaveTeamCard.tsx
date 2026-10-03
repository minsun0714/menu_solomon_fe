import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { DIALOG_MESSAGES } from '@/constants/messages'

type LeaveTeamCardProps = {
  canLeave: boolean
  requiresAdminTransfer: boolean
  isLeaving: boolean
  onLeave: () => void
}

export function LeaveTeamCard({ canLeave, requiresAdminTransfer, isLeaving, onLeave }: LeaveTeamCardProps) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-semibold">팀 나가기</h2>
        <p className="text-sm text-muted-foreground">
          {requiresAdminTransfer
            ? '관리자는 다른 멤버에게 관리자 권한을 넘긴 후에 나갈 수 있어요.'
            : '팀에서 나가면 투표와 리뷰에 참여할 수 없어요.'}
        </p>
      </div>
      <ConfirmDialog
        trigger={
          <Button variant="outline" disabled={!canLeave || isLeaving}>
            <LogOut /> 팀 나가기
          </Button>
        }
        message={DIALOG_MESSAGES.LEAVE_TEAM}
        onConfirm={onLeave}
      />
    </section>
  )
}
