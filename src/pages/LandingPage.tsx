import { useState } from 'react'
import { Plus, UtensilsCrossed } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { CreateTeamDialog } from '@/components/team/CreateTeamDialog'
import { TeamCardList } from '@/components/team/TeamCardList'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { APP_NAME } from '@/constants/config'
import { ROUTES } from '@/constants/routes'
import { useMyTeams } from '@/hooks/team/useMyTeams'
import type { TeamSort } from '@/types/team'

export function LandingPage() {
  const navigate = useNavigate()
  const [sort, setSort] = useState<TeamSort>('LATEST_LUNCH')
  const { teams, isLoading, isError, isCreating, refetch, createTeam } = useMyTeams(sort)

  const handleCreate = (...args: Parameters<typeof createTeam>) =>
    createTeam(args[0], (teamId) => {
      args[1]?.(teamId)
      navigate(ROUTES.TEAM_DETAIL(teamId))
    })
  const handleOpenTeam = (teamId: string) => navigate(ROUTES.TEAM_DETAIL(teamId))

  const cardClassName = 'group min-h-80 gap-0 overflow-hidden p-0 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md'
  const cardHeaderClassName = 'flex-1 gap-5 px-6 pt-7 pb-6'
  const cardContentClassName = 'mt-auto px-6 pb-8'
  const iconClassName = 'flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10 transition-transform group-hover:scale-105'

  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col gap-9 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <UtensilsCrossed className="size-6" />
          </span>
          <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
        </div>
        <p className="text-sm text-muted-foreground">식당을 모으고 함께 투표해 오늘의 점심을 정해보세요.</p>
      </div>

      {isLoading ? (
        <ListSkeleton count={3} itemClassName="h-44" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : teams.length === 0 ? (
        <div className="mx-auto w-full max-w-md">
          <Card className={cardClassName}>
            <CardHeader className={cardHeaderClassName}>
              <span className={iconClassName}><Plus className="size-6" /></span>
              <div className="space-y-3">
                <CardTitle className="text-xl">팀 만들기</CardTitle>
                <CardDescription className="leading-relaxed">새로운 팀을 만들고 초대 링크를 팀원에게 공유하세요.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className={cardContentClassName}>
              <CreateTeamDialog isCreating={isCreating} triggerClassName="h-10 w-full" onCreate={handleCreate} />
            </CardContent>
          </Card>

        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium">참여 중인 팀 <span className="text-primary">{teams.length}</span></p>
            <div className="flex gap-2">
              <Select value={sort} onValueChange={(value) => setSort(value as TeamSort)}>
                <SelectTrigger aria-label="팀 정렬" className="min-w-0 flex-1 sm:w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LATEST_LUNCH">최근 점심 순</SelectItem>
                  <SelectItem value="NAME">이름 순</SelectItem>
                  <SelectItem value="ACTIVE_VOTES">진행 중 투표 순</SelectItem>
                  <SelectItem value="MEMBER_COUNT">멤버 많은 순</SelectItem>
                </SelectContent>
              </Select>
              <CreateTeamDialog isCreating={isCreating} onCreate={handleCreate} />
            </div>
          </div>
          <TeamCardList teams={teams} onOpenTeam={handleOpenTeam} />
        </div>
      )}
    </section>
  )
}
