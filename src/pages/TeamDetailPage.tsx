import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HistoryTab } from '@/components/history/HistoryTab'
import { RestaurantsTab } from '@/components/restaurant/RestaurantsTab'
import { LeaveTeamCard } from '@/components/team/LeaveTeamCard'
import { TeamHeader } from '@/components/team/TeamHeader'
import { TeamManagementTab } from '@/components/team/TeamManagementTab'
import { LunchVoteTab } from '@/components/vote/LunchVoteTab'
import { ROUTES, TEAM_TAB, parseTeamTab, type TeamTab } from '@/constants/routes'
import { useRequireAuth } from '@/hooks/auth/AuthPromptContext'
import { useTeamDetail } from '@/hooks/team/useTeamDetail'

export function TeamDetailPage() {
  const { teamId = '' } = useParams()
  const navigate = useNavigate()
  const { requireAuth } = useRequireAuth()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<TeamTab>(parseTeamTab(searchParams.get('tab')))
  const { team, members, currentMember, isAdmin, isMember, canLeave, requiresAdminTransfer, isLoading, isError, isLeaving, isTransferring, leaveTeam, transferAdmin } =
    useTeamDetail(teamId)

  const handleLeave = () => requireAuth(() => leaveTeam(() => navigate(ROUTES.MY_TEAMS)))
  const handleTabChange = (value: string) => setTab(value as TeamTab)
  const transferCandidates = members.filter(({ id }) => id !== currentMember?.id)

  if (isLoading) return <Skeleton className="h-40" />
  if (isError || !team) return <ErrorState message="팀을 찾을 수 없습니다." />

  return (
    <div className="space-y-6">
      <TeamHeader team={team} members={members} />
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value={TEAM_TAB.VOTE}>점심 투표</TabsTrigger>
          <TabsTrigger value={TEAM_TAB.RESTAURANTS}>식당</TabsTrigger>
          <TabsTrigger value={TEAM_TAB.HISTORY}>히스토리</TabsTrigger>
          {isAdmin && <TabsTrigger value={TEAM_TAB.MANAGEMENT}>팀 관리</TabsTrigger>}
        </TabsList>
        <TabsContent value={TEAM_TAB.VOTE}><LunchVoteTab teamId={teamId} /></TabsContent>
        <TabsContent value={TEAM_TAB.RESTAURANTS}><RestaurantsTab teamId={teamId} /></TabsContent>
        <TabsContent value={TEAM_TAB.HISTORY}><HistoryTab teamId={teamId} /></TabsContent>
        {isAdmin && (
          <TabsContent value={TEAM_TAB.MANAGEMENT}>
            <TeamManagementTab team={team} transferCandidates={transferCandidates} isTransferring={isTransferring} onTransferAdmin={transferAdmin} />
          </TabsContent>
        )}
      </Tabs>
      {isMember && <LeaveTeamCard canLeave={canLeave} requiresAdminTransfer={requiresAdminTransfer} isLeaving={isLeaving} onLeave={handleLeave} />}
    </div>
  )
}
