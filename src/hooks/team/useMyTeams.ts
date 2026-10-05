import { useAuth } from '@/hooks/auth/useAuth'
import { useCreateTeamMutation } from './mutations/useTeamMutations'
import { useMyTeamsQuery } from './queries/useMyTeamsQuery'
import type { TeamRequest } from '@/types/team'

export function useMyTeams() {
  const { isLoading: isAuthLoading, isError: isAuthError, refetch: refetchAuth } = useAuth()
  const { data: teams = [], isLoading: isTeamsLoading, isError: isTeamsError, refetch: refetchTeams } = useMyTeamsQuery()
  const { mutate, isPending: isCreating } = useCreateTeamMutation()

  const createTeam = (request: TeamRequest, onCreated?: (teamId: string) => void) =>
    mutate(request, { onSuccess: ({ id }) => onCreated?.(id) })
  const refetch = () => isAuthError ? refetchAuth() : refetchTeams()

  return {
    teams,
    isLoading: isAuthLoading || isTeamsLoading,
    isError: isAuthError || isTeamsError,
    isCreating,
    refetch,
    createTeam,
  }
}
