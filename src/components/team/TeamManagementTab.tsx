import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
}

export function TeamManagementTab({ team, inviteLink, transferCandidates, isTransferring, onTransferAdmin }: TeamManagementTabProps) {
  const navigate = useNavigate()
  const [nextAdminId, setNextAdminId] = useState('')
  const { isUpdating, isRegenerating, isDeleting, updateTeam, regenerateInviteCode, deleteTeam } = useTeamManagement(team.id)
  const { name, description } = team

  const handleDelete = () => deleteTeam(() => navigate(ROUTES.LANDING))
  const handleTransfer = () => {
    onTransferAdmin(nextAdminId)
    setNextAdminId('')
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
          <CardContent className="flex gap-2">
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
