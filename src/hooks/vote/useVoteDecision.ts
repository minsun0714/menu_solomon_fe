import { useTeamPermissions } from '@/hooks/team/useTeamPermissions'
import { canConfirmLunch, canEditDecision } from '@/domain/voteRules'
import {
  useConfirmLunchMutation,
  useDeleteDecisionMutation,
  useUpdateDecisionMutation,
} from './mutations/useDecisionMutations'
import { useVoteSessionData } from './useVoteSessionData'

export function useVoteDecision(teamId: string, sessionId: string) {
  const { session, decision, candidates, winnerCandidates, isTied, isCreator } = useVoteSessionData(teamId, sessionId)
  const { members } = useTeamPermissions(teamId)
  const { mutate: confirm, isPending: isConfirming } = useConfirmLunchMutation(sessionId, teamId)
  const { mutate: update, isPending: isUpdating } = useUpdateDecisionMutation(sessionId, teamId)
  const { mutate: remove, isPending: isDeleting } = useDeleteDecisionMutation(sessionId, teamId)

  const decidedCandidate = candidates.find(({ restaurantId }) => restaurantId === decision?.restaurantId)
  const confirmedBy = members.find(({ id }) => id === decision?.confirmedByTeamMemberId)
  const confirmableCandidates = isTied ? winnerCandidates : candidates

  return {
    currentDecision: decision,
    decidedRestaurant: decidedCandidate?.restaurant,
    confirmedByNickname: confirmedBy?.user.nickname ?? null,
    winnerCandidates,
    confirmableCandidates,
    isTied,
    canConfirm: session ? canConfirmLunch(session, decision, isCreator) : false,
    canEditDecision: canEditDecision(decision, isCreator),
    isPending: isConfirming || isUpdating || isDeleting,
    confirm: (restaurantId: string) => confirm(restaurantId),
    editDecision: (restaurantId: string) => {
      if (decision) update(restaurantId)
    },
    deleteDecision: () => {
      if (decision) remove(undefined)
    },
  }
}
