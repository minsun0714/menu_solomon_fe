import { TOAST_MESSAGES } from '@/constants/messages'
import { useAppMutation } from '@/hooks/shared/useAppMutation'
import { queryKeys } from '@/queries/queryKeys'
import { voteService } from '@/services/voteService'

export function useUpdateTeamParticipationMutation(teamId: string) {
  return useAppMutation({
    mutationFn: (participating: boolean) => voteService.updateTeamParticipation(teamId, participating),
    invalidateKeys: () => [queryKeys.vote.teamParticipation(teamId), queryKeys.vote.all],
    successMessage: TOAST_MESSAGES.PARTICIPATION_UPDATED,
  })
}

export function useUpdateParticipationMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: (participating: boolean) => voteService.updateParticipation(sessionId, participating),
    invalidateKeys: () => [queryKeys.vote.participants(sessionId), queryKeys.vote.sessions(teamId)],
    successMessage: TOAST_MESSAGES.PARTICIPATION_UPDATED,
  })
}
