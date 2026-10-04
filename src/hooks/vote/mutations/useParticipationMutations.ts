import { TOAST_MESSAGES } from '@/constants/messages'
import { useAppMutation } from '@/hooks/shared/useAppMutation'
import { queryKeys } from '@/queries/queryKeys'
import { voteService } from '@/services/voteService'

export function useUpdateVoteParticipationMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: ({ teamMemberId, participating }: { teamMemberId: string; participating: boolean }) =>
      voteService.updateParticipation(teamId, sessionId, teamMemberId, participating),
    invalidateKeys: () => [queryKeys.vote.participants(sessionId), queryKeys.vote.results(sessionId), queryKeys.vote.sessions(teamId)],
    successMessage: TOAST_MESSAGES.PARTICIPATION_UPDATED,
  })
}
