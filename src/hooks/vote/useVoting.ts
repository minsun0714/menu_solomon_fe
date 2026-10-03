import { useState } from 'react'
import { useDeleteBallotMutation, useSubmitBallotMutation, useUpdateBallotMutation } from './mutations/useBallotMutations'
import { useVoteSessionData } from './useVoteSessionData'

export function useVoting(teamId: string, sessionId: string) {
  const { currentUserBallot } = useVoteSessionData(teamId, sessionId)
  const [pendingCandidateId, setPendingCandidateId] = useState<string | null>(null)
  const { mutate: submit, isPending: isSubmitting } = useSubmitBallotMutation(sessionId, teamId)
  const { mutate: update, isPending: isUpdating } = useUpdateBallotMutation(sessionId, teamId)
  const { mutate: cancel, isPending: isCanceling } = useDeleteBallotMutation(sessionId, teamId)

  const selectedCandidateId = pendingCandidateId ?? currentUserBallot?.candidateId ?? null
  const hasVoted = currentUserBallot !== undefined
  const clearSelection = () => setPendingCandidateId(null)

  const vote = () => {
    if (selectedCandidateId) submit(selectedCandidateId, { onSuccess: clearSelection })
  }
  const changeVote = () => {
    if (selectedCandidateId && currentUserBallot) {
      update({ ballotId: currentUserBallot.id, candidateId: selectedCandidateId }, { onSuccess: clearSelection })
    }
  }
  const cancelVote = () => {
    if (currentUserBallot) cancel(currentUserBallot.id, { onSuccess: clearSelection })
  }

  return {
    selectedCandidateId,
    selectCandidate: setPendingCandidateId,
    hasVoted,
    isSelectionChanged: selectedCandidateId !== (currentUserBallot?.candidateId ?? null),
    isPending: isSubmitting || isUpdating || isCanceling,
    vote,
    changeVote,
    cancelVote,
  }
}
