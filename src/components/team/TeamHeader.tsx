import { useState } from 'react'
import { LogOut, MoreHorizontal, Settings, Users } from 'lucide-react'
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InviteTeamDialog } from './InviteTeamDialog'
import { MemberAvatarGroup } from './MemberAvatarGroup'
import { DIALOG_MESSAGES } from '@/constants/messages'
import type { Team, TeamMemberProfile } from '@/types/team'

type TeamHeaderProps = {
  team: Team
  members: TeamMemberProfile[]
  inviteLink?: string
  restaurantCount?: number
  reviewCount?: number
  isManaging?: boolean
  onToggleManagement?: () => void
  canLeave?: boolean
  requiresAdminTransfer?: boolean
  transferCandidates?: TeamMemberProfile[]
  deletesTeamOnLeave?: boolean
  isLeaving?: boolean
  onLeave?: () => void
  onTransferAndLeave?: (memberId: string) => void
}

export function TeamHeader({
  team,
  members,
  inviteLink,
  restaurantCount,
  reviewCount,
  isManaging = false,
  onToggleManagement,
  canLeave = false,
  requiresAdminTransfer = false,
  transferCandidates = [],
  deletesTeamOnLeave = false,
  isLeaving = false,
  onLeave,
  onTransferAndLeave,
}: TeamHeaderProps) {
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const [nextAdminId, setNextAdminId] = useState('')
  const { name, description } = team
  const handleLeaveDialogChange = (open: boolean) => {
    setLeaveDialogOpen(open)
    if (!open) setNextAdminId('')
  }
  const handleLeave = () => {
    if (requiresAdminTransfer) onTransferAndLeave?.(nextAdminId)
    else onLeave?.()
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-xs md:flex-row md:items-start md:justify-between">
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <MemberAvatarGroup members={members} showNames />
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="size-4" />멤버 {members.length}명
          </span>
          {inviteLink && (
            <InviteTeamDialog teamName={name} inviteLink={inviteLink} />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3 md:items-end">
        {restaurantCount !== undefined && reviewCount !== undefined && (
          <p className="text-sm font-medium whitespace-nowrap">
            함께 모은 식당 <span className="text-primary">{restaurantCount}곳</span>
            <span className="mx-2 text-muted-foreground">·</span>
            팀 리뷰 <span className="text-primary">{reviewCount}개</span>
          </p>
        )}
        <div className="flex gap-2">
          {onToggleManagement && (
            <Button
              variant={isManaging ? 'secondary' : 'ghost'}
              size="icon"
              aria-label={isManaging ? '팀 관리 닫기' : '팀 관리'}
              title={isManaging ? '팀 관리 닫기' : '팀 관리'}
              onClick={onToggleManagement}
            >
              <Settings />
            </Button>
          )}
          {onLeave && (
            <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="팀 메뉴" title="팀 메뉴">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  disabled={!canLeave || isLeaving}
                  onSelect={() => setLeaveDialogOpen(true)}
                >
                  <LogOut /> 팀 나가기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                    <label htmlFor="leave-next-admin" className="text-sm font-medium">새 관리자</label>
                    <Select value={nextAdminId} onValueChange={setNextAdminId}>
                      <SelectTrigger id="leave-next-admin" className="w-full">
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
                    disabled={isLeaving || (requiresAdminTransfer && !nextAdminId)}
                    onClick={handleLeave}
                  >
                    {isLeaving ? '처리 중...' : requiresAdminTransfer ? '위임 후 팀 나가기' : DIALOG_MESSAGES.LEAVE_TEAM.action}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
