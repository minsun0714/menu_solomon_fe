import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { teamService } from '@/services/teamService'

export function useTeamDetailQuery(teamId: string) {
  return useQuery({ queryKey: queryKeys.team.detail(teamId), queryFn: () => teamService.getTeam(teamId) })
}
