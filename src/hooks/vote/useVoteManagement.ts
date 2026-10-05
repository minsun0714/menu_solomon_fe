import {
  useCloseVoteMutation,
  useDeleteVoteMutation,
  useRevoteMutation,
  useUpdateVoteMutation,
} from './mutations/useVoteSessionMutations'

export function useVoteManagement(teamId: string, sessionId: string) {
  const { mutate: update, isPending: isUpdating } = useUpdateVoteMutation(sessionId, teamId)
  const { mutate: remove, isPending: isDeleting } = useDeleteVoteMutation(sessionId, teamId)
  const { mutate: revote, isPending: isRevoting } = useRevoteMutation(sessionId, teamId)
  const { mutate: close, isPending: isClosing } = useCloseVoteMutation(sessionId, teamId)

  return {
    isPending: isUpdating || isDeleting || isRevoting || isClosing,
    updateClosesAt: (closesAt: string, onDone?: () => void, onError?: (error: Error) => void) =>
      update({ closesAt }, { onSuccess: onDone, onError }),
    updateName: (name: string, onDone?: () => void) => update({ name }, { onSuccess: onDone }),
    deleteVote: (onDeleted?: () => void) => remove(undefined, { onSuccess: onDeleted }),
    closeVote: (onClosed?: () => void) => close(undefined, { onSuccess: onClosed }),
    revote: (onRestarted?: () => void) => revote(undefined, { onSuccess: onRestarted }),
  }
}
