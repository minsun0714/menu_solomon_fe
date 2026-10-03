import { useEffect } from 'react'
import { Utensils } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { useVoting } from '@/hooks/vote/useVoting'
import { useDeleteCandidateMutation } from '@/hooks/vote/mutations/useCandidateMutations'
import { VoteCandidateCard } from './VoteCandidateCard'
import type { CandidateDetail, VoteResult } from '@/types/vote'

type CandidateListProps = {
  teamId: string
  sessionId: string
  candidates: CandidateDetail[]
  results: VoteResult[]
  winnerCandidateIds: string[]
  canVote: boolean
  canDelete: boolean
}

export function CandidateList({ teamId, sessionId, candidates, results, winnerCandidateIds, canVote, canDelete }: CandidateListProps) {
  const { selectedCandidateId, selectCandidate, hasVoted, isSelectionChanged, isPending, vote, changeVote, cancelVote } = useVoting(teamId, sessionId)
  const { mutate: deleteCandidate, isPending: isDeleting } = useDeleteCandidateMutation(sessionId, teamId)

  useEffect(() => {
    if (selectedCandidateId && !candidates.some(({ id }) => id === selectedCandidateId)) selectCandidate(null)
  }, [candidates, selectCandidate, selectedCandidateId])

  const handleSelect = (candidateId: string) => selectCandidate(candidateId)
  const handleSubmit = hasVoted ? changeVote : vote
  const resultOf = (candidateId: string): VoteResult =>
    results.find((result) => result.candidateId === candidateId) ?? { candidateId, voteCount: 0, percentage: 0 }

  if (candidates.length === 0) {
    return <EmptyState icon={Utensils} title="아직 후보가 없어요" description="식당을 추가하거나 추천 후보를 선택해 보세요." />
  }

  return (
    <div className="space-y-3">
      {candidates.map((candidate) => (
        <VoteCandidateCard
          key={candidate.id}
          candidate={candidate}
          result={resultOf(candidate.id)}
          isSelected={selectedCandidateId === candidate.id}
          isWinner={winnerCandidateIds.includes(candidate.id)}
          isSelectable={canVote && !isPending}
          canDelete={canDelete}
          isDeleting={isDeleting}
          onSelect={handleSelect}
          onDelete={deleteCandidate}
        />
      ))}
      {canVote && (
        <div className="flex flex-wrap justify-end gap-2">
          {hasVoted && (
            <Button variant="outline" disabled={isPending} onClick={cancelVote}>투표 취소</Button>
          )}
          <Button disabled={!selectedCandidateId || isPending || (hasVoted && !isSelectionChanged)} onClick={handleSubmit}>
            {hasVoted ? '투표 변경' : '투표하기'}
          </Button>
        </div>
      )}
    </div>
  )
}
