import { useAuth } from '@/hooks/auth/useAuth'
import { useJoinTeamMutation } from './mutations/useTeamMutations'
import { useTeamPreviewQuery } from './queries/useTeamPreviewQuery'

export function useTeamPreview(inviteToken: string) {
  const { user } = useAuth()
  const { data: preview, isLoading, isError } = useTeamPreviewQuery(inviteToken)
  const { mutate, isPending: isJoining } = useJoinTeamMutation(inviteToken)

  const isAlreadyMember = preview?.members.some(({ userId }) => userId === user?.id) ?? false
  const joinTeam = (onJoined?: (teamId: string) => void) => {
    if (!preview) return
    mutate(undefined, { onSuccess: ({ teamId }) => onJoined?.(teamId) })
  }

  return { preview, isLoading, isError, isJoining, isAlreadyMember, joinTeam }
}
