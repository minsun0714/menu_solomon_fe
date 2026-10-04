import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ErrorState } from '@/components/common/ErrorState'
import { BackLink } from '@/components/common/BackLink'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HistoryTab } from '@/components/history/HistoryTab'
import { RestaurantsTab } from '@/components/restaurant/RestaurantsTab'
import { TeamHeader } from '@/components/team/TeamHeader'
import { TeamManagementTab } from '@/components/team/TeamManagementTab'
import { LunchVoteTab } from '@/components/vote/LunchVoteTab'
import { ROUTES, TEAM_TAB, parseTeamTab, type TeamTab } from '@/constants/routes'
import { useTeamDetail } from '@/hooks/team/useTeamDetail'
import { useTeamRestaurantsQuery } from '@/hooks/restaurant/queries/useTeamRestaurantsQuery'
import { useVoteSessionsQuery } from '@/hooks/vote/queries/useVoteQueries'
import { VOTE_STATUS } from '@/constants/vote'

export function TeamDetailPage() {
  const { teamId = '' } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<TeamTab>(parseTeamTab(searchParams.get('tab')))
  const [isManaging, setIsManaging] = useState(false)
  const { data: voteSessions = [] } = useVoteSessionsQuery(teamId)
  const { data: teamRestaurants } = useTeamRestaurantsQuery(teamId)
  const { team, inviteLink, members, currentMember, isAdmin, isMember, canLeave, requiresAdminTransfer, isLoading, isError, isLeaving, isTransferring, leaveTeam, transferAdmin, transferAdminAndLeave } =
    useTeamDetail(teamId)

  const handleLeave = () => leaveTeam(() => navigate(ROUTES.LANDING))
  const handleTransferAndLeave = (memberId: string) => transferAdminAndLeave(memberId, () => navigate(ROUTES.LANDING))
  const handleTabChange = (value: string) => setTab(value as TeamTab)
  const transferCandidates = members.filter(({ id }) => id !== currentMember?.id)
  const activeVotes = voteSessions.filter(({ status }) => status === VOTE_STATUS.OPEN)
  const unvotedCount = activeVotes.filter(({ myBallotCandidateIds }) => myBallotCandidateIds.length === 0).length

  if (isLoading) return <div className="space-y-6"><BackLink to={ROUTES.LANDING}>팀 목록으로</BackLink><Skeleton className="h-40" /></div>
  if (isError || !team) return <div className="space-y-6"><BackLink to={ROUTES.LANDING}>팀 목록으로</BackLink><ErrorState message="팀에 접근할 수 없습니다. 초대 링크로 참여해 주세요." /></div>

  return (
    <div className="space-y-6">
      <BackLink to={ROUTES.LANDING}>팀 목록으로</BackLink>
      <TeamHeader
        team={team}
        members={members}
        inviteLink={inviteLink}
        restaurantCount={teamRestaurants?.totalCount}
        reviewCount={teamRestaurants?.totalReviewCount}
        isManaging={isManaging}
        onToggleManagement={isAdmin ? () => setIsManaging((value) => !value) : undefined}
        canLeave={canLeave}
        requiresAdminTransfer={requiresAdminTransfer}
        transferCandidates={transferCandidates}
        deletesTeamOnLeave={isAdmin && members.length === 1}
        isLeaving={isLeaving}
        onLeave={isMember ? handleLeave : undefined}
        onTransferAndLeave={isMember ? handleTransferAndLeave : undefined}
      />
      {isManaging && isAdmin ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">팀 관리</h2>
          <TeamManagementTab
            team={team}
            inviteLink={inviteLink}
            transferCandidates={transferCandidates}
            isTransferring={isTransferring}
            onTransferAdmin={transferAdmin}
          />
        </section>
      ) : (
        <Tabs className="gap-8 pt-4" value={tab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger className="w-full" value={TEAM_TAB.RESTAURANTS}>식당</TabsTrigger>
            <TabsTrigger className="w-full" value={TEAM_TAB.VOTE}>
              점심 투표
              {activeVotes.length > 0 && (
                <Badge variant={unvotedCount > 0 ? 'default' : 'secondary'} className="ml-1 h-5 px-1.5 text-[10px]">
                  {unvotedCount > 0 ? unvotedCount : activeVotes.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger className="w-full" value={TEAM_TAB.HISTORY}>히스토리</TabsTrigger>
          </TabsList>
          <TabsContent value={TEAM_TAB.RESTAURANTS}><RestaurantsTab teamId={teamId} /></TabsContent>
          <TabsContent value={TEAM_TAB.VOTE}><LunchVoteTab teamId={teamId} /></TabsContent>
          <TabsContent value={TEAM_TAB.HISTORY}><HistoryTab teamId={teamId} /></TabsContent>
        </Tabs>
      )}
    </div>
  )
}
