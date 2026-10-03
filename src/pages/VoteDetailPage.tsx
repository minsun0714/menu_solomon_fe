import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { CandidateList } from '@/components/vote/CandidateList'
import { CandidateManagement } from '@/components/vote/CandidateManagement'
import { ParticipationSummary } from '@/components/vote/ParticipationSummary'
import { VoteDecisionPanel } from '@/components/vote/VoteDecisionPanel'
import { VoteDetailHeader } from '@/components/vote/VoteDetailHeader'
import { VoteManagementActions } from '@/components/vote/VoteManagementActions'
import { VOTE_STATUS } from '@/constants/vote'
import { ROUTES } from '@/constants/routes'
import { useRequireAuth } from '@/hooks/auth/AuthPromptContext'
import { useVoteSession } from '@/hooks/vote/useVoteSession'

export function VoteDetailPage() {
  const { teamId = '', sessionId = '' } = useParams()
  const {
    session, creatorNickname, candidates, participatingMembers, nonParticipatingMembers, isParticipating,
    isUpdatingParticipation, setParticipation, results, winnerCandidates,
    canEdit, canVote, canRevote, isLoading, isError,
  } = useVoteSession(teamId, sessionId)
  const { requireAuth } = useRequireAuth()

  const handleToggleParticipation = () => requireAuth(() => setParticipation(!isParticipating))

  if (isLoading) return <ListSkeleton count={4} />
  if (isError || !session) return <ErrorState message="투표를 찾을 수 없습니다." />

  const winnerCandidateIds = winnerCandidates.map(({ id }) => id)
  const isOpen = session.status === VOTE_STATUS.OPEN
  const canAddCandidate = isOpen

  return (
    <div className="space-y-6">
      <Link to={ROUTES.TEAM_DETAIL(teamId)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> 팀으로 돌아가기
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <VoteDetailHeader session={session} creatorNickname={creatorNickname ?? ''} />
        <VoteManagementActions teamId={teamId} session={session} canEdit={canEdit} canRevote={canRevote} />
      </div>
      <ParticipationSummary
        participants={participatingMembers}
        nonParticipants={nonParticipatingMembers}
        isParticipating={isParticipating}
        isUpdating={isUpdatingParticipation}
        canToggle={isOpen}
        onToggleParticipation={handleToggleParticipation}
      />
      <VoteDecisionPanel teamId={teamId} sessionId={sessionId} status={session.status} canRevote={canRevote} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">후보 {candidates.length}</h2>
          <CandidateList teamId={teamId} sessionId={sessionId} candidates={candidates} results={results} winnerCandidateIds={winnerCandidateIds} canVote={canVote} />
        </div>
        <div className="space-y-4">
          <CandidateManagement teamId={teamId} sessionId={sessionId} candidates={candidates} canAdd={canAddCandidate} />
        </div>
      </div>
    </div>
  )
}
