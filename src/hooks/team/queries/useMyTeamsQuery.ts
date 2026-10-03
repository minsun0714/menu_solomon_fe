import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { teamService } from '@/services/teamService'

export function useMyTeamsQuery(enabled: boolean) {
  return useQuery({ queryKey: queryKeys.team.all, queryFn: teamService.getMyTeams, enabled })
}
