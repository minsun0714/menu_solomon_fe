import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Vote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { useLunchVotes } from '@/hooks/vote/useLunchVotes'
import { ActiveVoteSession } from './ActiveVoteSession'
import { ClosedVoteResultCard } from './ClosedVoteResultCard'
import { CreateVoteDialog } from './CreateVoteDialog'
import { VoteDecisionDialog } from './VoteDecisionDialog'
import type { VoteSessionSummary } from '@/types/vote'

const DEFAULT_CLOSED_VOTE_COUNT = 3

export function LunchVoteTab({ teamId }: { teamId: string }) {
  const [showAllClosedVotes, setShowAllClosedVotes] = useState(false)
  const [decisionSession, setDecisionSession] = useState<VoteSessionSummary | null>(null)
  const [candidatePickerVoteId, setCandidatePickerVoteId] = useState<string | null>(null)
  const {
    activeSessions,
    pastSessions,
    isLoading,
    isError,
    isCreating,
    createVote,
  } = useLunchVotes(teamId)

  if (isLoading) return <ListSkeleton />
  if (isError) return <ErrorState />

  const visiblePastSessions = showAllClosedVotes ? pastSessions : pastSessions.slice(0, DEFAULT_CLOSED_VOTE_COUNT)
  const hasMorePastSessions = pastSessions.length > DEFAULT_CLOSED_VOTE_COUNT

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">점심 투표</h2>
        <CreateVoteButton isCreating={isCreating} onCreate={createVote} />
      </div>
      <section className="space-y-4">
        <h3 className="font-semibold">진행 중 <span className="text-muted-foreground">{activeSessions.length}</span></h3>
        {activeSessions.length === 0 ? (
          <EmptyState icon={Vote} title="진행 중인 투표가 없어요" />
        ) : (
          <div className="grid gap-4">
            {activeSessions.map(({ id }) => (
              <ActiveVoteSession
                key={id}
                teamId={teamId}
                sessionId={id}
                openCandidatePicker={candidatePickerVoteId === id}
                onCandidatePickerClose={() => setCandidatePickerVoteId(null)}
              />
            ))}
          </div>
        )}
      </section>

      {pastSessions.length > 0 && (
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">마감된 투표 <span className="text-muted-foreground">{pastSessions.length}</span></h3>
              <p className="mt-1 text-sm text-muted-foreground">최종 결과를 확인하거나 확정 대기 중인 투표를 처리하세요.</p>
            </div>
            {hasMorePastSessions && (
              <Button variant="ghost" size="sm" onClick={() => setShowAllClosedVotes((value) => !value)}>
                {showAllClosedVotes ? <ChevronUp /> : <ChevronDown />}
                {showAllClosedVotes ? '접기' : '전체 보기'}
              </Button>
            )}
          </div>
          <div className="grid gap-3">
            {visiblePastSessions.map((session) => (
              <ClosedVoteResultCard
                key={session.id}
                teamId={teamId}
                session={session}
                onManageDecision={() => setDecisionSession(session)}
                onRestartForCandidate={setCandidatePickerVoteId}
              />
            ))}
          </div>
        </section>
      )}
      {decisionSession && (
        <VoteDecisionDialog
          teamId={teamId}
          sessionId={decisionSession.id}
          status={decisionSession.status}
          open
          onOpenChange={(nextOpen) => !nextOpen && setDecisionSession(null)}
        />
      )}
    </div>
  )
}

type CreateVoteButtonProps = {
  isCreating: boolean
  onCreate: (name: string | undefined, closesAt: string, onDone: () => void, onError: (error: Error) => void) => void
}

function CreateVoteButton({ isCreating, onCreate }: CreateVoteButtonProps) {
  return (
    <CreateVoteDialog
      trigger={<Button><Plus /> 투표 만들기</Button>}
      isSubmitting={isCreating}
      onSubmit={onCreate}
    />
  )
}
