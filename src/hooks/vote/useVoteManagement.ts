import {
  useDeleteVoteMutation,
  useRevoteMutation,
  useUpdateVoteMutation,
} from './mutations/useVoteSessionMutations'
import { useUpdateParticipationMutation } from './mutations/useParticipationMutations'
import { useVoteSessionData } from './useVoteSessionData'

export function useVoteManagement(teamId: string, sessionId: string) {
  const { winnerCandidates, isTied } = useVoteSessionData(teamId, sessionId)
  const { mutate: update, isPending: isUpdating } = useUpdateVoteMutation(sessionId, teamId)
  const { mutate: remove, isPending: isDeleting } = useDeleteVoteMutation(sessionId, teamId)
  const { mutate: revote, isPending: isRevoting } = useRevoteMutation(sessionId, teamId)
  const { mutate: updateParticipation, isPending: isUpdatingParticipation } = useUpdateParticipationMutation(sessionId, teamId)

  const tiedCandidateIds = isTied ? winnerCandidates.map(({ id }) => id) : undefined

  return {
    isPending: isUpdating || isDeleting || isRevoting || isUpdatingParticipation,
    updateClosesAt: (closesAt: string, onDone?: () => void) => update({ closesAt }, { onSuccess: onDone }),
    deleteVote: (onDeleted?: () => void) => remove(undefined, { onSuccess: onDeleted }),
    revote: () => revote(undefined),
    revoteAmongTied: () => revote(tiedCandidateIds),
    updateParticipation: (participating: boolean) => updateParticipation(participating),
  }
}
