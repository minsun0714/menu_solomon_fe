import { TOAST_MESSAGES } from '@/constants/messages'
import { useAppMutation } from '@/hooks/shared/useAppMutation'
import { queryKeys } from '@/queries/queryKeys'
import { voteService } from '@/services/voteService'

function ballotInvalidation(sessionId: string, teamId: string) {
  return () => [queryKeys.vote.results(sessionId), queryKeys.vote.sessions(teamId)]
}

export function useSubmitBallotMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: (candidateId: string) => voteService.submitBallot(sessionId, candidateId),
    invalidateKeys: ballotInvalidation(sessionId, teamId),
    successMessage: TOAST_MESSAGES.VOTE_SUBMITTED,
  })
}

type UpdateBallotVariables = { ballotId: string; candidateId: string }

export function useUpdateBallotMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: ({ ballotId, candidateId }: UpdateBallotVariables) => voteService.updateBallot(ballotId, candidateId),
    invalidateKeys: ballotInvalidation(sessionId, teamId),
    successMessage: TOAST_MESSAGES.VOTE_CHANGED,
  })
}

export function useDeleteBallotMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: (ballotId: string) => voteService.deleteBallot(ballotId),
    invalidateKeys: ballotInvalidation(sessionId, teamId),
    successMessage: TOAST_MESSAGES.VOTE_CANCELED,
  })
}
