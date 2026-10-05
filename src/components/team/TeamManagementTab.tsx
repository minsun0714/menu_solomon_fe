import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { DIALOG_MESSAGES } from '@/constants/messages'
import { ROUTES } from '@/constants/routes'
import { useTeamManagement } from '@/hooks/team/useTeamManagement'
import { TeamForm } from './TeamForm'
import type { Team, TeamMemberProfile } from '@/types/team'

type TeamManagementTabProps = {
  team: Team
  inviteLink?: string
  transferCandidates: TeamMemberProfile[]
  isTransferring: boolean
  onTransferAdmin: (memberId: string) => void
  canLeave: boolean
  requiresAdminTransfer: boolean
  deletesTeamOnLeave: boolean
  isLeaving: boolean
  onLeave: () => void
  onTransferAndLeave: (memberId: string) => void
}

export function TeamManagementTab({
  team,
  inviteLink,
  transferCandidates,
  isTransferring,
  onTransferAdmin,
  canLeave,
  requiresAdminTransfer,
  deletesTeamOnLeave,
  isLeaving,
  onLeave,
  onTransferAndLeave,
}: TeamManagementTabProps) {
  const navigate = useNavigate()
  const [nextAdminId, setNextAdminId] = useState('')
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const [leaveNextAdminId, setLeaveNextAdminId] = useState('')
  const { isUpdating, isRegenerating, isDeleting, updateTeam, regenerateInviteCode, deleteTeam } = useTeamManagement(team.id)
  const { name, description } = team

  const handleDelete = () => deleteTeam(() => navigate(ROUTES.LANDING))
  const handleTransfer = () => {
    onTransferAdmin(nextAdminId)
    setNextAdminId('')
  }
  const handleLeaveDialogChange = (open: boolean) => {
    setLeaveDialogOpen(open)
    if (!open) setLeaveNextAdminId('')
  }
  const handleLeave = () => {
    if (requiresAdminTransfer) onTransferAndLeave(leaveNextAdminId)
    else onLeave()
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>팀 정보 수정</CardTitle>
          <CardDescription>팀 이름과 소개를 변경합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <TeamForm key={`${name}-${description}`} initialValue={{ name, description }} submitLabel="저장" isSubmitting={isUpdating} onSubmit={updateTeam} />
        </CardContent>
      </Card>

      <div className="grid content-start gap-4">
        <Card>
          <CardHeader>
            <CardTitle>관리자 변경</CardTitle>
            <CardDescription>다른 멤버에게 관리자 권한을 넘깁니다.</CardDescription>
          </CardHeader>
          <CardContent>
            {transferCandidates.length === 0 ? (
              <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                관리자 권한을 넘길 수 있는 다른 팀원이 없습니다.
              </p>
            ) : (
              <div className="flex gap-2">
                <Select value={nextAdminId} onValueChange={setNextAdminId}>
                  <SelectTrigger className="flex-1" aria-label="새 관리자 선택">
                    <SelectValue placeholder="멤버 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {transferCandidates.map(({ id, user }) => (
                      <SelectItem key={id} value={id}>{user.nickname}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button disabled={!nextAdminId || isTransferring} onClick={handleTransfer}>변경</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>초대 링크</CardTitle>
            <CardDescription>현재 초대 링크를 재발급하면 기존 링크는 더 이상 사용할 수 없습니다.</CardDescription>
            <CardDescription className="break-all font-medium">{inviteLink}</CardDescription>
          </CardHeader>
          <CardContent>
            <ConfirmDialog
              trigger={<Button variant="outline" disabled={isRegenerating}>초대 링크 재발급</Button>}
              message={DIALOG_MESSAGES.REGENERATE_INVITE}
              destructive={false}
              onConfirm={regenerateInviteCode}
            />
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle>팀 나가기</CardTitle>
            <CardDescription>
              {requiresAdminTransfer
                ? '다른 팀원에게 관리자 권한을 위임한 뒤 팀에서 나갈 수 있습니다.'
                : deletesTeamOnLeave
                  ? '마지막 멤버가 나가면 팀과 모든 기록이 즉시 삭제됩니다.'
                  : '관리자 권한과 팀 멤버 자격을 종료합니다.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="text-destructive hover:text-destructive" disabled={!canLeave || isLeaving} onClick={() => setLeaveDialogOpen(true)}>
              <LogOut /> 팀 나가기
            </Button>
            <AlertDialog open={leaveDialogOpen} onOpenChange={handleLeaveDialogChange}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {requiresAdminTransfer ? '관리자를 위임하고 팀에서 나갈까요?' : DIALOG_MESSAGES.LEAVE_TEAM.title}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {requiresAdminTransfer
                      ? '팀을 계속 관리할 멤버를 선택하세요. 관리자 권한을 넘긴 뒤 팀에서 나가게 됩니다.'
                      : deletesTeamOnLeave
                        ? '마지막 멤버가 탈퇴하면 이 팀과 모든 기록이 즉시 삭제됩니다.'
                        : DIALOG_MESSAGES.LEAVE_TEAM.description}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {requiresAdminTransfer && (
                  <div className="grid gap-2 py-2">
                    <label htmlFor="management-leave-next-admin" className="text-sm font-medium">새 관리자</label>
                    <Select value={leaveNextAdminId} onValueChange={setLeaveNextAdminId}>
                      <SelectTrigger id="management-leave-next-admin" className="w-full">
                        <SelectValue placeholder="권한을 위임할 멤버 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {transferCandidates.map(({ id, user }) => (
                          <SelectItem key={id} value={id}>{user.nickname}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-white hover:bg-destructive/90"
                    disabled={isLeaving || (requiresAdminTransfer && !leaveNextAdminId)}
                    onClick={handleLeave}
                  >
                    {isLeaving ? '처리 중...' : requiresAdminTransfer ? '위임 후 팀 나가기' : DIALOG_MESSAGES.LEAVE_TEAM.action}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">팀 삭제</CardTitle>
            <CardDescription>팀과 모든 기록이 영구적으로 삭제됩니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <ConfirmDialog
              trigger={<Button variant="destructive" disabled={isDeleting}>팀 삭제</Button>}
              message={DIALOG_MESSAGES.DELETE_TEAM}
              onConfirm={handleDelete}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
