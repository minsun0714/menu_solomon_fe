import { LogIn, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { CreateTeamDialog } from '@/components/team/CreateTeamDialog'
import { TeamCardList } from '@/components/team/TeamCardList'
import { ROUTES } from '@/constants/routes'
import { useRequireAuth } from '@/hooks/auth/AuthPromptContext'
import { useMyTeams } from '@/hooks/team/useMyTeams'

export function MyTeamsPage() {
  const navigate = useNavigate()
  const { openLoginDialog } = useRequireAuth()
  const { teams, isAuthenticated, isLoading, isError, isCreating, refetch, createTeam } = useMyTeams()

  const handleCreate = (...args: Parameters<typeof createTeam>) =>
    createTeam(args[0], (teamId) => {
      args[1]?.(teamId)
      navigate(ROUTES.TEAM_DETAIL(teamId))
    })
  const handleOpenTeam = (teamId: string) => navigate(ROUTES.TEAM_DETAIL(teamId))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">내 팀</h1>
          <p className="text-sm text-muted-foreground">참여 중인 팀을 확인하고 점심 투표를 시작하세요.</p>
        </div>
        {isAuthenticated && <CreateTeamDialog isCreating={isCreating} onCreate={handleCreate} />}
      </div>
      {!isAuthenticated && !isLoading ? (
        <EmptyState
          icon={LogIn}
          title="로그인하고 내 팀을 확인하세요"
          description="데모 로그인으로 샘플 팀을 둘러볼 수 있어요."
          action={<Button onClick={openLoginDialog}>로그인</Button>}
        />
      ) : isLoading ? (
        <ListSkeleton count={3} />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : teams.length === 0 ? (
        <EmptyState icon={Users} title="아직 참여 중인 팀이 없어요" description="팀을 만들거나 초대 링크로 참여해 보세요." />
      ) : (
        <TeamCardList teams={teams} onOpenTeam={handleOpenTeam} />
      )}
    </div>
  )
}
