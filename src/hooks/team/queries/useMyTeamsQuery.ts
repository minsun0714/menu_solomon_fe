import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { teamService } from '@/services/teamService'

export function useMyTeamsQuery() {
  return useQuery({ queryKey: queryKeys.team.mine, queryFn: teamService.getMyTeams })
}
