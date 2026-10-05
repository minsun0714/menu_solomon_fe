import { useState } from 'react'
import { LogOut, MoreHorizontal, Settings } from 'lucide-react'
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
  const memberNames = members.map(({ user }) => user.nickname).join(', ')

  return (
    <section className="border-b pb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{name}</h1>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex shrink-0 gap-1">
          {onToggleManagement && (
            <Button
              variant={isManaging ? 'secondary' : 'ghost'}
              size="icon"
              className="size-8"
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
                  <Button variant="ghost" size="icon" className="size-8" aria-label="팀 메뉴" title="팀 메뉴">
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
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <span>{memberNames}</span>
        <span className="text-muted-foreground">· 멤버 {members.length}명</span>
        {inviteLink && <InviteTeamDialog teamName={name} inviteLink={inviteLink} />}
      </div>
      {restaurantCount !== undefined && reviewCount !== undefined && (
        <p className="mt-2 text-sm text-muted-foreground">
          함께 모은 식당 <span className="font-medium text-foreground">{restaurantCount}곳</span>
          <span className="mx-1.5">·</span>
          팀 리뷰 <span className="font-medium text-foreground">{reviewCount}개</span>
        </p>
      )}
    </section>
  )
}
