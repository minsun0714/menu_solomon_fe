import { TOAST_MESSAGES } from '@/constants/messages'
import { useAppMutation } from '@/hooks/shared/useAppMutation'
import { queryKeys } from '@/queries/queryKeys'
import { voteService } from '@/services/voteService'
import { analytics } from '@/lib/analytics'

function ballotInvalidation(sessionId: string, teamId: string) {
  return () => [queryKeys.vote.results(sessionId), queryKeys.vote.sessions(teamId)]
}

export function useSubmitBallotMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: (candidateIds: string[]) => voteService.saveBallots(teamId, sessionId, candidateIds),
    invalidateKeys: ballotInvalidation(sessionId, teamId),
    trackSuccess: (_, candidateIds) => analytics.track('ballot_submitted', {
      team_id: teamId,
      vote_id: sessionId,
      candidate_count: candidateIds.length,
      operation: 'created',
    }),
    successMessage: TOAST_MESSAGES.VOTE_SUBMITTED,
  })
}

export function useUpdateBallotMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: (candidateIds: string[]) => voteService.saveBallots(teamId, sessionId, candidateIds),
    invalidateKeys: ballotInvalidation(sessionId, teamId),
    trackSuccess: (_, candidateIds) => analytics.track('ballot_submitted', {
      team_id: teamId,
      vote_id: sessionId,
      candidate_count: candidateIds.length,
      operation: 'updated',
    }),
    successMessage: TOAST_MESSAGES.VOTE_CHANGED,
  })
}

export function useDeleteBallotMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: () => voteService.deleteBallots(teamId, sessionId),
    invalidateKeys: ballotInvalidation(sessionId, teamId),
    successMessage: TOAST_MESSAGES.VOTE_CANCELED,
  })
}
