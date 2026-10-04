import { useCreateTeamMutation } from './mutations/useTeamMutations'
import { useMyTeamsQuery } from './queries/useMyTeamsQuery'
import type { TeamRequest, TeamSort } from '@/types/team'

export function useMyTeams(sort: TeamSort = 'LATEST_LUNCH') {
  const { data: teams = [], isLoading, isError, refetch } = useMyTeamsQuery(sort)
  const { mutate, isPending: isCreating } = useCreateTeamMutation()

  const createTeam = (request: TeamRequest, onCreated?: (teamId: string) => void) =>
    mutate(request, { onSuccess: ({ id }) => onCreated?.(id) })

  return {
    teams,
    isLoading,
    isError,
    isCreating,
    refetch,
    createTeam,
  }
}
