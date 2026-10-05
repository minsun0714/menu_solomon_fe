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
  isLeaving?: boolean
  onLeave?: () => void
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
  isLeaving = false,
  onLeave,
}: TeamHeaderProps) {
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const { name, description } = team

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
            <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{DIALOG_MESSAGES.LEAVE_TEAM.title}</AlertDialogTitle>
                  <AlertDialogDescription>{DIALOG_MESSAGES.LEAVE_TEAM.description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-white hover:bg-destructive/90"
                    disabled={isLeaving}
                    onClick={onLeave}
                  >
                    {isLeaving ? '처리 중...' : DIALOG_MESSAGES.LEAVE_TEAM.action}
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
