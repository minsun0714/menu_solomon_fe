import { useAuth } from '@/hooks/auth/useAuth'
import { useCreateTeamMutation } from './mutations/useTeamMutations'
import { useMyTeamsQuery } from './queries/useMyTeamsQuery'
import type { TeamRequest } from '@/types/team'

export function useMyTeams() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const { data: teams = [], isLoading, isError, refetch } = useMyTeamsQuery(isAuthenticated)
  const { mutate, isPending: isCreating } = useCreateTeamMutation()

  const createTeam = (request: TeamRequest, onCreated?: (teamId: string) => void) =>
    mutate(request, { onSuccess: ({ id }) => onCreated?.(id) })

  return {
    teams,
    isAuthenticated,
    isLoading: isAuthLoading || (isAuthenticated && isLoading),
    isError,
    isCreating,
    refetch,
    createTeam,
  }
}
