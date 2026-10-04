import { useParams } from 'react-router-dom'
import { BackLink } from '@/components/common/BackLink'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { CandidateList } from '@/components/vote/CandidateList'
import { CandidateManagement } from '@/components/vote/CandidateManagement'
import { ParticipationSummary } from '@/components/vote/ParticipationSummary'
import { VoteDecisionPanel } from '@/components/vote/VoteDecisionPanel'
import { VoteDetailHeader } from '@/components/vote/VoteDetailHeader'
import { VoteManagementActions } from '@/components/vote/VoteManagementActions'
import { VoteDeleteMenu } from '@/components/vote/VoteDeleteMenu'
import { VOTE_STATUS } from '@/constants/vote'
import { ROUTES, TEAM_TAB } from '@/constants/routes'
import { useVoteSession } from '@/hooks/vote/useVoteSession'

export function VoteDetailPage() {
  const { teamId = '', sessionId = '' } = useParams()
  const {
    session, creatorNickname, candidates, participatingMembers, nonParticipatingMembers,
    isUpdatingParticipation, setMemberParticipation, results, winnerCandidates, currentMember,
    canEdit, canDelete, canVote, canRevote, isLoading, isError,
  } = useVoteSession(teamId, sessionId)

  const teamVotePath = `${ROUTES.TEAM_DETAIL(teamId)}?tab=${TEAM_TAB.VOTE}`

  if (isLoading) return <div className="space-y-6"><BackLink to={teamVotePath}>팀으로 가기</BackLink><ListSkeleton count={4} /></div>
  if (isError || !session) return <div className="space-y-6"><BackLink to={teamVotePath}>팀으로 가기</BackLink><ErrorState message="투표를 찾을 수 없습니다." /></div>

  const winnerCandidateIds = winnerCandidates.map(({ id }) => id)
  const isOpen = session.status === VOTE_STATUS.OPEN
  const canAddCandidate = isOpen

  return (
    <div className="space-y-6">
      <BackLink to={teamVotePath}>팀으로 가기</BackLink>
      <div className="relative flex flex-wrap items-start justify-between gap-3 pr-10">
        {canDelete && <VoteDeleteMenu teamId={teamId} sessionId={session.id} className="absolute top-0 right-0" />}
        <VoteDetailHeader session={session} creatorNickname={creatorNickname ?? ''} teamId={teamId} canEdit={canEdit} />
        <VoteManagementActions teamId={teamId} session={session} canEdit={canEdit} canRevote={canRevote} />
      </div>
      <ParticipationSummary
        participants={participatingMembers}
        nonParticipants={nonParticipatingMembers}
        currentMemberId={currentMember?.id}
        isUpdating={isUpdatingParticipation}
        canToggle={isOpen}
        canManageParticipants={isOpen}
        onSetParticipation={setMemberParticipation}
      />
      <VoteDecisionPanel teamId={teamId} sessionId={sessionId} status={session.status} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">후보 {candidates.length}</h2>
          <CandidateList teamId={teamId} sessionId={sessionId} candidates={candidates} results={results} winnerCandidateIds={winnerCandidateIds} canVote={canVote} canDelete={isOpen} />
        </div>
        <div className="space-y-4">
          <CandidateManagement teamId={teamId} sessionId={sessionId} candidates={candidates} canAdd={canAddCandidate} />
        </div>
      </div>
    </div>
  )
}
