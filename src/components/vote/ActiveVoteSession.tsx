import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { VOTE_STATUS } from '@/constants/vote'
import { useVoteSession } from '@/hooks/vote/useVoteSession'
import { CandidateList } from './CandidateList'
import { CandidateManagement } from './CandidateManagement'
import { ParticipationSummary } from './ParticipationSummary'
import { VoteDetailHeader } from './VoteDetailHeader'
import { VoteManagementActions } from './VoteManagementActions'
import { VoteDeleteMenu } from './VoteDeleteMenu'

type ActiveVoteSessionProps = {
  teamId: string
  sessionId: string
  openCandidatePicker?: boolean
  onCandidatePickerClose?: () => void
}

export function ActiveVoteSession({ teamId, sessionId, openCandidatePicker = false, onCandidatePickerClose }: ActiveVoteSessionProps) {
  const {
    session,
    creatorNickname,
    candidates,
    participatingMembers,
    nonParticipatingMembers,
    isUpdatingParticipation,
    setMemberParticipation,
    results,
    winnerCandidates,
    canEdit, canDelete,
    canVote,
    canRevote,
    currentMember,
    isLoading,
    isError,
  } = useVoteSession(teamId, sessionId)

  if (isLoading) return <ListSkeleton count={2} />
  if (isError || !session) return <ErrorState message="투표를 불러오지 못했습니다." />

  const isOpen = session.status === VOTE_STATUS.OPEN

  return (
    <section className="relative space-y-5 rounded-xl border bg-card p-5 shadow-xs">
      {canDelete && <VoteDeleteMenu teamId={teamId} sessionId={session.id} className="absolute top-3 right-3" />}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-3">
          <VoteDetailHeader session={session} creatorNickname={creatorNickname ?? ''} teamId={teamId} canEdit={canEdit} />
          <VoteManagementActions teamId={teamId} session={session} canEdit={canEdit} canRevote={canRevote} />
        </div>
        <div className="pr-8">
          <ParticipationSummary
            participants={participatingMembers}
            nonParticipants={nonParticipatingMembers}
            currentMemberId={currentMember?.id}
            isUpdating={isUpdatingParticipation}
            canToggle={isOpen}
            canManageParticipants={isOpen}
            onSetParticipation={setMemberParticipation}
            compact
          />
        </div>
      </div>

      <div className="space-y-4">
        <CandidateManagement
          teamId={teamId}
          sessionId={sessionId}
          candidates={candidates}
          canAdd={isOpen}
          initiallyOpen={openCandidatePicker}
          onPickerClose={onCandidatePickerClose}
        />
        <CandidateList
          teamId={teamId}
          sessionId={sessionId}
          candidates={candidates}
          results={results}
          winnerCandidateIds={winnerCandidates.map(({ id }) => id)}
          canVote={canVote}
          canDelete={isOpen}
        />
      </div>
    </section>
  )
}
