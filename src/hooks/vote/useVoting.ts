import { useState } from 'react'
import { useDeleteBallotMutation, useSubmitBallotMutation, useUpdateBallotMutation } from './mutations/useBallotMutations'
import { useVoteSessionData } from './useVoteSessionData'

export function useVoting(teamId: string, sessionId: string) {
  const { currentUserBallots } = useVoteSessionData(teamId, sessionId)
  const [pendingCandidateIds, setPendingCandidateIds] = useState<string[] | null>(null)
  const { mutate: submit, isPending: isSubmitting } = useSubmitBallotMutation(sessionId, teamId)
  const { mutate: update, isPending: isUpdating } = useUpdateBallotMutation(sessionId, teamId)
  const { mutate: cancel, isPending: isCanceling } = useDeleteBallotMutation(sessionId, teamId)

  const savedCandidateIds = currentUserBallots.map(({ candidateId }) => candidateId)
  const selectedCandidateIds = pendingCandidateIds ?? savedCandidateIds
  const hasVoted = currentUserBallots.length > 0
  const clearSelection = () => setPendingCandidateIds(null)
  const toggleCandidate = (candidateId: string) => setPendingCandidateIds((pending) => {
    const current = pending ?? savedCandidateIds
    return current.includes(candidateId) ? current.filter((id) => id !== candidateId) : [...current, candidateId]
  })

  const vote = () => {
    if (selectedCandidateIds.length > 0) submit(selectedCandidateIds, { onSuccess: clearSelection })
  }
  const changeVote = () => {
    if (selectedCandidateIds.length > 0) update(selectedCandidateIds, { onSuccess: clearSelection })
  }
  const cancelVote = () => {
    if (hasVoted) cancel(undefined, { onSuccess: clearSelection })
  }

  return {
    selectedCandidateIds,
    toggleCandidate,
    hasVoted,
    isSelectionChanged: [...selectedCandidateIds].sort().join(',') !== [...savedCandidateIds].sort().join(','),
    isPending: isSubmitting || isUpdating || isCanceling,
    vote,
    changeVote,
    cancelVote,
  }
}
