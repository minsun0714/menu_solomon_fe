import { TOAST_MESSAGES } from '@/constants/messages'
import { useAppMutation } from '@/hooks/shared/useAppMutation'
import { queryKeys } from '@/queries/queryKeys'
import { voteService } from '@/services/voteService'

function decisionInvalidation(sessionId: string, teamId: string) {
  return () => [
    queryKeys.vote.detail(sessionId),
    queryKeys.vote.sessions(teamId),
    queryKeys.team.all,
    queryKeys.history.all,
  ]
}

export function useConfirmLunchMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: (restaurantId: string) => voteService.confirmLunch(teamId, sessionId, restaurantId),
    invalidateKeys: decisionInvalidation(sessionId, teamId),
    successMessage: TOAST_MESSAGES.LUNCH_CONFIRMED,
  })
}

export function useUpdateDecisionMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: (restaurantId: string) => voteService.updateDecision(teamId, sessionId, restaurantId),
    invalidateKeys: decisionInvalidation(sessionId, teamId),
    successMessage: TOAST_MESSAGES.DECISION_UPDATED,
  })
}

export function useDeleteDecisionMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: () => voteService.deleteDecision(teamId, sessionId),
    invalidateKeys: decisionInvalidation(sessionId, teamId),
    successMessage: TOAST_MESSAGES.DECISION_DELETED,
  })
}
