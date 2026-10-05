import { UtensilsCrossed } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { CreateTeamDialog } from '@/components/team/CreateTeamDialog'
import { TeamCardList } from '@/components/team/TeamCardList'
import { APP_NAME } from '@/constants/config'
import { ROUTES } from '@/constants/routes'
import { useMyTeams } from '@/hooks/team/useMyTeams'

export function LandingPage() {
  const navigate = useNavigate()
  const { teams, isLoading, isError, isCreating, refetch, createTeam } = useMyTeams()

  const handleCreate = (...args: Parameters<typeof createTeam>) =>
    createTeam(args[0], (teamId) => {
      args[1]?.(teamId)
      navigate(ROUTES.TEAM_DETAIL(teamId))
    })
  const handleOpenTeam = (teamId: string) => navigate(ROUTES.TEAM_DETAIL(teamId))

  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col gap-10 py-8 sm:py-14">
      <header className="border-b pb-6">
        <div className="flex items-center gap-2.5">
          <UtensilsCrossed className="size-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">{APP_NAME}</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">팀 맛집을 관리하고 오늘 점심을 투표로 정합니다.</p>
      </header>

      {isLoading ? (
        <ListSkeleton count={3} itemClassName="h-44" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : teams.length === 0 ? (
        <div className="flex flex-col items-start gap-4 border-y py-6">
          <div><h2 className="font-medium">참여 중인 팀이 없습니다.</h2><p className="mt-1 text-sm text-muted-foreground">팀을 만들거나 받은 초대 링크로 참여하세요.</p></div>
          <CreateTeamDialog isCreating={isCreating} onCreate={handleCreate} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold">참여 중인 팀 <span className="ml-1 font-normal text-muted-foreground">{teams.length}</span></h2>
            <div className="flex gap-2">
              <CreateTeamDialog isCreating={isCreating} onCreate={handleCreate} />
            </div>
          </div>
          <TeamCardList teams={teams} onOpenTeam={handleOpenTeam} />
        </div>
      )}
    </section>
  )
}
